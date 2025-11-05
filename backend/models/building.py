from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
import uuid

class Building(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # building type ID from frontend (saloon, mine, etc.)
    name: str
    position: str  # grid position like "5-7"
    status: str = "building"  # "building" or "built"
    progress: float = 0.0
    start_time: datetime = Field(default_factory=datetime.utcnow)
    build_time: int  # seconds
    last_collect_time: Optional[datetime] = None
    level: int = 1
    production: Dict[str, int] = {}  # {"gold": 10, "wood": 5}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BuildingCreate(BaseModel):
    buildingType: str
    position: str

class BuildingResponse(BaseModel):
    id: str
    type: str
    name: str
    position: str
    status: str
    progress: float
    startTime: str
    buildTime: int
    lastCollectTime: Optional[str] = None
    readyToCollect: bool = False
    level: int
    production: Dict[str, int]
    image: str = ""
