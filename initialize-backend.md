# Backend Initialization Guide

This document provides a complete reference for initializing a new backend project based on the existing codebase architecture. It covers project structure, dependencies, configuration, and implementation patterns.

---

## 1. Project Overview

**Stack:** Node.js + Express 5 + MongoDB (Mongoose) + JWT Authentication  
**Module System:** ES Modules (`"type": "module"`)  
**Architecture:** Layered — routes → controllers → middleware → models → utils  
**API Versioning:** `/api/v1/` prefix

---

## 2. Required Dependencies

### Production Dependencies (package.json)

```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",                    // Password hashing
    "cloudinary": "^2.10.0",               // Image/video upload to Cloudinary
    "cookie-parser": "^1.4.7",             // Parse cookies from requests
    "cors": "^2.8.6",                      // Cross-origin resource sharing
    "dotenv": "^17.4.2",                   // Environment variable loading
    "express": "^5.2.1",                   // Web framework
    "express-rate-limit": "^8.6.2",        // Rate limiting for auth routes
    "jsonwebtoken": "^9.0.3",              // JWT token generation/verification
    "mongoose": "^9.9.2",                  // MongoDB ODM
    "mongoose-aggregate-paginate-v2": "^1.1.5", // Aggregation pagination
    "multer": "^2.2.0"                     // File upload handling (multipart/form-data)
  }
}
```

### Development Dependencies (add manually)

```json
{
  "devDependencies": {
    "nodemon": "^3.x.x"                    // Auto-reload during development
  }
}
```

### Installation Commands

```bash
npm init -y
npm install bcrypt cloudinary cookie-parser cors dotenv express express-rate-limit jsonwebtoken mongoose mongoose-aggregate-paginate-v2 multer
npm install -D nodemon
```

---

## 3. Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection (CommonJS)
├── src/
│   ├── index.js              # Entry point
│   ├── app.js                # Express app configuration
│   ├── db/
│   │   └── index.js          # Mongoose connection helper (ESM)
│   ├── routes/
│   │   └── auth.routes.js    # Auth endpoints
│   ├── controllers/
│   │   └── auth.controller.js # Auth business logic
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification + role guard
│   │   ├── validator.middleware.js # Input validation
│   │   ├── rateLimiter.middleware.js # Auth route rate limiting
│   │   └── error.middleware.js     # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── DonorProfile.js
│   │   ├── Scheme.js
│   │   ├── Donation.js
│   │   ├── Match.js
│   │   ├── ImpactUpdate.js
│   │   ├── Notification.js
│   │   └── RefreshToken.js
│   └── utils/
│       ├── asyncHandler.js   # Async error wrapper
│       ├── ApiError.js       # Custom error class
│       └── ApiResponse.js    # Standardized success response
├── server.js                 # Model preloader (CommonJS)
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── code-style.md             # Coding conventions
└── auth-api-contract.md      # API contract for frontend
```

---

## 4. Environment Variables (.env)

```env
# Server
PORT=8000
CORS_ORIGIN=*

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
# Optional: MONGODB_PASS= (if using separate password field)

# JWT
ACCESS_TOKEN_SECRET=<64-char-random-string>
ACCESS_TOKEN_EXPIRY=15m          # Short-lived access token
REFRESH_TOKEN_SECRET=<64-char-random-string>
REFRESH_TOKEN_EXPIRY=10d         # Long-lived refresh token

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 5. Database Setup

### Connection File: `config/db.js` (CommonJS)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Connection File: `src/db/index.js` (ESM — used by main entry)

```javascript
import mongoose from "mongoose";

const DB_NAME = "your_database_name";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
```

### Entry Point: `src/index.js`

```javascript
import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });
```

### Model Preloader: `server.js` (runs before app start)

```javascript
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

require('./models/User');
require('./models/RefreshToken');
require('./models/DonorProfile');
require('./models/Scheme');
require('./models/Donation');
require('./models/Match');
require('./models/ImpactUpdate');
require('./models/Notification');

console.log('All models loaded successfully');
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  }
}
```

---

## 6. Core Utility Classes

### `src/utils/asyncHandler.js`

```javascript
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asyncHandler;
```

### `src/utils/ApiError.js`

```javascript
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
```

### `src/utils/ApiResponse.js`

```javascript
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;
```

---

## 7. Authentication System

### Token Strategy

| Token | Location | Expiry | Purpose |
|-------|----------|--------|---------|
| Access Token | Response body + `Authorization: Bearer` header | 15m | API authentication |
| Refresh Token | `httpOnly` cookie (secure) | 10d | Token renewal via `/refresh` |

### User Model: `models/User.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['donor', 'ngoAdmin'], index: true },
  phone: { type: String, index: true },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  refreshToken: { type: String }
}, { timestamps: true });

// Pre-save: hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Instance method: verify password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Instance method: generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

// Instance method: generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
  );
};

export default mongoose.model('User', userSchema);
```

### Auth Middleware: `src/middleware/auth.middleware.js`

```javascript
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../../models/User.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-passwordHash -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission to access this resource.");
        }
        next();
    };
};
```

---

## 8. Auth Routes & Controllers

### Routes: `src/routes/auth.routes.js`

```javascript
import { Router } from "express";
import {
  signupUser, loginUser, refreshAccessToken, logoutUser,
  forgotPassword, resetPassword, getCurrentUser
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateSignupOrLogin } from "../middleware/validator.middleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.route("/signup").post(validateSignupOrLogin, signupUser);
router.route("/login").post(authRateLimiter, validateSignupOrLogin, loginUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/forgot-password").post(authRateLimiter, forgotPassword);
router.route("/reset-password").post(resetPassword);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

export default router;
```

### Controller Highlights: `src/controllers/auth.controller.js`

**Key functions:**
- `signupUser` — Register donor/ngoAdmin, returns accessToken + sets refreshToken cookie
- `loginUser` — Verify credentials, returns tokens
- `refreshAccessToken` — Uses httpOnly refresh cookie to issue new access token
- `logoutUser` — Clears refreshToken from DB and cookies
- `forgotPassword` — Generates reset token, hashes for storage, returns generic success
- `resetPassword` — Verifies hashed token, updates password, clears reset fields
- `getCurrentUser` — Returns user profile from verified JWT

**Token generation helper:**
```javascript
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};
```

**Cookie options (production):**
```javascript
const options = {
    httpOnly: true,
    secure: true,        // Requires HTTPS
    sameSite: 'none'     // For cross-origin if needed
};
```

---

## 9. Validation & Rate Limiting

### Validator: `src/middleware/validator.middleware.js`

```javascript
import ApiError from "../utils/ApiError.js";

export const validateSignupOrLogin = (req, res, next) => {
    const { email, password } = req.body;
    const fields = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        fields.email = "Must be a valid email address.";
    }

    if (!password || password.length < 8) {
        fields.password = "Must be at least 8 characters.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};
```

### Rate Limiter: `src/middleware/rateLimiter.middleware.js`

```javascript
import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                   // 5 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode || 429, "Too many requests, please try again later."));
    }
});
```

---

## 10. Global Error Handler

### `src/middleware/error.middleware.js`

```javascript
import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    let errorCode = "INTERNAL_ERROR";
    if (err.code) {
        errorCode = err.code;
    } else if (statusCode === 400) {
        errorCode = "BAD_REQUEST";
    } else if (statusCode === 401) {
        errorCode = "UNAUTHORIZED";
    } else if (statusCode === 403) {
        errorCode = "FORBIDDEN";
    } else if (statusCode === 409) {
        errorCode = "EMAIL_EXISTS";
    } else if (statusCode === 429) {
        errorCode = "TOO_MANY_REQUESTS";
    }

    const errorResponse = {
        success: false,
        error: { code: errorCode, message }
    };

    if (err.fields) {
        errorResponse.error.fields = err.fields;
    }

    return res.status(statusCode).json(errorResponse);
};
```

**Register in `src/app.js`:**
```javascript
import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);
```

---

## 11. Express App Configuration

### `src/app.js`

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

// Error handler (must be last)
import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

export default app;
```

---

## 12. Data Models

### DonorProfile (`models/DonorProfile.js`)
```javascript
const donorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  causeTags: { type: [String], index: true },
  budgetRange: { min: Number, max: Number },
  frequency: { type: String, required: true, enum: ['oneTime', 'monthly', 'quarterly', 'yearly'], index: true },
  preferredLocation: { type: String, index: true },
  taxBenefitInterest: { type: Boolean }
}, { timestamps: true });
```

### Scheme (`models/Scheme.js`)
```javascript
const schemeSchema = new mongoose.Schema({
  ngoAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  causeTags: { type: [String], required: true, index: true },
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, required: true, default: 0 },
  location: { type: String, required: true, index: true },
  deadline: { type: Date, required: true, index: true },
  status: { type: String, required: true, enum: ['draft', 'active', 'completed', 'cancelled'], index: true },
  images: { type: [String] }
}, { timestamps: true });
```

### Donation (`models/Donation.js`)
```javascript
const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, unique: true, sparse: true },
  isRecurring: { type: Boolean, required: true, default: false, index: true },
  receiptUrl: { type: String },
  status: { type: String, required: true, enum: ['pending', 'successful', 'failed', 'refunded'], index: true }
}, { timestamps: true });
```

### Match (`models/Match.js`)
```javascript
const matchSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  matchScore: { type: Number, required: true, min: 0, max: 100 },
  matchedOn: { type: Date, required: true, index: true },
  viewed: { type: Boolean, required: true, default: false }
}, { timestamps: true });

matchSchema.index({ donorId: 1, schemeId: 1 }, { unique: true });
matchSchema.index({ donorId: 1, matchScore: -1 });
matchSchema.index({ donorId: 1, viewed: 1, matchScore: -1 });
```

### ImpactUpdate (`models/ImpactUpdate.js`)
```javascript
const impactUpdateSchema = new mongoose.Schema({
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrls: { type: [String] },
  postedAt: { type: Date, required: true }
}, { timestamps: true });

impactUpdateSchema.index({ schemeId: 1, postedAt: -1 });
```

### Notification (`models/Notification.js`)
```javascript
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['match', 'payment', 'reminder', 'impactUpdate', 'system'] },
  message: { type: String, required: true },
  read: { type: Boolean, required: true, default: false }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
```

### RefreshToken (`models/RefreshToken.js`)
```javascript
const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, index: true },
  issuedAt: { type: Date, required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL auto-delete
  revoked: { type: Boolean, default: false, index: true }
});
```

---

## 13. API Contract Summary

**Base URL:** `http://localhost:8000/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register donor/ngoAdmin |
| POST | `/login` | ❌ | Login, returns accessToken + sets refreshToken cookie |
| POST | `/refresh` | ❌ (cookie) | Renew access token via refresh cookie |
| POST | `/logout` | ✅ | Clear tokens |
| POST | `/forgot-password` | ❌ | Request password reset email |
| POST | `/reset-password` | ❌ | Reset password with token |
| GET | `/me` | ✅ | Get current user profile |

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "fields": { "field": "detail" }  // Only for VALIDATION_ERROR
  }
}
```

**Standard Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Description"
}
```

---

## 14. Code Style Conventions

### Naming
- Files: lowercase, descriptive (`auth.routes.js`, `user.controller.js`)
- Variables/functions: camelCase (`generateAccessToken`, `verifyJWT`)
- Constants: UPPER_SNAKE_CASE (`DB_NAME`)

### Formatting
- 4 spaces indentation
- Braces on same line: `const fn = () => { ... }`
- Double quotes for strings
- Minimal semicolons (optional)

### Patterns
- **Controllers:** Wrapped with `asyncHandler`, use `ApiError`/`ApiResponse`
- **Routes:** Thin, declarative, use `router.route().method()`
- **Middleware:** Composable, single responsibility
- **Models:** Instance methods for domain logic (`isPasswordCorrect`, `generateAccessToken`)
- **Validation:** Inline in controllers + dedicated validator middleware
- **Uploads:** Multer → local temp → Cloudinary → delete temp

---

## 15. Quick Start Checklist

```bash
# 1. Initialize project
npm init -y

# 2. Install dependencies
npm install bcrypt cloudinary cookie-parser cors dotenv express express-rate-limit jsonwebtoken mongoose mongoose-aggregate-paginate-v2 multer
npm install -D nodemon

# 3. Set package.json
# "type": "module"
# "main": "src/index.js"
# "scripts": { "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js" }

# 4. Create folder structure
mkdir -p src/{routes,controllers,middleware,models,utils,db} config

# 5. Create .env with all required variables

# 6. Implement files in this order:
#    - utils/asyncHandler.js, ApiError.js, ApiResponse.js
#    - config/db.js, src/db/index.js
#    - models/User.js (first, others depend on it)
#    - middleware/auth.middleware.js, validator.middleware.js, rateLimiter.middleware.js, error.middleware.js
#    - controllers/auth.controller.js
#    - routes/auth.routes.js
#    - src/app.js
#    - src/index.js
#    - server.js

# 7. Run
npm run dev
```

---

## 16. Extending the Project

### Adding New Resource (e.g., Schemes)

1. **Model:** `models/Scheme.js`
2. **Controller:** `controllers/scheme.controller.js`
3. **Routes:** `routes/scheme.routes.js` with `verifyJWT` + `requireRole('ngoAdmin')`
4. **Register in `app.js`:**
   ```javascript
   import schemeRouter from "./routes/scheme.routes.js";
   app.use("/api/v1/schemes", schemeRouter);
   ```

### Adding File Upload Support

1. Create `src/middleware/multer.middleware.js`
2. Configure Cloudinary in `src/utils/cloudinary.js`
3. Use `upload.fields([...])` in route definitions

---

## 17. Security Notes

- **Never commit `.env`** — add to `.gitignore`
- **Use HTTPS in production** — `secure: true` cookies require it
- **Rotate secrets periodically**
- **Validate all inputs** — both middleware and controller level
- **Rate limit sensitive endpoints** — auth, password reset
- **Use `httpOnly` cookies** — prevents XSS token theft
- **Short access token expiry** — limits exposure window
- **Hash passwords with bcrypt** — cost factor 10+

---

This document serves as a complete reference for bootstrapping a new backend with the same architecture, patterns, and conventions as the existing codebase.