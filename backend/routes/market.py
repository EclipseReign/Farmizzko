from fastapi import APIRouter, HTTPException, status, Request, Depends
from utils.auth import get_current_user
from utils.game_data import MARKET_ITEMS
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class PurchaseRequest(BaseModel):
    itemId: str

@router.post("/purchase")
async def purchase_item(
    purchase: PurchaseRequest,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    users_collection = db.users
    
    # Find item
    item = next((i for i in MARKET_ITEMS if i["id"] == purchase.itemId), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    resources = user["resources"]
    
    # Check if user can afford
    for resource, cost in item["cost"].items():
        if resources.get(resource, 0) < cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough {resource}"
            )
    
    # Deduct cost
    for resource, cost in item["cost"].items():
        resources[resource] -= cost
    
    # Add rewards
    for resource, amount in item["rewards"].items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Update user
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources, "updated_at": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "purchased": item["rewards"],
        "updatedResources": resources
    }
