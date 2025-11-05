from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
import uuid

class QuestProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    quest_id: str
    completed: bool = False
    claimed: bool = False
    completed_at: Optional[datetime] = None
    claimed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestRequirements(BaseModel):
    buildings: List[str] = []
    resources: Dict[str, int] = {}

class QuestRewards(BaseModel):
    gold: int = 0
    experience: int = 0
    wood: int = 0
    stone: int = 0
    food: int = 0

class QuestDefinition(BaseModel):
    id: str
    title: str
    description: str
    requirements: QuestRequirements
    rewards: QuestRewards
    level_required: int = 1

class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    requirements: Dict
    rewards: Dict
    completed: bool
    claimed: bool
