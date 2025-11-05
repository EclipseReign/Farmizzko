from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.user import UserResponse, Resources
from utils.auth import get_current_user
from typing import Dict

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(request: Request, user_id: str = Depends(get_current_user)):
    db = request.app.state.db
    users_collection = db.users
    
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    # Calculate energy regeneration
    resources = user["resources"]
    last_energy_update = user.get("last_energy_update", user.get("updated_at", datetime.utcnow()))
    max_energy = user.get("max_energy", 100)
    energy_regen_rate = user.get("energy_regen_rate", 1)
    
    # Calculate time passed in minutes
    time_passed = (datetime.utcnow() - last_energy_update).total_seconds() / 60
    # Regenerate 1 energy per 5 minutes
    energy_regen = int(time_passed / 5) * energy_regen_rate
    
    if energy_regen > 0 and resources.get("energy", 0) < max_energy:
        new_energy = min(resources.get("energy", 0) + energy_regen, max_energy)
        resources["energy"] = new_energy
        
        # Update in database
        await users_collection.update_one(
            {"id": user_id},
            {
                "$set": {
                    "resources.energy": new_energy,
                    "last_energy_update": datetime.utcnow()
                }
            }
        )
    
    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        level=user["level"],
        experience=user["experience"],
        resources=Resources(**resources)
    )

@router.put("/resources")
async def update_resources(
    resources: Dict[str, int],
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    users_collection = db.users
    
    # Update user resources
    result = await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "resources": resources,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"success": True, "resources": resources}

@router.put("/experience")
async def add_experience(
    experience: int,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    users_collection = db.users
    
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    new_experience = user["experience"] + experience
    new_level = user["level"]
    
    # Simple level calculation (can be enhanced)
    level_thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500]
    for i, threshold in enumerate(level_thresholds):
        if new_experience >= threshold:
            new_level = i + 1
    
    await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "experience": new_experience,
                "level": new_level,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "experience": new_experience,
        "level": new_level
    }

from datetime import datetime
