from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Friend(BaseModel):
    """Friendship between two users"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # user who sent request
    friend_id: str  # user who received request
    status: str = "pending"  # pending, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MaterialRequest(BaseModel):
    """Request for materials from friends"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # user requesting materials
    material_type: str  # what material is needed
    quantity: int = 1
    status: str = "active"  # active, fulfilled, expired
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

class FriendHelp(BaseModel):
    """Record of helping a friend"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # user who helped
    friend_id: str  # user who was helped
    help_type: str  # "material", "visit", "speed_up"
    rewards: dict = {}  # rewards received for helping
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FriendRequest(BaseModel):
    friend_username: str

class MaterialRequestCreate(BaseModel):
    material_type: str
    quantity: int = 1

class HelpFriendRequest(BaseModel):
    friend_id: str
    help_type: str = "visit"
