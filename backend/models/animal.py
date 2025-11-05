from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
import uuid

class Animal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    location: str = "main"
    type: str  # cow, sheep, chicken, etc.
    name: str
    position: str
    status: str = "growing"  # growing, adult, producing
    age: int = 0  # in seconds
    adult_age: int = 3600  # seconds to become adult
    last_fed: Optional[datetime] = None
    last_collected: Optional[datetime] = None
    production_interval: int = 3600  # seconds between productions
    production_yield: Dict[str, int] = {}  # what animal produces
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnimalCreate(BaseModel):
    type: str
    position: str
    location: str = "main"
