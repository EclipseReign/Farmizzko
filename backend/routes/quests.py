from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.quest import QuestProgress, QuestResponse
from utils.auth import get_current_user
from utils.game_data import QUESTS_DATA
from datetime import datetime
from typing import List

router = APIRouter()

@router.get("", response_model=List[QuestResponse])
async def get_quests(request: Request, user_id: str = Depends(get_current_user)):
    db = request.app.state.db
    quest_progress_collection = db.quest_progress
    buildings_collection = db.buildings
    users_collection = db.users
    
    # Get user data
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    resources = user["resources"]
    
    # Get user buildings
    buildings = await buildings_collection.find({"user_id": user_id}).to_list(length=100)
    built_buildings = [b["type"] for b in buildings if b["status"] == "built"]
    
    # Get quest progress
    quest_progresses = await quest_progress_collection.find({"user_id": user_id}).to_list(length=100)
    progress_map = {qp["quest_id"]: qp for qp in quest_progresses}
    
    response_quests = []
    for quest_def in QUESTS_DATA:
        # Check if quest is available based on level
        if user["level"] < quest_def.get("level_required", 1):
            continue
        
        progress = progress_map.get(quest_def["id"])
        completed = False
        claimed = False
        
        if progress:
            completed = progress["completed"]
            claimed = progress["claimed"]
        else:
            # Check if quest is completed
            completed = True
            
            # Check building requirements
            for building_type in quest_def["requirements"].get("buildings", []):
                if building_type not in built_buildings:
                    completed = False
                    break
            
            # Check resource requirements
            if completed:
                for resource, amount in quest_def["requirements"].get("resources", {}).items():
                    if resources.get(resource, 0) < amount:
                        completed = False
                        break
        
        response_quests.append(
            QuestResponse(
                id=quest_def["id"],
                title=quest_def["title"],
                description=quest_def["description"],
                requirements=quest_def["requirements"],
                rewards=quest_def["rewards"],
                completed=completed,
                claimed=claimed
            )
        )
    
    return response_quests

@router.post("/{quest_id}/claim")
async def claim_quest(
    quest_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    db = request.app.state.db
    quest_progress_collection = db.quest_progress
    users_collection = db.users
    
    # Find quest definition
    quest_def = next((q for q in QUESTS_DATA if q["id"] == quest_id), None)
    if not quest_def:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found"
        )
    
    # Check if already claimed
    progress = await quest_progress_collection.find_one({"user_id": user_id, "quest_id": quest_id})
    if progress and progress["claimed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest already claimed"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Add rewards
    resources = user["resources"]
    for resource, amount in quest_def["rewards"].items():
        if resource == "experience":
            user["experience"] = user.get("experience", 0) + amount
        else:
            resources[resource] = resources.get(resource, 0) + amount
    
    # Update level if needed
    new_experience = user["experience"]
    new_level = user["level"]
    level_thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500]
    for i, threshold in enumerate(level_thresholds):
        if new_experience >= threshold:
            new_level = i + 1
    
    # Update user
    await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "resources": resources,
                "experience": new_experience,
                "level": new_level,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Update quest progress
    if progress:
        await quest_progress_collection.update_one(
            {"user_id": user_id, "quest_id": quest_id},
            {"$set": {"claimed": True, "claimed_at": datetime.utcnow()}}
        )
    else:
        new_progress = QuestProgress(
            user_id=user_id,
            quest_id=quest_id,
            completed=True,
            claimed=True,
            completed_at=datetime.utcnow(),
            claimed_at=datetime.utcnow()
        )
        await quest_progress_collection.insert_one(new_progress.model_dump())
    
    return {
        "success": True,
        "rewards": quest_def["rewards"],
        "updatedResources": resources,
        "level": new_level,
        "experience": new_experience
    }
