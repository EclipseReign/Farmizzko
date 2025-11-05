from fastapi import APIRouter, HTTPException, status, Request, Depends
from models.animal import Animal, AnimalCreate
from utils.auth import get_current_user
from game_data import ANIMALS_DATA
from datetime import datetime
import random
import uuid

router = APIRouter()

@router.get("")
async def get_animals(request: Request, user_id: str = Depends(get_current_user)):
    """Get all user's animals"""
    db = request.app.state.db
    animals_collection = db.animals
    
    animals = await animals_collection.find({"user_id": user_id}).to_list(length=100)
    
    updated_animals = []
    for animal in animals:
        animal_data = ANIMALS_DATA.get(animal["type"])
        if not animal_data:
            continue
        
        elapsed = (datetime.utcnow() - animal["created_at"]).total_seconds()
        
        # Update status and age
        current_age = int(elapsed)
        if current_age >= animal_data["adult_age"]:
            animal_status = "adult"
            
            # Check if can produce
            if animal["last_collected"]:
                time_since_collection = (datetime.utcnow() - animal["last_collected"]).total_seconds()
            else:
                time_since_collection = elapsed - animal_data["adult_age"]
            
            if time_since_collection >= animal_data["production_interval"]:
                animal_status = "producing"
        else:
            animal_status = "growing"
        
        # Calculate growth progress
        if animal_status == "growing":
            progress = min(100, (current_age / animal_data["adult_age"]) * 100)
        else:
            progress = 100
        
        updated_animals.append({
            "id": animal["id"],
            "type": animal["type"],
            "name": animal_data["name"],
            "position": animal["position"],
            "location": animal["location"],
            "status": animal_status,
            "age": current_age,
            "progress": round(progress, 2),
            "lastFed": animal["last_fed"].isoformat() if animal["last_fed"] else None,
            "lastCollected": animal["last_collected"].isoformat() if animal["last_collected"] else None,
            "canProduce": animal_status == "producing",
            "image": animal_data["image"]
        })
    
    return {"animals": updated_animals}

@router.post("")
async def add_animal(
    animal_data: AnimalCreate,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Add a new animal"""
    db = request.app.state.db
    users_collection = db.users
    animals_collection = db.animals
    
    # Get animal definition
    animal_def = ANIMALS_DATA.get(animal_data.type)
    if not animal_def:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal type"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check level requirement
    if user["level"] < animal_def["level_required"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Level {animal_def['level_required']} required"
        )
    
    # Check if user has enough resources
    resources = user["resources"]
    for resource, amount in animal_def["cost"].items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough {resource}"
            )
    
    # Check if position is already occupied
    existing_animal = await animals_collection.find_one({
        "user_id": user_id,
        "position": animal_data.position,
        "location": animal_data.location
    })
    if existing_animal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Position already occupied"
        )
    
    # Deduct resources
    for resource, amount in animal_def["cost"].items():
        resources[resource] -= amount
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources}}
    )
    
    # Create animal
    new_animal = Animal(
        user_id=user_id,
        location=animal_data.location,
        type=animal_data.type,
        name=animal_def["name"],
        position=animal_data.position,
        status="growing",
        age=0,
        adult_age=animal_def["adult_age"],
        last_fed=None,
        last_collected=None,
        production_interval=animal_def["production_interval"],
        production_yield=animal_def["production_yield"]
    )
    
    animal_dict = new_animal.model_dump()
    await animals_collection.insert_one(animal_dict)
    
    return {
        "animal": {
            "id": new_animal.id,
            "type": new_animal.type,
            "name": new_animal.name,
            "position": new_animal.position,
            "location": new_animal.location,
            "status": new_animal.status,
            "image": animal_def["image"]
        },
        "updatedResources": resources
    }

@router.post("/{animal_id}/feed")
async def feed_animal(
    animal_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Feed an animal"""
    db = request.app.state.db
    users_collection = db.users
    animals_collection = db.animals
    
    # Get animal
    animal = await animals_collection.find_one({"id": animal_id, "user_id": user_id})
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )
    
    animal_def = ANIMALS_DATA.get(animal["type"])
    if not animal_def:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal type"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user has enough food
    resources = user["resources"]
    feed_cost = animal_def["feed_cost"]["food"]
    if resources.get("food", 0) < feed_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough food"
        )
    
    # Deduct food
    resources["food"] -= feed_cost
    
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"resources": resources}}
    )
    
    # Update animal
    await animals_collection.update_one(
        {"id": animal_id},
        {"$set": {"last_fed": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "updatedResources": resources
    }

@router.post("/{animal_id}/collect")
async def collect_from_animal(
    animal_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Collect production from animal"""
    db = request.app.state.db
    users_collection = db.users
    animals_collection = db.animals
    collections_collection = db.collection_items
    
    # Get animal
    animal = await animals_collection.find_one({"id": animal_id, "user_id": user_id})
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )
    
    animal_def = ANIMALS_DATA.get(animal["type"])
    if not animal_def:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal type"
        )
    
    # Check if animal is adult
    elapsed = (datetime.utcnow() - animal["created_at"]).total_seconds()
    if elapsed < animal_def["adult_age"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Animal is not adult yet"
        )
    
    # Check if production is ready
    if animal["last_collected"]:
        time_since_collection = (datetime.utcnow() - animal["last_collected"]).total_seconds()
    else:
        time_since_collection = elapsed - animal_def["adult_age"]
    
    if time_since_collection < animal_def["production_interval"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Production not ready yet"
        )
    
    # Get user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Add production to user resources
    resources = user["resources"]
    for resource, amount in animal["production_yield"].items():
        resources[resource] = resources.get(resource, 0) + amount
    
    # Add experience
    new_experience = user["experience"] + animal_def["experience"]
    
    # Collection drops
    dropped_items = []
    if "collection_drops" in animal_def:
        for item_id in animal_def["collection_drops"]:
            # Random chance to drop
            if random.random() < 0.25:  # 25% chance
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
    
    # Update animal
    await animals_collection.update_one(
        {"id": animal_id},
        {"$set": {"last_collected": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "collected": animal["production_yield"],
        "experience_gained": animal_def["experience"],
        "dropped_items": dropped_items,
        "updatedResources": resources,
        "newExperience": new_experience
    }

@router.delete("/{animal_id}")
async def remove_animal(
    animal_id: str,
    request: Request,
    user_id: str = Depends(get_current_user)
):
    """Remove an animal"""
    db = request.app.state.db
    animals_collection = db.animals
    
    result = await animals_collection.delete_one({"id": animal_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )
    
    return {"success": True}