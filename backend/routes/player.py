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
    
    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        level=user["level"],
        experience=user["experience"],
        resources=Resources(**user["resources"])
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
