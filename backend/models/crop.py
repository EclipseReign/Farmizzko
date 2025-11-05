from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
import uuid

class Crop(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    location: str = "main"  # main, forest, north, etc.
    type: str  # wheat, echinacea, ginger, etc.
    name: str
    position: str  # grid position
    status: str = "growing"  # growing, ready, withered
    planted_at: datetime = Field(default_factory=datetime.utcnow)
    grow_time: int  # seconds to grow
    wither_time: int  # seconds after ready before withering
    last_checked: datetime = Field(default_factory=datetime.utcnow)
    protected: bool = False  # drought protection
    yield_data: Dict[str, int] = {}  # what you get when harvesting
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CropCreate(BaseModel):
    type: str
    position: str
    location: str = "main"
