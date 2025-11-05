from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.pest import Pest, PestChase
from utils.auth import get_current_user
from game_data import PESTS_DATA
from datetime import datetime
import uuid

router = APIRouter()

@router.get("")
async def get_pests(request: Request, user_id: str = Depends(get_current_user)):
    """Get all active pests"""
    db = request.app.state.db
    pests_collection = db.pests
    
    pests = await pests_collection.find({"user_id": user_id, "status": "active"}).to_list(length=50)
    
    pest_list = []
    for pest in pests:
        pest_data = PESTS_DATA.get(pest["type"])
        if not pest_data:
            continue
        
        pest_list.append({
            "id": pest["id"],
            "type": pest["type"],
            "name": pest_data["name"],
            "position": pest["position"],
            "location": pest["location"],
            "status": pest["status"],
            "appearedAt": pest["appeared_at"].isoformat(),
            "image": pest_data["image"]
        })
    
    return {"pests": pest_list}

@router.post("/{pest_id}/chase")
async def chase_pest(
    pest_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Chase away a pest"""
    db = request.app.state.db
    users_collection = db.users
    pests_collection = db.pests
    
    # Get pest
    pest = await pests_collection.find_one({"id": pest_id, "user_id": user_id})
    if not pest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pest not found"
        )
    
    pest_data = PESTS_DATA.get(pest["type"])
    if not pest_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid pest type"
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
    energy_cost = pest_data["chase_cost"]["energy"]
    if resources.get("energy", 0) < energy_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough energy"
        )
    
    # Deduct energy
    resources["energy"] -= energy_cost
    
    # Add rewards
    for resource, amount in pest_data["rewards"].items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Add experience
    new_experience = user["experience"] + pest_data["experience"]
    
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
    
    # Remove pest
    await pests_collection.delete_one({"id": pest_id})
    
    return {
        "success": True,
        "rewards": pest_data["rewards"],
        "experience_gained": pest_data["experience"],
        "updatedResources": resources,
        "newExperience": new_experience
    }
