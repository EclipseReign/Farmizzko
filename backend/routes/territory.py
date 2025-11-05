from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.territory import Territory, TerritoryClear
from models.pest import Pest
from utils.auth import get_current_user
from game_data import TERRITORY_DATA, PESTS_DATA
from datetime import datetime
import random
import uuid

router = APIRouter()

@router.get("")
async def get_territory(request: Request, user_id: str = Depends(get_current_user)):
    """Get all territory elements"""
    db = request.app.state.db
    territory_collection = db.territory
    
    territories = await territory_collection.find({"user_id": user_id}).to_list(length=200)
    
    updated_territories = []
    for territory in territories:
        territory_data = TERRITORY_DATA.get(territory["type"])
        if not territory_data:
            continue
        
        status_val = territory["status"]
        progress = 0
        
        if status_val == "clearing" and territory["clear_started_at"]:
            elapsed = (datetime.utcnow() - territory["clear_started_at"]).total_seconds()
            progress = min(100, (elapsed / territory["clear_time"]) * 100)
            
            if elapsed >= territory["clear_time"]:
                status_val = "cleared"
        
        updated_territories.append({
            "id": territory["id"],
            "type": territory["type"],
            "position": territory["position"],
            "location": territory["location"],
            "status": status_val,
            "progress": round(progress, 2),
            "image": territory_data["image"]
        })
    
    return {"territories": updated_territories}

@router.post("/clear")
async def clear_territory(
    clear_data: TerritoryClear,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Clear a territory element"""
    db = request.app.state.db
    users_collection = db.users
    territory_collection = db.territory
    pests_collection = db.pests
    
    # Find territory
    territory = await territory_collection.find_one({
        "user_id": user_id,
        "position": clear_data.position,
        "location": clear_data.location
    })
    
    if not territory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Territory element not found"
        )
    
    territory_data = TERRITORY_DATA.get(territory["type"])
    if not territory_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid territory type"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user has enough energy
    resources = user["resources"]
    energy_cost = territory_data["clear_cost"]["energy"]
    if resources.get("energy", 0) < energy_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough energy"
        )
    
    # Deduct energy
    resources["energy"] -= energy_cost
    
    # Add rewards
    for resource, amount in territory_data["rewards"].items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Add experience
    new_experience = user["experience"] + territory_data["experience"]
    
    # Update user
    await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "resources": resources,
                "experience": new_experience
            }
        }
    )
    
    # Check for pests
    pest_spawned = None
    if territory_data["pest_chance"]:
        for pest_type, chance in territory_data["pest_chance"].items():
            if random.random() < chance:
                # Spawn pest at nearby position
                pest_spawned = {
                    "id": str(uuid.uuid4()),
                    "type": pest_type,
                    "position": clear_data.position  # Simplified
                }
                
                new_pest = Pest(
                    user_id=user_id,
                    location=clear_data.location,
                    type=pest_type,
                    position=clear_data.position,
                    status="active"
                )
                
                await pests_collection.insert_one(new_pest.model_dump())
                break
    
    # Remove territory
    await territory_collection.delete_one({"id": territory["id"]})
    
    return {
        "success": True,
        "rewards": territory_data["rewards"],
        "experience_gained": territory_data["experience"],
        "pest_spawned": pest_spawned,
        "updatedResources": resources,
        "newExperience": new_experience
    }

@router.post("/generate")
async def generate_territory(
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Generate random territory elements for testing"""
    db = request.app.state.db
    territory_collection = db.territory
    
    # Generate 20 random territory elements
    territory_types = list(TERRITORY_DATA.keys())
    territories = []
    
    for i in range(20):
        territory_type = random.choice(territory_types)
        territory_data = TERRITORY_DATA[territory_type]
        
        new_territory = Territory(
            user_id=user_id,
            location="main",
            type=territory_type,
            position=f"{random.randint(0, 15)}-{random.randint(0, 15)}",
            status="active",
            clear_time=territory_data["clear_time"]
        )
        
        territories.append(new_territory.model_dump())
    
    await territory_collection.insert_many(territories)
    
    return {"success": True, "generated": len(territories)}
