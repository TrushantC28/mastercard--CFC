# Backend Code Style & Conventions

## 1. Naming Conventions

- **Files:** lowercase, descriptive (`auth.routes.js`, `auth.controller.js`, `auth.middleware.js`)
- **Variables / Functions:** camelCase (`generateAccessToken`, `verifyJWT`, `validateSignupOrLogin`)
- **Constants:** UPPER_SNAKE_CASE (`DB_NAME`, `ACCESS_TOKEN_SECRET`)
- **Models / Classes:** PascalCase (`User`, `DonorProfile`, `ApiError`, `ApiResponse`)

## 2. Formatting

- **Indentation:** 4 spaces
- **Braces:** Same line (`const fn = () => { ... }`)
- **Quotes:** Double quotes for strings (`"mongodb"`)
- **Module System:** ES Modules (`import / export`, `"type": "module"`)

## 3. Architecture & Patterns

- **Controllers:** Wrapped with `asyncHandler`, return `res.status(...).json(new ApiResponse(...))`
- **Errors:** Throw `ApiError(statusCode, message, errors)` — caught automatically by `asyncHandler` and passed to `errorHandler`
- **Routes:** Modular and declarative with `router.route(path).method(middleware, controller)`
- **Models:** Encapsulate methods on schemas (e.g. `isPasswordCorrect`, token generation, pre-save hashing)
- **Middleware:** Single-responsibility, reusable functions
- **Uploads:** Multer with temporary storage before uploading to Cloudinary
