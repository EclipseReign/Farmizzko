from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Territory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    location: str = "main"
    type: str  # grass, stone, tree, bush, pine, cedar, skeleton
    position: str  # grid position
    status: str = "active"  # active, clearing, cleared
    clear_started_at: Optional[datetime] = None
    clear_time: int = 0  # seconds to clear
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TerritoryClear(BaseModel):
    position: str
    location: str = "main"

class TerritoryResponse(BaseModel):
    id: str
    type: str
    position: str
    status: str
    clearStartedAt: Optional[str] = None
    clearTime: int
    image: str = ""
