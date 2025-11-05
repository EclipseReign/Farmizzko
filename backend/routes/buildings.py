from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.building import Building, BuildingCreate, BuildingResponse
from utils.auth import get_current_user
from utils.game_data import BUILDINGS_DATA
from datetime import datetime
from typing import List

router = APIRouter()

@router.get("", response_model=List[BuildingResponse])
async def get_buildings(request: Request, user_id: str = Depends(get_current_user)):
    db = request.app.state.db
    buildings_collection = db.buildings
    
    buildings = await buildings_collection.find({"user_id": user_id}).to_list(length=100)
    
    response_buildings = []
    for building in buildings:
        # Auto-update building status if construction is complete
        if building["status"] == "building":
            elapsed = (datetime.utcnow() - building["start_time"]).total_seconds()
            if elapsed >= building["build_time"]:
                building["status"] = "built"
                building["progress"] = 100
                building["last_collect_time"] = datetime.utcnow()
                
                await buildings_collection.update_one(
                    {"id": building["id"]},
                    {"$set": {
                        "status": "built",
                        "progress": 100,
                        "last_collect_time": datetime.utcnow()
                    }}
                )
            else:
                building["progress"] = (elapsed / building["build_time"]) * 100
        # Calculate if ready to collect
        ready_to_collect = False
        if building["status"] == "built" and building.get("production"):
            last_collect = building.get("last_collect_time")
            if last_collect:
                time_since_collect = (datetime.utcnow() - last_collect).total_seconds()
                if time_since_collect >= 60:  # 1 minute production interval
                    ready_to_collect = True
        
        response_buildings.append(
            BuildingResponse(
                id=building["id"],
                type=building["type"],
                name=building["name"],
                position=building["position"],
                status=building["status"],
                progress=building["progress"],
                startTime=building["start_time"].isoformat(),
                buildTime=building["build_time"],
                lastCollectTime=building["last_collect_time"].isoformat() if building.get("last_collect_time") else None,
                readyToCollect=ready_to_collect,
                level=building["level"],
                production=building["production"],
                image=BUILDINGS_DATA.get(building["type"], {}).get("image", "")
            )
        )
    
    return response_buildings

@router.post("", response_model=BuildingResponse)
async def create_building(
    building_data: BuildingCreate,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    buildings_collection = db.buildings
    users_collection = db.users
    
    # Get building definition
    building_def = BUILDINGS_DATA.get(building_data.buildingType)
    if not building_def:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Building type not found"
        )
    
    # Check if user can afford
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    resources = user["resources"]
    for resource, cost in building_def["cost"].items():
        if resources.get(resource, 0) < cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough {resource}"
            )
    
    # Deduct resources
    for resource, cost in building_def["cost"].items():
        resources[resource] -= cost
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources, "updated_at": datetime.utcnow()}}
    )
    
    # Create building
    new_building = Building(
        user_id=user_id,
        type=building_data.buildingType,
        name=building_def["name"],
        position=building_data.position,
        status="building",
        progress=0.0,
        start_time=datetime.utcnow(),
        build_time=building_def["time"],
        production=building_def["production"],
        level=1
    )
    
    building_dict = new_building.model_dump()
    await buildings_collection.insert_one(building_dict)
    
    return BuildingResponse(
        id=new_building.id,
        type=new_building.type,
        name=new_building.name,
        position=new_building.position,
        status=new_building.status,
        progress=new_building.progress,
        startTime=new_building.start_time.isoformat(),
        buildTime=new_building.build_time,
        lastCollectTime=None,
        readyToCollect=False,
        level=new_building.level,
        production=new_building.production,
        image=building_def.get("image", "")
    )

@router.post("/{building_id}/collect")
async def collect_building(
    building_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    buildings_collection = db.buildings
    users_collection = db.users
    
    # Get building
    building = await buildings_collection.find_one({"id": building_id, "user_id": user_id})
    if not building:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Building not found"
        )
    
    if building["status"] != "built":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Building is not ready"
        )
    
    # Check if ready to collect
    last_collect = building.get("last_collect_time")
    if last_collect:
        time_since_collect = (datetime.utcnow() - last_collect).total_seconds()
        if time_since_collect < 60:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not ready to collect yet"
            )
    
    # Add resources
    user = await users_collection.find_one({"id": user_id})
    resources = user["resources"]
    
    collected = building["production"]
    for resource, amount in collected.items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Update user resources and building
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources, "updated_at": datetime.utcnow()}}
    )
    
    await buildings_collection.update_one(
        {"id": building_id},
        {"$set": {"last_collect_time": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "collected": collected,
        "updatedResources": resources
    }

@router.delete("/{building_id}")
async def delete_building(
    building_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    buildings_collection = db.buildings
    
    result = await buildings_collection.delete_one({"id": building_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Building not found"
        )
    
    return {"success": True}
