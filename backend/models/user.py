from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict
from datetime import datetime
import uuid

class Resources(BaseModel):
    gold: int = 500
    wood: int = 200
    stone: int = 150
    food: int = 100
    energy: int = 100
    agrobucks: int = 10  # Premium currency

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    level: int = 1
    experience: int = 0
    resources: Resources = Field(default_factory=Resources)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    
class UserLogin(BaseModel):
    username: str
    password: str
    
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    level: int
    experience: int
    resources: Resources
    
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
