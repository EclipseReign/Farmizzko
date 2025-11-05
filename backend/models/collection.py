from pydantic import BaseModel, Field
from typing import Dict
from datetime import datetime
import uuid

class CollectionItem(BaseModel):
    """Individual collection item owned by user"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    item_id: str  # e.g., "wheat_seed", "rose_petal"
    quantity: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionProgress(BaseModel):
    """User's progress on a collection"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    collection_id: str  # e.g., "wheat_collection"
    items_collected: Dict[str, int] = {}  # {"wheat_seed": 3, "straw": 2}
    times_completed: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionExchange(BaseModel):
    collection_id: str

class CollectionResponse(BaseModel):
    id: str
    name: str
    items: list
    items_needed: Dict[str, int]
    items_collected: Dict[str, int]
    can_exchange: bool
    rewards: Dict
    image: str = ""