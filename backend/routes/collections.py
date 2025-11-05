from fastapi import APIRouter, HTTPException, status, Request, Depends
from utils.auth import get_current_user
from game_data import COLLECTIONS_DATA
from datetime import datetime
import uuid

router = APIRouter()

@router.get("")
async def get_collections(request: Request, user_id: str = Depends(get_current_user)):
    """Get all collections with user's progress"""
    db = request.app.state.db
    collections_collection = db.collection_items
    
    # Get all user's collection items
    user_items = await collections_collection.find({"user_id": user_id}).to_list(length=200)
    
    # Organize items by item_id
    items_dict = {}
    for item in user_items:
        items_dict[item["item_id"]] = item["quantity"]
    
    # Build collections list
    collections_list = []
    for collection_id, collection_data in COLLECTIONS_DATA.items():
        items_collected = {}
        can_exchange = True
        
        for item_id, needed in collection_data["items_needed"].items():
            collected = items_dict.get(item_id, 0)
            items_collected[item_id] = collected
            
            if collected < needed:
                can_exchange = False
        
        collections_list.append({
            "id": collection_id,
            "name": collection_data["name"],
            "items": collection_data["items"],
            "items_needed": collection_data["items_needed"],
            "items_collected": items_collected,
            "can_exchange": can_exchange,
            "rewards": collection_data["rewards"],
            "image": collection_data["image"]
        })
    
    return {"collections": collections_list, "items": items_dict}

@router.post("/{collection_id}/exchange")
async def exchange_collection(
    collection_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Exchange a completed collection for rewards"""
    db = request.app.state.db
    users_collection = db.users
    collections_collection = db.collection_items
    
    # Get collection definition
    collection_data = COLLECTIONS_DATA.get(collection_id)
    if not collection_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user has all required items
    user_items = await collections_collection.find({"user_id": user_id}).to_list(length=200)
    items_dict = {item["item_id"]: item for item in user_items}
    
    for item_id, needed in collection_data["items_needed"].items():
        item = items_dict.get(item_id)
        if not item or item["quantity"] < needed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough {item_id}"
            )
    
    # Deduct items
    for item_id, needed in collection_data["items_needed"].items():
        item = items_dict[item_id]
        new_quantity = item["quantity"] - needed
        
        if new_quantity > 0:
            await collections_collection.update_one(
                {"id": item["id"]},
                {"$set": {"quantity": new_quantity, "updated_at": datetime.utcnow()}}
            )
        else:
            await collections_collection.delete_one({"id": item["id"]})
    
    # Add rewards
    resources = user["resources"]
    new_experience = user["experience"]
    
    for reward, amount in collection_data["rewards"].items():
        if reward == "experience":
            new_experience += amount
        else:
            resources[reward] = resources.get(reward, 0) + amount
    
    # Update user
    await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "resources": resources,
                "experience": new_experience,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "rewards": collection_data["rewards"],
        "updatedResources": resources,
        "newExperience": new_experience
    }
