# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "scanLimit": 100,
      "scansUsed": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Admin Login
```http
POST /auth/admin/login
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

---

## Reel Endpoints

### Scan Reels
```http
POST /reels/scan
```
*Requires authentication*

**Request Body:**
```json
{
  "reels": [
    {
      "reelId": "CXyZ123abc",
      "reelUrl": "https://instagram.com/reel/CXyZ123abc",
      "viewCount": 15000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully scanned 1 reels",
  "data": {
    "savedReels": 1,
    "errors": 0,
    "scansRemaining": 99,
    "reels": [...]
  }
}
```

### Get All Reels
```http
GET /reels?page=1&limit=20&sortBy=scannedAt&order=desc
```
*Requires authentication*

### Get Single Reel
```http
GET /reels/:id
```
*Requires authentication*

### Delete Reel
```http
DELETE /reels/:id
```
*Requires authentication*

---

## Analytics Endpoints

### Get Overview
```http
GET /analytics/overview
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReels": 10,
    "totalViews": 150000,
    "averageViews": 15000,
    "highestViews": 50000,
    "lowestViews": 5000,
    "viralReels": 2,
    "viralRatio": 20,
    "growthRate": 15,
    "consistencyScore": 75,
    "categoryBreakdown": {
      "Movie": 3,
      "Comedy": 4,
      "Motivation": 2,
      "Trending Audio": 1,
      "Other": 0
    },
    "topReels": [...]
  }
}
```

### Get Growth Metrics
```http
GET /analytics/growth?timeframe=7d
```
*Requires authentication*

### Get Viral Reels
```http
GET /analytics/viral
```
*Requires authentication*

### Compare Creators
```http
POST /analytics/compare
```
*Requires authentication*

**Request Body:**
```json
{
  "creator1Id": "user_id_1",
  "creator2Id": "user_id_2"
}
```

### Export Data
```http
GET /analytics/export?format=csv
```
*Requires authentication*

### Get Brand Match Score
```http
GET /analytics/agency/brand-match?targetAudience=general
```
*Requires authentication*

---

## Admin Endpoints

### Get All Users
```http
GET /admin/users?page=1&limit=20&role=user&isActive=true
```
*Requires admin authentication*

### Get Platform Stats
```http
GET /admin/stats
```
*Requires admin authentication*

### Update User
```http
PUT /admin/users/:id
```
*Requires admin authentication*

**Request Body:**
```json
{
  "scanLimit": 200,
  "isActive": true,
  "role": "user"
}
```

### Delete User
```http
DELETE /admin/users/:id
```
*Requires admin authentication*

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error