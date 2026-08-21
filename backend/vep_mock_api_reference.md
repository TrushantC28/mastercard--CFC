# Volunteer Experience Platform — Mock API reference

Covers every endpoint across all four backend services (Auth, Activity & Proposal, Registration & Attendance, Feedback & Classification). Each entry has the method, path, who can call it, a dummy request body, and dummy success/error responses using the exact field names and enum values from the schema — so the three frontend devs can build UI against fixed shapes now and swap in the real backend later without changing any field names.

**Conventions & Authentication**
- **Base URL**: `/` (or `http://localhost:8000`)
- **Header Format for Protected Endpoints**:
  ```http
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **JWT Payload Shape**:
  Tokens are signed using HMAC-SHA256 (`ACCESS_TOKEN_SECRET`) with an expiry (default `1d` / 24 hours):
  ```json
  {
    "_id": "66aa1111bb2222cc333301",
    "userId": "66aa1111bb2222cc333301",
    "role": "volunteer",
    "corporatePartnerId": null,
    "iat": 1755760000,
    "exp": 1755846400
  }
  ```
- **IDs & Dates**:
  - MongoDB ObjectIds are 24-character hexadecimal strings (e.g., `"66aa1111bb2222cc333301"`).
  - Dates are standard ISO 8601 strings (e.g., `"2026-08-21T09:00:00.000Z"`).

### Standard Error Shapes

```json
// 400 — Validation / Input Error
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Role must be one of: volunteer, admin, spoc"
  }
}
```

```json
// 400 — Validation Failure with Field Details
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input.",
    "fields": {
      "email": "Must be a valid email address.",
      "password": "Must be at least 8 characters."
    }
  }
}
```

```json
// 400 / 409 — Duplicate Email Registration
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered"
  }
}
```

```json
// 401 — Missing, Invalid, or Expired Token / Bad Credentials
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required."
  }
}
```

```json
// 403 — Forbidden (User authenticated, but role insufficient)
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

```json
// 404 — Resource Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

```json
// 429 — Rate Limit Exceeded
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many requests, please try again later."
  }
}
```

---

## 1. Auth & User service

### `POST /auth/register`
Creates a new user in the platform, securely hashes the password with bcrypt, and returns the sanitized user object without `passwordHash` or `refreshToken`.

- **Access:** Public
- **Rate Limit:** 20 requests per 15-minute window

#### Request Body
```json
{
  "email": "priya.volunteer@example.com",
  "password": "SamplePass123!",
  "name": "Priya Sharma",
  "phone": "9876543210",
  "role": "volunteer",
  "corporatePartnerId": null
}
```

| Field | Type | Required? | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | Unique user email address (automatically lowercased and trimmed). |
| `password` | String | Yes | Plaintext password (hashed before persisting). |
| `name` | String | No | Full name of the user. |
| `phone` | String | No | Contact phone number. |
| `role` | String | Yes | Enum: `"volunteer"`, `"admin"`, `"spoc"`. |
| `corporatePartnerId` | String / null | Conditional | Required for `spoc`, optional for `volunteer`, must be absent/null for `admin`. |

#### Success Response `201 Created`
```json
{
  "statusCode": 201,
  "data": {
    "id": "66aa1111bb2222cc333301",
    "_id": "66aa1111bb2222cc333301",
    "email": "priya.volunteer@example.com",
    "name": "Priya Sharma",
    "phone": "9876543210",
    "role": "volunteer",
    "corporatePartnerId": null,
    "status": "active",
    "createdAt": "2026-08-21T09:00:00.000Z",
    "updatedAt": "2026-08-21T09:00:00.000Z"
  },
  "message": "User registered successfully",
  "success": true
}
```

#### Error Responses
- **`400 Bad Request`** (Duplicate Email):
  ```json
  {
    "success": false,
    "error": {
      "code": "EMAIL_EXISTS",
      "message": "Email already registered"
    }
  }
  ```
- **`400 Bad Request`** (Missing required fields or invalid role / SPOC partner mismatch):
  ```json
  {
    "success": false,
    "error": {
      "code": "BAD_REQUEST",
      "message": "corporatePartnerId is required for spoc role"
    }
  }
  ```
- **`429 Too Many Requests`**:
  ```json
  {
    "success": false,
    "error": {
      "code": "TOO_MANY_REQUESTS",
      "message": "Too many requests, please try again later."
    }
  }
  ```

---

### `POST /auth/login`
Authenticates a user via email and password using `comparePassword`. On success, issues a signed JWT token and returns user details.

- **Access:** Public
- **Rate Limit:** 20 requests per 15-minute window

#### Request Body
```json
{
  "email": "priya.volunteer@example.com",
  "password": "SamplePass123!"
}
```

#### Success Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXNlcklkIjoiNjZhYTExMTFiYjIyMjJjYzMzMzMwMSIsInJvbGUiOiJ2b2x1bnRlZXIiLCJjb3Jwb3JhdGVQYXJ0bmVySWQiOm51bGwsImlhdCI6MTc1NTc2MDAwMCwiZXhwIjoxNzU1ODQ2NDAwfQ.dummy_signature",
    "user": {
      "id": "66aa1111bb2222cc333301",
      "_id": "66aa1111bb2222cc333301",
      "email": "priya.volunteer@example.com",
      "name": "Priya Sharma",
      "phone": "9876543210",
      "role": "volunteer",
      "corporatePartnerId": null,
      "status": "active"
    }
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Error Responses
- **`400 Bad Request`** (Missing fields):
  ```json
  {
    "success": false,
    "error": {
      "code": "BAD_REQUEST",
      "message": "Email and password are required"
    }
  }
  ```
- **`401 Unauthorized`** (Invalid credentials — does not leak email existence):
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    }
  }
  ```
- **`429 Too Many Requests`**:
  ```json
  {
    "success": false,
    "error": {
      "code": "TOO_MANY_REQUESTS",
      "message": "Too many requests, please try again later."
    }
  }
  ```

---

### `POST /auth/logout`
Logs out the currently authenticated user and clears session authentication cookies.

- **Access:** Authenticated user (`requireAuth`)
- **Headers:** `Authorization: Bearer <token>`

#### Success Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Logged out successfully.",
  "success": true
}
```

#### Error Responses
- **`401 Unauthorized`** (Missing, expired, or invalid token):
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required."
    }
  }
  ```

---

### `GET /users/me`
Fetches the profile of the currently authenticated user from the token identity, omitting sensitive credentials.

- **Access:** Authenticated user (`requireAuth`)
- **Headers:** `Authorization: Bearer <token>`

#### Success Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "id": "66aa1111bb2222cc333302",
    "_id": "66aa1111bb2222cc333302",
    "email": "spoc@acmecorp.com",
    "name": "Rahul Mehta",
    "phone": "9123456780",
    "role": "spoc",
    "corporatePartnerId": "66aa1111bb2222cc333310",
    "status": "active",
    "createdAt": "2026-08-21T09:00:00.000Z",
    "updatedAt": "2026-08-21T09:00:00.000Z"
  },
  "message": "User profile fetched successfully",
  "success": true
}
```

#### Error Responses
- **`401 Unauthorized`** (Missing or invalid token):
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required."
    }
  }
  ```
- **`404 Not Found`** (User record no longer exists):
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "User not found"
    }
  }
  ```

---

### `GET /users`
Retrieves a paginated list of user accounts with optional filtering by `role` and `corporatePartnerId`. All sensitive password hashes and refresh tokens are excluded.

- **Access:** Admin only (`requireAuth`, `requireRole('admin')`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `role` (optional): Filter by role (`"volunteer"`, `"admin"`, `"spoc"`).
  - `corporatePartnerId` (optional): Filter by 24-character corporate partner ID.
  - `page` (optional): Page number (integer, default `1`).
  - `limit` (optional): Items per page (integer, default `20`, max `100`).

#### Success Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "id": "66aa1111bb2222cc333301",
        "_id": "66aa1111bb2222cc333301",
        "email": "priya.volunteer@example.com",
        "name": "Priya Sharma",
        "phone": "9876543210",
        "role": "volunteer",
        "corporatePartnerId": null,
        "status": "active",
        "createdAt": "2026-08-21T09:00:00.000Z",
        "updatedAt": "2026-08-21T09:00:00.000Z"
      },
      {
        "id": "66aa1111bb2222cc333302",
        "_id": "66aa1111bb2222cc333302",
        "email": "spoc@acmecorp.com",
        "name": "Rahul Mehta",
        "phone": "9123456780",
        "role": "spoc",
        "corporatePartnerId": "66aa1111bb2222cc333310",
        "status": "active",
        "createdAt": "2026-08-21T09:00:00.000Z",
        "updatedAt": "2026-08-21T09:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 2
  },
  "message": "Users fetched successfully",
  "success": true
}
```

#### Error Responses
- **`401 Unauthorized`** (Unauthenticated or invalid/expired token):
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required."
    }
  }
  ```
- **`403 Forbidden`** (Non-admin user attempting to access):
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "You do not have permission to perform this action."
    }
  }
  ```

---

## 2. Activity & Proposal service

### `POST /proposals`
**Access:** spoc only. `corporatePartnerId` and `spocUserId` are taken from the logged-in token, not the request body.

Request
```json
{
  "title": "Weekend tree plantation drive",
  "description": "Planting saplings at Aarey colony with 20 volunteers.",
  "proposedDate": "2026-09-12",
  "volunteersRequired": 20
}
```

Response `201`
```json
{
  "id": "66aa1111bb2222cc333320",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "spocUserId": "66aa1111bb2222cc333302",
  "title": "Weekend tree plantation drive",
  "description": "Planting saplings at Aarey colony with 20 volunteers.",
  "proposedDate": "2026-09-12",
  "volunteersRequired": 20,
  "status": "pending",
  "reviewedByAdminId": null,
  "reviewNotes": null,
  "createdAt": "2026-08-21T09:05:00.000Z"
}
```

---

### `GET /proposals`
**Access:** admin (sees all, filterable by `status`, `corporatePartnerId`) or spoc (auto-scoped to their own `corporatePartnerId`, filterable by `status`).

Response `200`
```json
{
  "proposals": [
    {
      "id": "66aa1111bb2222cc333320",
      "corporatePartnerId": "66aa1111bb2222cc333310",
      "corporatePartnerName": "Acme Corp",
      "spocUserId": "66aa1111bb2222cc333302",
      "title": "Weekend tree plantation drive",
      "proposedDate": "2026-09-12",
      "volunteersRequired": 20,
      "status": "pending"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### `PATCH /proposals/:id/approve`
**Access:** admin only.

Request
```json
{
  "reviewNotes": "Approved — matches our Q3 environmental focus."
}
```

Response `200`
```json
{
  "id": "66aa1111bb2222cc333320",
  "status": "approved",
  "reviewedByAdminId": "66aa1111bb2222cc333303",
  "reviewNotes": "Approved — matches our Q3 environmental focus.",
  "createdActivityId": "66aa1111bb2222cc333330"
}
```

---

### `PATCH /proposals/:id/reject`
**Access:** admin only.

Request
```json
{
  "reviewNotes": "Date conflicts with an existing activity for this company."
}
```

Response `200`
```json
{
  "id": "66aa1111bb2222cc333320",
  "status": "rejected",
  "reviewedByAdminId": "66aa1111bb2222cc333303",
  "reviewNotes": "Date conflicts with an existing activity for this company."
}
```

---

### `POST /activities`
**Access:** admin only.

Request
```json
{
  "title": "Weekend tree plantation drive",
  "description": "Planting saplings at Aarey colony.",
  "activityDate": "2026-09-12",
  "location": "Aarey Colony, Mumbai",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "volunteersRequired": 20,
  "sourceProposalId": null
}
```

Response `201`
```json
{
  "id": "66aa1111bb2222cc333330",
  "title": "Weekend tree plantation drive",
  "description": "Planting saplings at Aarey colony.",
  "activityDate": "2026-09-12",
  "location": "Aarey Colony, Mumbai",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "createdByAdminId": "66aa1111bb2222cc333303",
  "sourceProposalId": null,
  "volunteersRequired": 20,
  "status": "planned",
  "createdAt": "2026-08-21T09:10:00.000Z"
}
```

---

### `GET /activities`
**Access:** all roles. Volunteers see only `open_for_signup`/`ongoing`/`completed`; SPOC is auto-scoped to their own company; admin sees everything. Query params: `status`, `corporatePartnerId` (admin only), `dateFrom`, `dateTo`.

Response `200`
```json
{
  "activities": [
    {
      "id": "66aa1111bb2222cc333330",
      "title": "Weekend tree plantation drive",
      "activityDate": "2026-09-12",
      "location": "Aarey Colony, Mumbai",
      "corporatePartnerId": "66aa1111bb2222cc333310",
      "corporatePartnerName": "Acme Corp",
      "volunteersRequired": 20,
      "registeredCount": 12,
      "status": "open_for_signup"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### `PATCH /activities/:id/status`
**Access:** admin only. Rejects invalid transitions (e.g. `planned` → `completed` directly).

Request
```json
{
  "status": "ongoing"
}
```

Response `200`
```json
{
  "id": "66aa1111bb2222cc333330",
  "status": "ongoing",
  "updatedAt": "2026-09-12T09:00:00.000Z"
}
```

Response `400` (invalid transition)
```json
{
  "error": "invalid_transition",
  "message": "Cannot move an activity from 'planned' directly to 'completed'."
}
```

---

## 3. Registration & Attendance service

### `POST /activities/:id/register`
**Access:** volunteer only. `volunteerId` and `corporatePartnerId` are taken from the token/activity, not the request body.

Request
```json
{}
```

Response `201`
```json
{
  "id": "66aa1111bb2222cc333340",
  "activityId": "66aa1111bb2222cc333330",
  "volunteerId": "66aa1111bb2222cc333301",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "attendanceStatus": "registered",
  "registeredAt": "2026-08-21T09:15:00.000Z"
}
```

Response `409` (already registered)
```json
{
  "error": "conflict",
  "message": "You have already registered for this activity."
}
```

---

### `PATCH /registrations/:id/attendance`
**Access:** admin only. Blocked unless the activity's status is `ongoing` or `completed`.

Request
```json
{
  "attendanceStatus": "attended"
}
```

Response `200`
```json
{
  "id": "66aa1111bb2222cc333340",
  "attendanceStatus": "attended",
  "updatedAt": "2026-09-12T15:00:00.000Z"
}
```

Response `400` (activity not started yet)
```json
{
  "error": "invalid_state",
  "message": "Cannot mark attendance before the activity has started."
}
```

---

### `GET /activities/:id/registrations`
**Access:** admin (any activity) or spoc (only activities belonging to their own company).

Response `200`
```json
{
  "activityId": "66aa1111bb2222cc333330",
  "volunteersRequired": 20,
  "registrations": [
    {
      "id": "66aa1111bb2222cc333340",
      "volunteerId": "66aa1111bb2222cc333301",
      "volunteerName": "Priya Sharma",
      "attendanceStatus": "registered",
      "registeredAt": "2026-08-21T09:15:00.000Z"
    }
  ],
  "registeredCount": 1
}
```

---

### `GET /users/:id/registrations`
**Access:** the volunteer themself, or admin.

Response `200`
```json
{
  "registrations": [
    {
      "id": "66aa1111bb2222cc333340",
      "activityId": "66aa1111bb2222cc333330",
      "activityTitle": "Weekend tree plantation drive",
      "activityDate": "2026-09-12",
      "attendanceStatus": "registered"
    }
  ]
}
```

---

## 4. Feedback & Classification service

### `POST /activities/:id/feedback`
**Access:** volunteer only, and only if the activity is `completed` and their own registration's `attendanceStatus` is `attended`.

Request
```json
{
  "overallRating": 5,
  "organizationRating": 4,
  "impactRating": 5,
  "comments": "Really well organized, loved seeing the impact firsthand.",
  "suggestions": "Maybe start 30 minutes earlier to beat the heat.",
  "language": "en"
}
```

Response `201`
```json
{
  "id": "66aa1111bb2222cc333350",
  "activityId": "66aa1111bb2222cc333330",
  "volunteerId": "66aa1111bb2222cc333301",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "overallRating": 5,
  "organizationRating": 4,
  "impactRating": 5,
  "comments": "Really well organized, loved seeing the impact firsthand.",
  "suggestions": "Maybe start 30 minutes earlier to beat the heat.",
  "language": "en",
  "themes": [],
  "submittedAt": "2026-09-12T18:00:00.000Z"
}
```
> Note for frontend: `themes` is empty at submission time — the classification job populates it shortly after. Don't build the UI assuming themes are present on the response of this call.

Response `403` (not eligible yet)
```json
{
  "error": "forbidden",
  "message": "Feedback can only be submitted after attending a completed activity."
}
```

Response `409` (already submitted)
```json
{
  "error": "conflict",
  "message": "You have already submitted feedback for this activity."
}
```

---

### `GET /feedback`
**Access:** admin (all, filterable by `activityId`, `corporatePartnerId`, `dateFrom`/`dateTo`, `minRating`, `themeId`) or spoc (auto-scoped to their own company, same filters minus `corporatePartnerId`).

Response `200`
```json
{
  "feedback": [
    {
      "id": "66aa1111bb2222cc333350",
      "activityId": "66aa1111bb2222cc333330",
      "activityTitle": "Weekend tree plantation drive",
      "corporatePartnerId": "66aa1111bb2222cc333310",
      "corporatePartnerName": "Acme Corp",
      "volunteerName": "Priya Sharma",
      "overallRating": 5,
      "organizationRating": 4,
      "impactRating": 5,
      "comments": "Really well organized, loved seeing the impact firsthand.",
      "suggestions": "Maybe start 30 minutes earlier to beat the heat.",
      "themes": [
        { "themeId": "66aa1111bb2222cc333360", "themeName": "High impact felt", "sentiment": "positive" },
        { "themeId": "66aa1111bb2222cc333361", "themeName": "Timing/logistics", "sentiment": "negative" }
      ],
      "submittedAt": "2026-09-12T18:00:00.000Z"
    }
  ],
  "summary": {
    "averageOverallRating": 4.6,
    "totalResponses": 1,
    "topThemes": [
      { "themeName": "High impact felt", "count": 1 },
      { "themeName": "Timing/logistics", "count": 1 }
    ]
  },
  "page": 1,
  "limit": 20,
  "total": 1
}
```
> Note for frontend: `summary` is included on every `GET /feedback` response so Frontend 2 (admin analytics) and Frontend 3 (SPOC reports) can render the ratings/theme summary without a separate aggregation call.

---

## What frontend devs should mock now

Each of the three frontend devs can build entirely against this document before any real backend is deployed:
- **Frontend 1 (Volunteer app):** `POST /auth/register`, `POST /auth/login`, `GET /activities`, `POST /activities/:id/register`, `GET /users/:id/registrations`, `POST /activities/:id/feedback`.
- **Frontend 2 (Admin dashboard):** `GET /proposals`, `PATCH /proposals/:id/approve|reject`, `POST /activities`, `GET /activities`, `PATCH /activities/:id/status`, `GET /feedback`, `GET /users`.
- **Frontend 3 (SPOC dashboard):** `POST /proposals`, `GET /proposals`, `GET /activities`, `GET /activities/:id/registrations`, `GET /feedback`.

Once real endpoints land, only the base URL and the token source change — response shapes here are the contract every backend dev is building to match.
