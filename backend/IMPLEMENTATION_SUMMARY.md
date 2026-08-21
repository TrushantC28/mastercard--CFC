# Auth & User Service — Implementation Summary

This document summarizes the architecture, design decisions, and completed implementation of the **Auth & User Service** on the `backend/feature-auth-service` branch.

---

## 🏛️ 1. Architecture Overview

The backend follows a clean **Layered (N-Tier) Architecture** ensuring separation of concerns, testability, and maintainability:

```
                  ┌────────────────────────┐
                  │    HTTP Client / UI    │
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │  Express App & Routes  │  (app.js, *.routes.js)
                  └───────────┬────────────┘
                              │
                    [Middleware Pipeline]
                    - Rate Limiting (express-rate-limit)
                    - Auth & RBAC (requireAuth, requireRole)
                              │
                              ▼
                  ┌────────────────────────┐
                  │      Controllers       │  (*.controller.js)
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │     Service Layer      │  (*.service.js)
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   Mongoose Data Models │  (User.js, *.model.js)
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │    MongoDB Database    │
                  └────────────────────────┘
```

---

## 📦 2. Completed Components & Implementation Details

### 2.1 Mongoose User Model ([`src/models/User.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/models/User.js))

- **Schema Fields**:
  - `email`: `String`, `required: true`, `unique: true`, `lowercase: true`, `trim: true`.
  - `passwordHash`: `String`, `required: true`, `select: false` (hidden from default queries).
  - `name`: `String`, `trim: true`.
  - `phone`: `String`, `trim: true`.
  - `role`: `String`, `required: true`, `enum: ["volunteer", "admin", "spoc"]`.
  - `corporatePartnerId`: `ObjectId`, `ref: "CorporatePartner"`, with custom schema validator:
    - **`spoc`**: Required (`value != null`).
    - **`admin`**: Must be absent / null (`value == null`).
    - **`volunteer`**: Optional.
  - `status`: `String`, `enum: ["active", "inactive"]`, `default: "active"`.
  - `refreshToken`: `String`, `select: false`.
  - `timestamps`: Automatically manages `createdAt` and `updatedAt`.
- **Indexes**:
  - `email: 1` (unique).
  - `role: 1` (single index for role-based queries).
  - `{ role: 1, corporatePartnerId: 1 }` (compound index for corporate-scoped lookups).
- **Hooks & Methods**:
  - **Pre-Save Password Hashing**: Uses `bcrypt.hash(..., 10)`. Checks `this.isModified("passwordHash")` so modifying other fields (e.g. `name`, `status`) on an existing user does not re-hash the existing password hash.
  - **Virtual `password` Setter**: Enables direct assignment via `new User({ ..., password: "..." })`.
  - **`comparePassword(candidatePassword)` Instance Method**: Compares candidate plaintext password with the hashed password and returns a boolean.

---

### 2.2 Security & Authentication Middlewares ([`src/middleware/auth.middleware.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/middleware/auth.middleware.js))

- **`requireAuth`**:
  - Extracts JWT token from the `Authorization: Bearer <token>` header (or cookies).
  - Verifies token signature using `ACCESS_TOKEN_SECRET`.
  - Normalizes and attaches the decoded payload (`_id`, `userId`, `role`, `corporatePartnerId`) to `req.user`.
  - Returns `401 Unauthorized` (`code: "UNAUTHORIZED"`) if the token is missing, expired (`TokenExpiredError`), or invalid.
- **`requireRole(...allowedRoles)`**:
  - Middleware factory executed after `requireAuth`.
  - Checks if `req.user.role` is included in `allowedRoles`.
  - Returns `403 Forbidden` (`code: "FORBIDDEN"`) if access is denied.

---

### 2.3 Business Logic & Services

#### **Auth Service** ([`src/services/auth.service.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/services/auth.service.js))
- **`registerUser({ email, password, name, phone, role, corporatePartnerId })`**:
  1. Validates required fields (`email`, `password`, `role`).
  2. Enforces role-specific `corporatePartnerId` rules.
  3. Checks for duplicate email registration (`400 Bad Request` with `code: "EMAIL_EXISTS"` and clear message `"Email already registered"`). Handles MongoDB unique key collision (code 11000) gracefully.
  4. Creates the user document (pre-save hook hashes password).
  5. Strips `passwordHash` and `refreshToken` before returning the sanitized user record.
- **`loginUser({ email, password })`**:
  1. Validates `email` and `password` presence.
  2. Queries user with `.select("+passwordHash")`.
  3. Uses `user.comparePassword(password)` for verification.
  4. Returns a generic `401 Unauthorized` message (`"Invalid email or password"`) on failure to prevent user enumeration.
  5. On success, generates a signed JWT (payload: `_id`, `userId`, `role`, `corporatePartnerId`) and returns token + sanitized user object.

#### **User Service** ([`src/services/user.service.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/services/user.service.js))
- **`getUserProfile(userId)`**:
  - Fetches the user profile by ID excluding `passwordHash` and `refreshToken`.
- **`listUsers({ role, corporatePartnerId, page, limit })`**:
  - Builds query filters for role and corporate partner scoping.
  - Implements pagination (`skip`, `limit`, `countDocuments`).
  - Returns `{ users, page, limit, total }`.

---

### 2.4 Controllers & Routes

| Endpoint | Method | Access / Middleware | Controller | Service |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public, `authRateLimiter` | `authController.register` | `authService.registerUser` |
| `/auth/login` | `POST` | Public, `authRateLimiter` | `authController.login` | `authService.loginUser` |
| `/auth/logout` | `POST` | Authenticated (`requireAuth`) | `authController.logout` | Clears cookie session |
| `/users/me` | `GET` | Authenticated (`requireAuth`) | `userController.getCurrentUser` | `userService.getUserProfile` |
| `/users` | `GET` | Admin Only (`requireAuth`, `requireRole('admin')`) | `userController.getUsers` | `userService.listUsers` |

---

### 2.5 Application Integration & Error Handling

- **[`src/app.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/app.js)**:
  - Configured CORS, Express JSON parser (16kb limit), URL-encoded parser, and Cookie Parser.
  - Mounted `/auth` and `/users` routes.
  - Configured global `errorHandler` middleware.
- **Standardized Response Shapes**:
  - Success responses wrapped via [`src/utils/ApiResponse.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/utils/ApiResponse.js) (`{ statusCode, data, message, success: true }`).
  - Error responses standardized via [`src/middleware/error.middleware.js`](file:///home/trushant/trushant/mastercard-CFC/backend/src/middleware/error.middleware.js) (`{ success: false, error: { code, message, fields? } }`).

---

## 📑 3. Documentation Assets Created

1. **[`vep_mock_api_reference.md`](file:///home/trushant/trushant/mastercard-CFC/backend/vep_mock_api_reference.md)**:
   - Full API reference covering all request/response schemas, JWT structure, Authorization header format, and error codes.
2. **[`API_TESTING_GUIDE.md`](file:///home/trushant/trushant/mastercard-CFC/backend/API_TESTING_GUIDE.md)**:
   - Step-by-step testing manual with 15 test cases (positive, negative, security, RBAC), Postman environment setup, and auto-token test scripts.

---

## 🔍 4. Verification & Testing Completed

- **Unit Verification**:
  - Pre-save bcrypt hashing confirmed.
  - Re-hashing prevention on non-password updates confirmed.
  - `comparePassword` instance method verified for true/false cases.
  - `requireAuth` and `requireRole` verified for valid tokens, expired/tampered tokens, and role mismatches.
  - Register, Login, Me, and Users pagination logic verified.
- **Syntax & Build Validation**:
  - Verified with `node -c` across all models, controllers, services, middlewares, and routes.
