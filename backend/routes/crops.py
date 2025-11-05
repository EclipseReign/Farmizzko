from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.crop import Crop, CropCreate
from models.user import Resources
from utils.auth import get_current_user
from game_data import CROPS_DATA, COLLECTIONS_DATA
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("")
async def get_crops(request: Request, user_id: str = Depends(get_current_user)):
    """Get all user's crops"""
    db = request.app.state.db
    crops_collection = db.crops
    
    crops = await crops_collection.find({"user_id": user_id}).to_list(length=100)
    
    # Update crop status based on time
    updated_crops = []
    for crop in crops:
        crop_data = CROPS_DATA.get(crop["type"])
        if not crop_data:
            continue
            
        elapsed = (datetime.utcnow() - crop["planted_at"]).total_seconds()
        
        # Update status
        if elapsed >= crop_data["grow_time"] + crop_data["wither_time"] and not crop["protected"]:
            crop["status"] = "withered"
        elif elapsed >= crop_data["grow_time"]:
            crop["status"] = "ready"
        else:
            crop["status"] = "growing"
            
        # Calculate progress
        if crop["status"] == "growing":
            progress = min(100, (elapsed / crop_data["grow_time"]) * 100)
        else:
            progress = 100
            
        updated_crops.append({
            "id": crop["id"],
            "type": crop["type"],
            "name": crop_data["name"],
            "position": crop["position"],
            "location": crop["location"],
            "status": crop["status"],
            "progress": round(progress, 2),
            "plantedAt": crop["planted_at"].isoformat(),
            "protected": crop["protected"],
            "image": crop_data["image"]
        })
    
    return {"crops": updated_crops}

@router.post("")
async def plant_crop(
    crop_data: CropCreate,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Plant a new crop"""
    db = request.app.state.db
    users_collection = db.users
    crops_collection = db.crops
    
    # Get crop definition
    crop_def = CROPS_DATA.get(crop_data.type)
    if not crop_def:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop type"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check level requirement
    if user["level"] < crop_def["level_required"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Level {crop_def['level_required']} required"
        )
    
    # Check if user has enough resources
    resources = user["resources"]
    for resource, amount in crop_def["cost"].items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough {resource}"
            )
    
    # Check if position is already occupied
    existing_crop = await crops_collection.find_one({
        "user_id": user_id,
        "position": crop_data.position,
        "location": crop_data.location
    })
    if existing_crop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Position already occupied"
        )
    
    # Deduct resources
    for resource, amount in crop_def["cost"].items():
        resources[resource] -= amount
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources}}
    )
    
    # Create crop
    new_crop = Crop(
        user_id=user_id,
        location=crop_data.location,
        type=crop_data.type,
        name=crop_def["name"],
        position=crop_data.position,
        status="growing",
        planted_at=datetime.utcnow(),
        grow_time=crop_def["grow_time"],
        wither_time=crop_def["wither_time"],
        yield_data=crop_def["yield"],
        protected=False
    )
    
    crop_dict = new_crop.model_dump()
    await crops_collection.insert_one(crop_dict)
    
    return {
        "crop": {
            "id": new_crop.id,
            "type": new_crop.type,
            "name": new_crop.name,
            "position": new_crop.position,
            "location": new_crop.location,
            "status": new_crop.status,
            "plantedAt": new_crop.planted_at.isoformat(),
            "image": crop_def["image"]
        },
        "updatedResources": resources
    }

@router.post("/{crop_id}/harvest")
async def harvest_crop(
    crop_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Harvest a ready crop"""
    db = request.app.state.db
    users_collection = db.users
    crops_collection = db.crops
    collections_collection = db.collection_items
    
    # Get crop
    crop = await crops_collection.find_one({"id": crop_id, "user_id": user_id})
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    crop_def = CROPS_DATA.get(crop["type"])
    if not crop_def:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop type"
        )
    
    # Check if crop is ready
    elapsed = (datetime.utcnow() - crop["planted_at"]).total_seconds()
    if elapsed < crop_def["grow_time"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Crop is not ready yet"
        )
    
    # Check if withered
    if elapsed >= crop_def["grow_time"] + crop_def["wither_time"] and not crop["protected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Crop has withered"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check energy
    if user["resources"].get("energy", 0) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough energy"
        )
    
    # Add yield to user resources
    resources = user["resources"]
    resources["energy"] -= 2
    for resource, amount in crop["yield_data"].items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Add experience
    new_experience = user["experience"] + crop_def["experience"]
    
    # Collection drops
    dropped_items = []
    if "collection_drops" in crop_def:
        for item_id in crop_def["collection_drops"]:
            # Random chance to drop
            if random.random() < 0.3:  # 30% chance
                dropped_items.append(item_id)
                # Add to user's collection
                existing_item = await collections_collection.find_one({
                    "user_id": user_id,
                    "item_id": item_id
                })
                if existing_item:
                    await collections_collection.update_one(
                        {"id": existing_item["id"]},
                        {"$inc": {"quantity": 1}}
                    )
                else:
                    await collections_collection.insert_one({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "item_id": item_id,
                        "quantity": 1,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    })
    
    # Check for butterflies (if flower crop)
    butterflies_caught = 0
    if crop_def.get("butterflies", False):
        butterflies_caught = random.randint(1, 3)
        resources["butterflies"] = resources.get("butterflies", 0) + butterflies_caught
    
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
    
    # Remove crop
    await crops_collection.delete_one({"id": crop_id})
    
    return {
        "success": True,
        "harvested": crop["yield_data"],
        "experience_gained": crop_def["experience"],
        "dropped_items": dropped_items,
        "butterflies_caught": butterflies_caught,
        "updatedResources": resources,
        "newExperience": new_experience
    }

@router.delete("/{crop_id}")
async def remove_crop(
    crop_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Remove a crop (e.g., withered crop)"""
    db = request.app.state.db
    crops_collection = db.crops
    
    result = await crops_collection.delete_one({"id": crop_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    return {"success": True}

@router.post("/{crop_id}/protect")
async def protect_crop(
    crop_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Apply drought protection to crop"""
    db = request.app.state.db
    users_collection = db.users
    crops_collection = db.crops
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user has drought protection
    if user["resources"].get("drought_protection", 0) < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No drought protection available"
        )
    
    # Update crop
    result = await crops_collection.update_one(
        {"id": crop_id, "user_id": user_id},
        {"$set": {"protected": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Deduct protection
    resources = user["resources"]
    resources["drought_protection"] -= 1
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources}}
    )
    
    return {"success": True, "updatedResources": resources}

import uuid