# Volunteer Experience Platform — Mock API reference

Covers every endpoint across all four backend services (Auth, Activity & Proposal, Registration & Attendance, Feedback & Classification). Each entry has the method, path, who can call it, a dummy request body, and dummy success/error responses using the exact field names and enum values from the schema — so the three frontend devs can build UI against fixed shapes now and swap in the real backend later without changing any field names.

**Conventions used throughout**
- All IDs are dummy 24-char hex strings shaped like real MongoDB ObjectIds (e.g. `"66aa1111bb2222cc3333dd44"`) — treat them as opaque strings, not real records.
- Every protected endpoint expects `Authorization: Bearer <token>` — a missing/invalid token always returns the same 401 shape shown once at the top and not repeated per endpoint.
- Every role-gated endpoint returns the same 403 shape shown once at the top and not repeated per endpoint.
- Dates are ISO 8601 strings.

### Shared error shapes

```json
// 401 — no/invalid/expired token
{
  "error": "unauthorized",
  "message": "Authentication required."
}
```

```json
// 403 — valid token, wrong role
{
  "error": "forbidden",
  "message": "You do not have permission to perform this action."
}
```

```json
// 400 — validation failure (shape is the same across all endpoints; "fields" varies)
{
  "error": "validation_error",
  "message": "One or more fields are invalid.",
  "fields": {
    "email": "Must be a valid email address."
  }
}
```

---

## 1. Auth & User service

### `POST /auth/register`
**Access:** public

Request
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

Response `201`
```json
{
  "id": "66aa1111bb2222cc333301",
  "email": "priya.volunteer@example.com",
  "name": "Priya Sharma",
  "phone": "9876543210",
  "role": "volunteer",
  "corporatePartnerId": null,
  "status": "active",
  "createdAt": "2026-08-21T09:00:00.000Z"
}
```

Response `409` (duplicate email)
```json
{
  "error": "conflict",
  "message": "An account with this email already exists."
}
```

---

### `POST /auth/login`
**Access:** public

Request
```json
{
  "email": "priya.volunteer@example.com",
  "password": "SamplePass123!"
}
```

Response `200`
```json
{
  "token": "dummy.jwt.token.for.frontend.mocking",
  "user": {
    "id": "66aa1111bb2222cc333301",
    "email": "priya.volunteer@example.com",
    "name": "Priya Sharma",
    "role": "volunteer",
    "corporatePartnerId": null
  }
}
```

Response `401` (bad credentials — deliberately generic, doesn't reveal which field was wrong)
```json
{
  "error": "unauthorized",
  "message": "Invalid email or password."
}
```

---

### `POST /auth/logout`
**Access:** any authenticated user

Response `200`
```json
{
  "message": "Logged out successfully."
}
```

---

### `GET /users/me`
**Access:** any authenticated user

Response `200` (example: a SPOC user)
```json
{
  "id": "66aa1111bb2222cc333302",
  "email": "spoc@acmecorp.com",
  "name": "Rahul Mehta",
  "phone": "9123456780",
  "role": "spoc",
  "corporatePartnerId": "66aa1111bb2222cc333310",
  "status": "active"
}
```

---

### `GET /users`
**Access:** admin only. Query params: `role`, `corporatePartnerId` (both optional filters), `page`, `limit`.

Response `200`
```json
{
  "users": [
    {
      "id": "66aa1111bb2222cc333301",
      "email": "priya.volunteer@example.com",
      "name": "Priya Sharma",
      "role": "volunteer",
      "corporatePartnerId": null,
      "status": "active"
    },
    {
      "id": "66aa1111bb2222cc333302",
      "email": "spoc@acmecorp.com",
      "name": "Rahul Mehta",
      "role": "spoc",
      "corporatePartnerId": "66aa1111bb2222cc333310",
      "status": "active"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 2
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
