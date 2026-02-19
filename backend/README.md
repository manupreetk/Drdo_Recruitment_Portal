# DRDO Recruitment Portal — Backend API

Express.js REST API with JWT authentication, MongoDB (Atlas), and file upload support via Multer.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB (Mongoose v9) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (5MB limit, PDF/JPG/PNG) |

## Quick Start

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>
JWT_SECRET=<your_secret_key>
```

```bash
npm run dev    # nodemon (hot-reload)
npm start      # production
```

## Authentication

All protected routes require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are valid for **30 days** and returned on register/login.

---

## API Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | API health check |

**Response:**
```json
{ "message": "Government Recruitment Portal API" }
```

---

### Auth Routes — `/api/auth`

#### `POST /api/auth/register`

Register a new user. Role is always set to `user`.

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `password` | string (min 6 chars) | ✅ |
| `phone` | string | ✅ |

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "mongo_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

**Errors:** `400` missing fields, `400` duplicate email, `500` server error

---

#### `POST /api/auth/login`

Authenticate and receive a JWT token.

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response (200):** Same structure as register response.

**Errors:** `400` missing fields, `401` invalid credentials

---

#### `GET /api/auth/me`

Get the currently authenticated user's profile.

**Auth:** 🔒 Bearer Token

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "createdAt": "2026-02-19T..."
  }
}
```

---

### Application Routes — `/api/applications`

#### `POST /api/applications`

Create a new recruitment application. Auto-generates `applicationId` and initializes 5 stages.

**Auth:** 🔒 Bearer Token (User)

| Field | Type | Required |
|-------|------|----------|
| `position` | string | ✅ |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "applicationId": "APP2026847261",
    "user": "user_mongo_id",
    "position": "Scientist B",
    "status": "in-progress",
    "currentStage": "Application Submitted",
    "stages": [
      { "name": "Application Submitted", "status": "completed", "completedAt": "..." },
      { "name": "Document Verification", "status": "pending" },
      { "name": "Medical Examination", "status": "pending" },
      { "name": "Background Verification", "status": "pending" },
      { "name": "Final Clearance", "status": "pending" }
    ],
    "documents": {
      "Birth Certificate": false,
      "Educational Certificates": false,
      "Experience Letters": false,
      "Caste Certificate (if applicable)": false,
      "Medical Fitness Certificate": false,
      "Character Certificate": false,
      "Photo ID Proof (Aadhaar/PAN)": false,
      "Passport Size Photographs": false
    }
  }
}
```

---

#### `GET /api/applications`

Get applications. Users see their own; admins see all (with populated user info).

**Auth:** 🔒 Bearer Token

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [/* array of applications */]
}
```

---

#### `GET /api/applications/:id`

Get a single application by MongoDB `_id`. Users can only view their own; admins can view any.

**Auth:** 🔒 Bearer Token

**Errors:** `404` not found, `403` not authorized

---

#### `PUT /api/applications/:id`

Update an application (any fields).

**Auth:** 🔒 Bearer Token (Admin only)

**Request body:** Any valid Application fields (e.g., `{ "status": "completed" }`)

**Errors:** `403` user role forbidden, `404` not found

---

#### `PUT /api/applications/:id/stage`

Update a specific stage's status within an application.

**Auth:** 🔒 Bearer Token (Admin only)

| Field | Type | Required |
|-------|------|----------|
| `currentStage` | string (one of the 5 stage names) | ✅ |
| `stageStatus` | `"pending"` \| `"in-progress"` \| `"completed"` | ✅ |

**Request:**
```json
{
  "currentStage": "Document Verification",
  "stageStatus": "in-progress"
}
```

**Errors:** `403` user role forbidden, `404` not found

---

#### `DELETE /api/applications/:id`

Delete an application.

**Auth:** 🔒 Bearer Token (Admin only)

**Response (200):**
```json
{ "success": true, "data": {} }
```

**Errors:** `403` user role forbidden, `404` not found

---

### Document Routes — `/api/documents`

#### `POST /api/documents/upload`

Upload a document file for an application. Max 5MB. Allowed types: PDF, JPG, PNG.

**Auth:** 🔒 Bearer Token (Owner of the application)

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `document` | file (PDF/JPG/PNG, ≤5MB) | ✅ |
| `applicationId` | string (MongoDB `_id`) | ✅ |
| `documentType` | string (e.g., "Birth Certificate") | ✅ |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "application": "app_mongo_id",
    "user": "user_mongo_id",
    "documentType": "Birth Certificate",
    "fileName": "birth_cert.pdf",
    "filePath": "uploads/document-1708345...",
    "fileSize": 12345,
    "mimeType": "application/pdf",
    "verified": false,
    "uploadedAt": "2026-02-19T..."
  }
}
```

**Errors:** `400` no file, `403` not owner, `404` application not found

---

#### `GET /api/documents/application/:applicationId`

Get all documents uploaded for a specific application.

**Auth:** 🔒 Bearer Token (Owner or Admin)

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [/* array of documents */]
}
```

**Errors:** `403` not authorized, `404` application not found

---

#### `PUT /api/documents/:id/verify`

Mark a document as verified.

**Auth:** 🔒 Bearer Token (Admin only)

**Response (200):** Returns the document with `verified: true`, `verifiedBy`, and `verifiedAt` set.

**Errors:** `403` user role forbidden, `404` not found

---

#### `DELETE /api/documents/:id`

Delete a document. Owner or admin can delete.

**Auth:** 🔒 Bearer Token (Owner or Admin)

**Response (200):**
```json
{ "success": true, "data": {} }
```

**Errors:** `403` not authorized, `404` not found

---

## Endpoint Summary

| # | Method | Endpoint | Auth | Role |
|---|--------|----------|------|------|
| 1 | `GET` | `/` | Public | — |
| 2 | `POST` | `/api/auth/register` | Public | — |
| 3 | `POST` | `/api/auth/login` | Public | — |
| 4 | `GET` | `/api/auth/me` | 🔒 | Any |
| 5 | `POST` | `/api/applications` | 🔒 | User |
| 6 | `GET` | `/api/applications` | 🔒 | Any |
| 7 | `GET` | `/api/applications/:id` | 🔒 | Owner/Admin |
| 8 | `PUT` | `/api/applications/:id` | 🔒 | Admin |
| 9 | `PUT` | `/api/applications/:id/stage` | 🔒 | Admin |
| 10 | `DELETE` | `/api/applications/:id` | 🔒 | Admin |
| 11 | `POST` | `/api/documents/upload` | 🔒 | Owner |
| 12 | `GET` | `/api/documents/application/:appId` | 🔒 | Owner/Admin |
| 13 | `PUT` | `/api/documents/:id/verify` | 🔒 | Admin |
| 14 | `DELETE` | `/api/documents/:id` | 🔒 | Owner/Admin |

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT protect + role authorize
├── models/
│   ├── User.js            # User schema (bcrypt hashing)
│   ├── Application.js     # Recruitment application schema
│   └── Document.js        # Uploaded document schema
├── routes/
│   ├── auth.js            # Register, login, get-me
│   ├── applications.js    # CRUD + stage management
│   └── documents.js       # Upload, list, verify, delete
├── uploads/               # Uploaded files directory
├── server.js              # App entry point
├── test_endpoints.js      # Endpoint test suite
└── .env                   # Environment config
```

## Test Results

All **25 tests pass** against MongoDB Atlas:

```
✅ Auth Routes:         10/10
✅ Application Routes:   8/8
✅ Document Routes:      7/7
────────────────────────────
   Pass Rate:          100.0%
```

Run tests: `node test_endpoints.js`
