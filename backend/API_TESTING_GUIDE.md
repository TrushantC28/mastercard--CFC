# Auth & User Service — Step-by-Step Testing Guide

This guide provides end-to-end instructions for testing all Auth & User service endpoints (`/auth/register`, `/auth/login`, `/auth/logout`, `GET /users/me`, `GET /users`), including validation rules, security checks, role-based access control, and complete **Postman** setup instructions.

---

## 📋 Table of Contents
1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Postman Setup & Automation Guidelines](#2-postman-setup--automation-guidelines)
3. [Step-by-Step Testing Scenarios](#3-step-by-step-testing-scenarios)
   - [Step 1: User Registration (`POST /auth/register`)](#step-1-user-registration-post-authregister)
   - [Step 2: User Authentication (`POST /auth/login`)](#step-2-user-authentication-post-authlogin)
   - [Step 3: User Profile Verification (`GET /users/me`)](#step-3-user-profile-verification-get-usersme)
   - [Step 4: Admin User Directory & Filters (`GET /users`)](#step-4-admin-user-directory--filters-get-users)
   - [Step 5: User Logout (`POST /auth/logout`)](#step-5-user-logout-post-authlogout)
4. [Summary Checklist of Test Cases](#4-summary-checklist-of-test-cases)

---

## 1. Prerequisites & Environment Setup

### 1.1 Verify `.env` File
Ensure your `.env` file in the `backend/` directory contains:

```env
PORT=8000
CORS_ORIGIN=*
DB_NAME=mastercard_cfc
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_long_64_char_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_long_64_char_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

### 1.2 Start the Backend Server
Run the following command inside `backend/`:

```bash
npm run dev
```
> Verify console output:
> ```
> Server is running at port: 8000
> MongoDB connected !! DB HOST: ...
> ```

---

## 2. Postman Setup & Automation Guidelines

### 2.1 Postman Environment Variables
Create a new Environment in Postman (e.g., **`MasterCard-CFC-Dev`**) with the following initial variables:

| Variable | Initial Value | Current Value | Description |
| :--- | :--- | :--- | :--- |
| `baseUrl` | `http://localhost:8000` | `http://localhost:8000` | Server Base URL |
| `volunteerToken` | *(leave blank)* | *(auto-set)* | Token generated after volunteer login |
| `adminToken` | *(leave blank)* | *(auto-set)* | Token generated after admin login |
| `spocToken` | *(leave blank)* | *(auto-set)* | Token generated after SPOC login |
| `corporatePartnerId` | `66aa1111bb2222cc333310` | `66aa1111bb2222cc333310` | Dummy/Real Corporate Partner ID |

---

### 2.2 Postman Auto-Token Script (Tests Tab)
To avoid copying and pasting JWT tokens manually, add this snippet to the **Tests** tab of your `POST /auth/login` requests in Postman:

```javascript
// Automatically saves the JWT token to Postman environment
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    const token = responseJson.data?.token || responseJson.token;
    const role = responseJson.data?.user?.role;
    
    if (token) {
        if (role === "admin") {
            pm.environment.set("adminToken", token);
            console.log("Admin token saved successfully!");
        } else if (role === "spoc") {
            pm.environment.set("spocToken", token);
            console.log("SPOC token saved successfully!");
        } else {
            pm.environment.set("volunteerToken", token);
            console.log("Volunteer token saved successfully!");
        }
    }
}
```

---

## 3. Step-by-Step Testing Scenarios

---

### Step 1: User Registration (`POST /auth/register`)

#### 🔹 1.1 Positive Test: Register a Volunteer
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "priya.volunteer@example.com",
    "password": "Password123!",
    "name": "Priya Sharma",
    "phone": "9876543210",
    "role": "volunteer",
    "corporatePartnerId": null
  }
  ```
- **Expected Status:** `201 Created`
- **Expected Response:**
  ```json
  {
    "statusCode": 201,
    "data": {
      "id": "<24-char-hex-id>",
      "email": "priya.volunteer@example.com",
      "name": "Priya Sharma",
      "phone": "9876543210",
      "role": "volunteer",
      "corporatePartnerId": null,
      "status": "active"
    },
    "message": "User registered successfully",
    "success": true
  }
  ```
  *(Verify `passwordHash` is NOT present).*

---

#### 🔹 1.2 Positive Test: Register an Admin
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Request Body:**
  ```json
  {
    "email": "admin.john@example.com",
    "password": "AdminPassword123!",
    "name": "John Admin",
    "phone": "9876500000",
    "role": "admin",
    "corporatePartnerId": null
  }
  ```
- **Expected Status:** `201 Created`

---

#### 🔹 1.3 Positive Test: Register a SPOC
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Request Body:**
  ```json
  {
    "email": "rahul.spoc@acmecorp.com",
    "password": "SpocPassword123!",
    "name": "Rahul Mehta",
    "phone": "9123456780",
    "role": "spoc",
    "corporatePartnerId": "66aa1111bb2222cc333310"
  }
  ```
- **Expected Status:** `201 Created`

---

#### 🔸 1.4 Negative Test: Duplicate Email
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Request Body:** Re-send the payload from 1.1 with `priya.volunteer@example.com`.
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
  ```json
  {
    "success": false,
    "error": {
      "code": "EMAIL_EXISTS",
      "message": "Email already registered"
    }
  }
  ```

---

#### 🔸 1.5 Negative Test: SPOC Missing Corporate Partner ID
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Request Body:**
  ```json
  {
    "email": "invalid.spoc@example.com",
    "password": "Password123!",
    "role": "spoc",
    "corporatePartnerId": null
  }
  ```
- **Expected Status:** `400 Bad Request`
- **Expected Error Message:** `"corporatePartnerId is required for spoc role"`

---

#### 🔸 1.6 Negative Test: Admin With Corporate Partner ID
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Request Body:**
  ```json
  {
    "email": "invalid.admin@example.com",
    "password": "Password123!",
    "role": "admin",
    "corporatePartnerId": "66aa1111bb2222cc333310"
  }
  ```
- **Expected Status:** `400 Bad Request`
- **Expected Error Message:** `"corporatePartnerId must be absent for admin role"`

---

### Step 2: User Authentication (`POST /auth/login`)

#### 🔹 2.1 Positive Test: Login as Volunteer
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "priya.volunteer@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "<24-char-hex-id>",
        "email": "priya.volunteer@example.com",
        "name": "Priya Sharma",
        "role": "volunteer",
        "corporatePartnerId": null,
        "status": "active"
      }
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```

---

#### 🔹 2.2 Positive Test: Login as Admin
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin.john@example.com",
    "password": "AdminPassword123!"
  }
  ```
- **Expected Status:** `200 OK`
- *(Auto-saves `adminToken` in Postman).*

---

#### 🔸 2.3 Negative Test: Wrong Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/login`
- **Request Body:**
  ```json
  {
    "email": "priya.volunteer@example.com",
    "password": "WrongPassword!"
  }
  ```
- **Expected Status:** `401 Unauthorized`
- **Expected Response:**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    }
  }
  ```

---

#### 🔸 2.4 Negative Test: Non-Existent Email
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/login`
- **Request Body:**
  ```json
  {
    "email": "nobody@example.com",
    "password": "SomePassword123!"
  }
  ```
- **Expected Status:** `401 Unauthorized`
- **Expected Response:** `"Invalid email or password"` *(identical generic message, no email enumeration leak)*.

---

### Step 3: User Profile Verification (`GET /users/me`)

#### 🔹 3.1 Positive Test: Fetch Own Profile
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users/me`
- **Headers:**
  - `Authorization: Bearer {{volunteerToken}}`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "id": "<24-char-hex-id>",
      "email": "priya.volunteer@example.com",
      "name": "Priya Sharma",
      "phone": "9876543210",
      "role": "volunteer",
      "corporatePartnerId": null,
      "status": "active"
    },
    "message": "User profile fetched successfully",
    "success": true
  }
  ```

---

#### 🔸 3.2 Negative Test: Missing Authorization Header
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users/me`
- **Headers:** *(None)*
- **Expected Status:** `401 Unauthorized`
- **Expected Response:**
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

#### 🔸 3.3 Negative Test: Invalid / Tampered Token
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users/me`
- **Headers:** `Authorization: Bearer invalid.token.signature`
- **Expected Status:** `401 Unauthorized`
- **Expected Response:** `"Invalid token. Authentication required."`

---

### Step 4: Admin User Directory & Filters (`GET /users`)

#### 🔹 4.1 Positive Test: Admin Viewing All Users
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users`
- **Headers:**
  - `Authorization: Bearer {{adminToken}}`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "users": [
        {
          "id": "<id>",
          "email": "rahul.spoc@acmecorp.com",
          "name": "Rahul Mehta",
          "role": "spoc",
          "corporatePartnerId": "66aa1111bb2222cc333310",
          "status": "active"
        },
        {
          "id": "<id>",
          "email": "admin.john@example.com",
          "name": "John Admin",
          "role": "admin",
          "corporatePartnerId": null,
          "status": "active"
        },
        {
          "id": "<id>",
          "email": "priya.volunteer@example.com",
          "name": "Priya Sharma",
          "role": "volunteer",
          "corporatePartnerId": null,
          "status": "active"
        }
      ],
      "page": 1,
      "limit": 20,
      "total": 3
    },
    "message": "Users fetched successfully",
    "success": true
  }
  ```

---

#### 🔹 4.2 Positive Test: Filter by Role & Pagination
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users?role=volunteer&page=1&limit=10`
- **Headers:**
  - `Authorization: Bearer {{adminToken}}`
- **Expected Status:** `200 OK`
- *(Verify only users with `"role": "volunteer"` are returned).*

---

#### 🔸 4.3 Negative Test: Volunteer Accessing Admin Route (RBAC)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/users`
- **Headers:**
  - `Authorization: Bearer {{volunteerToken}}`
- **Expected Status:** `403 Forbidden`
- **Expected Response:**
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

### Step 5: User Logout (`POST /auth/logout`)

#### 🔹 5.1 Positive Test: Logout
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/logout`
- **Headers:**
  - `Authorization: Bearer {{volunteerToken}}`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Logged out successfully.",
    "success": true
  }
  ```

---

## 4. Summary Checklist of Test Cases

| # | Test Case | Method & Endpoint | Auth Required | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Register Volunteer | `POST /auth/register` | None | `201 Created` |
| 2 | Register Admin | `POST /auth/register` | None | `201 Created` |
| 3 | Register SPOC (with Partner ID) | `POST /auth/register` | None | `201 Created` |
| 4 | Register Duplicate Email | `POST /auth/register` | None | `400 Bad Request` |
| 5 | Register SPOC without Partner ID | `POST /auth/register` | None | `400 Bad Request` |
| 6 | Register Admin with Partner ID | `POST /auth/register` | None | `400 Bad Request` |
| 7 | Login Valid Credentials | `POST /auth/login` | None | `200 OK` |
| 8 | Login Invalid Password | `POST /auth/login` | None | `401 Unauthorized` |
| 9 | Login Non-existent Email | `POST /auth/login` | None | `401 Unauthorized` |
| 10 | Get Profile (`/me`) | `GET /users/me` | Bearer Token | `200 OK` |
| 11 | Get Profile Without Token | `GET /users/me` | None | `401 Unauthorized` |
| 12 | Get All Users (Admin) | `GET /users` | Admin Token | `200 OK` |
| 13 | Get Users Filtered by Role | `GET /users?role=volunteer` | Admin Token | `200 OK` |
| 14 | Get All Users (Volunteer Token) | `GET /users` | Volunteer Token | `403 Forbidden` |
| 15 | Logout User | `POST /auth/logout` | Bearer Token | `200 OK` |
