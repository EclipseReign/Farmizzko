"# API Contracts - Wild West Game

## Overview

This document describes the API contracts between frontend and backend for the Wild West game.

## Authentication APIs

### POST /api/auth/register

**Request:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "level": 1,
    "experience": 0
  },
  "token": "string"
}
```

### POST /api/auth/login

**Request:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "level": number,
    "experience": number
  },
  "token": "string"
}
```

## Player APIs

### GET /api/player/profile

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "id": "string",
  "username": "string",
  "level": number,
  "experience": number,
  "resources": {
    "gold": number,
    "wood": number,
    "stone": number,
    "food": number
  }
}
```

### PUT /api/player/resources

**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "resources": {
    "gold": number,
    "wood": number,
    "stone": number,
    "food": number
  }
}
```

**Response:**

```json
{
  "success": true,
  "resources": { ... }
}
```

## Building APIs

### GET /api/buildings

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "buildings": [
    {
      "id": "string",
      "type": "string",
      "name": "string",
      "position": "string",
      "status": "building|built",
      "progress": number,
      "startTime": number,
      "lastCollectTime": number,
      "readyToCollect": boolean,
      "level": number,
      "production": {
        "gold": number,
        "wood": number,
        ...
      }
    }
  ]
}
```

### POST /api/buildings

**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "buildingType": "string",
  "position": "string"
}
```

**Response:**

```json
{
  "building": {
    "id": "string",
    "type": "string",
    "position": "string",
    "status": "building",
    "startTime": number,
    "buildTime": number
  }
}
```

### POST /api/buildings/:id/collect

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true,
  "collected": {
    "gold": number,
    "wood": number,
    ...
  },
  "updatedResources": { ... }
}
```

### DELETE /api/buildings/:id

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true
}
```

## Quest APIs

### GET /api/quests

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "quests": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "requirements": {
        "buildings": ["string"],
        "resources": { ... }
      },
      "rewards": {
        "gold": number,
        "experience": number
      },
      "completed": boolean,
      "claimed": boolean
    }
  ]
}
```

### POST /api/quests/:id/claim

**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true,
  "rewards": {
    "gold": number,
    "experience": number
  },
  "updatedResources": { ... }
}
```

## Market APIs

### POST /api/market/purchase

**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "itemId": "string"
}
```

**Response:**

```json
{
  "success": true,
  "purchased": {
    "wood": number,
    "stone": number,
    ...
  },
  "updatedResources": { ... }
}
```

---

## Mock Data Replacement Plan

### Current Mock Data in `/app/frontend/src/mockData.js`:

- **BUILDINGS** - Building definitions (name, cost, production, etc.)
- **INITIAL_RESOURCES** - Starting resources for new players
- **QUESTS** - Quest definitions
- **MARKET_ITEMS** - Market item definitions
- **LEVELS** - Level progression data

### Frontend Integration Points:

1. **AuthPage.jsx** - Replace localStorage with API calls

   - Currently: `localStorage.setItem('currentUser', JSON.stringify(user))`
   - Replace with: POST `/api/auth/login` or `/api/auth/register`

2. **GameDashboard.jsx** - Replace state with API calls

   - Currently: `useState(INITIAL_RESOURCES)`
   - Replace with: GET `/api/player/profile` on mount
   - Add: Periodic sync of resources and buildings

3. **Building System** - Replace local state with API

   - Currently: Local `buildings` array
   - Replace with: GET `/api/buildings` on load
   - On build: POST `/api/buildings`
   - On collect: POST `/api/buildings/:id/collect`

4. **Quest System** - Replace local state with API

   - Currently: Local `quests` array from mock
   - Replace with: GET `/api/quests`
   - On claim: POST `/api/quests/:id/claim`

5. **Market System** - Replace local transactions with API
   - Currently: Local resource updates
   - Replace with: POST `/api/market/purchase`

---

## Database Models

### User Model

```python
{
  "_id": ObjectId,
  "username": str,
  "email": str,
  "password_hash": str,
  "level": int,
  "experience": int,
  "resources": {
    "gold": int,
    "wood": int,
    "stone": int,
    "food": int
  },
  "created_at": datetime,
  "updated_at": datetime
}
```

### Building Model

```python
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "type": str,
  "name": str,
  "position": str,
  "status": str,  # "building" or "built"
  "progress": float,
  "start_time": datetime,
  "build_time": int,
  "last_collect_time": datetime,
  "level": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Quest Progress Model

```python
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "quest_id": str,
  "completed": bool,
  "claimed": bool,
  "completed_at": datetime,
  "claimed_at": datetime
}
```

---

## Implementation Steps

### Phase 1: Backend Setup

1. Create User model and authentication endpoints
2. Create Building model and CRUD endpoints
3. Create Quest progress tracking endpoints
4. Create Market transaction endpoints

### Phase 2: Frontend Integration

1. Replace AuthPage mock with real API calls
2. Add JWT token storage and management
3. Replace GameDashboard mock data with API calls
4. Add loading states and error handling
5. Add periodic sync for building progress

### Phase 3: Real-time Features

1. WebSocket connection for real-time updates
2. Building completion notifications
3. Resource collection reminders
4. Quest completion alerts

---

## Security Considerations

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation on all endpoints
- Prevent resource manipulation (server-side validation)
