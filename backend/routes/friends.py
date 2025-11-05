from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.friend import Friend, FriendRequest, MaterialRequestCreate, HelpFriendRequest
from utils.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

@router.get("")
async def get_friends(request: Request, user_id: str = Depends(get_current_user)):
    """Get all user's friends"""
    db = request.app.state.db
    friends_collection = db.friends
    users_collection = db.users
    
    # Find all friendships where user is involved and status is accepted
    friendships = await friends_collection.find({
        "$or": [
            {"user_id": user_id, "status": "accepted"},
            {"friend_id": user_id, "status": "accepted"}
        ]
    }).to_list(length=100)
    
    friends_list = []
    for friendship in friendships:
        # Get the friend's ID (the other person)
        friend_user_id = friendship["friend_id"] if friendship["user_id"] == user_id else friendship["user_id"]
        
        # Get friend's data
        friend = await users_collection.find_one({"id": friend_user_id})
        if friend:
            friends_list.append({
                "id": friend["id"],
                "username": friend["username"],
                "level": friend["level"],
                "experience": friend["experience"]
            })
    
    return {"friends": friends_list}

@router.post("/add")
async def add_friend(
    friend_data: FriendRequest,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Send friend request"""
    db = request.app.state.db
    users_collection = db.users
    friends_collection = db.friends
    
    # Find friend by username
    friend = await users_collection.find_one({"username": friend_data.friend_username})
    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if friend["id"] == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add yourself as friend"
        )
    
    # Check if already friends
    existing = await friends_collection.find_one({
        "$or": [
            {"user_id": user_id, "friend_id": friend["id"]},
            {"user_id": friend["id"], "friend_id": user_id}
        ]
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already friends or request pending"
        )
    
    # Create friendship (auto-accept for simplicity)
    new_friendship = Friend(
        user_id=user_id,
        friend_id=friend["id"],
        status="accepted"  # Auto-accept for MVP
    )
    
    await friends_collection.insert_one(new_friendship.model_dump())
    
    return {
        "success": True,
        "friend": {
            "id": friend["id"],
            "username": friend["username"],
            "level": friend["level"]
        }
    }

@router.post("/help")
async def help_friend(
    help_data: HelpFriendRequest,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Help a friend (visit, speed up, etc.)"""
    db = request.app.state.db
    users_collection = db.users
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Add small reward for helping
    resources = user["resources"]
    resources["gold"] = resources.get("gold", 0) + 10
    resources["experience"] = resources.get("experience", 0) + 5
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources}}
    )
    
    return {
        "success": True,
        "rewards": {"gold": 10, "experience": 5},
        "updatedResources": resources
    }

@router.get("/requests")
async def get_material_requests(request: Request, user_id: str = Depends(get_current_user)):
    """Get material requests from friends"""
    db = request.app.state.db
    material_requests_collection = db.material_requests
    friends_collection = db.friends
    users_collection = db.users
    
    # Get user's friends
    friendships = await friends_collection.find({
        "$or": [
            {"user_id": user_id, "status": "accepted"},
            {"friend_id": user_id, "status": "accepted"}
        ]
    }).to_list(length=100)
    
    friend_ids = []
    for friendship in friendships:
        friend_id = friendship["friend_id"] if friendship["user_id"] == user_id else friendship["user_id"]
        friend_ids.append(friend_id)
    
    # Get active material requests from friends
    requests = await material_requests_collection.find({
        "user_id": {"$in": friend_ids},
        "status": "active"
    }).to_list(length=50)
    
    requests_list = []
    for req in requests:
        user_data = await users_collection.find_one({"id": req["user_id"]})
        if user_data:
            requests_list.append({
                "id": req["id"],
                "user": {
                    "id": user_data["id"],
                    "username": user_data["username"]
                },
                "material_type": req["material_type"],
                "quantity": req["quantity"],
                "created_at": req["created_at"].isoformat()
            })
    
    return {"requests": requests_list}
