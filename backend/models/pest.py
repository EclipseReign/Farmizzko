from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Pest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    location: str = "main"
    type: str  # wolf, bear, boar, snake, mole
    position: str  # grid position
    status: str = "active"  # active, chasing, chased
    appeared_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PestChase(BaseModel):
    pest_id: str

class PestResponse(BaseModel):
    id: str
    type: str
    position: str
    status: str
    appearedAt: str
    image: str = ""
