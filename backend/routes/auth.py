from fastapi import APIRouter, HTTPException, status, Request
from models.user import UserCreate, UserLogin, Token, User, UserResponse, Resources
from utils.auth import hash_password, verify_password, create_access_token
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, request: Request):
    db = request.app.state.db
    users_collection = db.users
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    existing_email = await users_collection.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    # Create new user
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pwd,
        level=1,
        experience=0,
        resources=Resources()
    )
    
    user_dict = new_user.model_dump()
    await users_collection.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": new_user.id})
    
    user_response = UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        level=new_user.level,
        experience=new_user.experience,
        resources=new_user.resources
    )
    
    return Token(access_token=token, user=user_response)

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, request: Request):
    db = request.app.state.db
    users_collection = db.users
    
    # Find user
    user = await users_collection.find_one({"username": user_data.username})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create token
    token = create_access_token({"sub": user["id"]})
    
    user_response = UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        level=user["level"],
        experience=user["experience"],
        resources=Resources(**user["resources"])
    )
    
    return Token(access_token=token, user=user_response)
