from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

# Import routes
from routes import auth, player, buildings, quests, market, crops, animals, territory, pests, collections, friends

# Database connection
db_client = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_client, db
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017/wildwest')
    db_client = AsyncIOMotorClient(mongo_url)
    db = db_client.get_database()
    app.state.db = db
    print(f"✅ Connected to MongoDB: {mongo_url}")
    
    yield
    
    # Shutdown
    if db_client:
        db_client.close()
        print("👋 Disconnected from MongoDB")

# Create FastAPI app
app = FastAPI(
    title="Wild West Game API",
    description="Backend for Wild West farming game",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(player.router, prefix="/api/player", tags=["Player"])
app.include_router(buildings.router, prefix="/api/buildings", tags=["Buildings"])
app.include_router(quests.router, prefix="/api/quests", tags=["Quests"])
app.include_router(market.router, prefix="/api/market", tags=["Market"])
app.include_router(crops.router, prefix="/api/crops", tags=["Crops"])
app.include_router(animals.router, prefix="/api/animals", tags=["Animals"])
app.include_router(territory.router, prefix="/api/territory", tags=["Territory"])
app.include_router(pests.router, prefix="/api/pests", tags=["Pests"])
app.include_router(collections.router, prefix="/api/collections", tags=["Collections"])
app.include_router(friends.router, prefix="/api/friends", tags=["Friends"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Wild West API is running!",
        "database": "connected" if db is not None else "disconnected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
