# 🏆 Final Master Implementation Plan — SevaSahayog Volunteer Experience & Feedback Platform

## 📌 Executive Summary
The **SevaSahayog Foundation Volunteer Experience Platform** digitizes feedback collection, activity design, and corporate stakeholder reporting for ~35 monthly volunteering activities.

It converts fragmented, multilingual, and unstructured human feedback into evidence-backed decisions without adding operational burden for volunteers or NGO teams by combining:
- **1-Minute Guided Feedback Submission** with strict eligibility checks & duplicate guards.
- **Asynchronous Multilingual Classification** extracting themes, sentiment, and urgent concerns without blocking API responses.
- **AI Pattern Finder & Actionable Recommendation Engine** that identifies recurring operational issues, recommends concrete improvements, and tracks learning effectiveness over time.
- **Multi-Tenant Reporting & CSV Exporter** guaranteeing SPOC company data privacy while enabling board-ready report downloads for Admins.

---

## 🏛️ System Architecture & Service Division

```
                      +-----------------------------------+
                      |      Frontend React + Vite UI     |
                      +-----------------------------------+
                                        |
                                  REST APIs (JWT)
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
+--------------+                +--------------+                +--------------+
|  Backend 1   |                |  Backend 2   |                |  Backend 3   |
| Auth & Users |                |  Activities  |                | Registration |
+--------------+                +--------------+                +--------------+
       |                                |                                |
       +--------------------------------+--------------------------------+
                                        |
                                        v
                      +-----------------------------------+
                      |            Backend 4              |
                      |  Feedback, AI Classifier Engine,  |
                      |  Action Recommendations & Alerts  |
                      +-----------------------------------+
                                        |
                                        v
                      +-----------------------------------+
                      |       MongoDB Atlas Database      |
                      | (feedback, users, activities, CP) |
                      +-----------------------------------+
```

---

## 📦 Complete Backend Modules & Technical Specs

### Module 1: User Authentication & Role Scoping (Backend 1 Integration)
- **Roles**: `volunteer`, `spoc`, `admin`.
- **JWT Claims**: HMAC-SHA256 tokens containing `_id`, `role`, and `corporatePartnerId`.
- **Middlewares**: `requireAuth` verifies tokens; `requireRole('volunteer' | 'spoc' | 'admin')` enforces RBAC.

---

### Module 2: Feedback Submission (`POST /activities/:id/feedback`)
- **Eligibility Validation**:
  1. Activity status must be `"completed"`.
  2. Event registration attendance status must be `"attended"`.
  *(Returns `403 Forbidden` if either check fails).*
- **Duplicate Submission Guard**: Checks existing `(activityId, volunteerId)` records and MongoDB compound unique index. *(Returns `409 Conflict` if duplicate).*
- **Non-Blocking Execution**: Saves feedback document immediately and delegates classification & pattern analysis to background workers.

---

### Module 3: AI Classification & Urgent Concern Alerting (`classifier.service.js`)
- **Multilingual Token Engine**: Matches text against keywords in English, Hindi, and Marathi (`अच्छा`, `खराब`, `समय`, `उत्कृष्ट`, etc.).
- **Urgent Concern Detection**: Flags `isUrgent = true` if `overallRating <= 2` OR text matches emergency/safety keywords.
- **Real-Time Admin Alert**: Triggers `notifyUrgentFeedbackAlert` via Nodemailer to alert SevaSahayog admins immediately.

---

### Module 4: AI Pattern Finder & Action Recommendation Engine (`aiInsight.service.js`)
- **Pattern Finder**: Analyzes feedback across recent events to detect recurring issues (theme count $\ge 2$ or rating $\le 2$).
- **Actionable Insight Generator**: Recommends concrete operational actions (e.g. for logistics: *"Improve transportation instructions, adjust start times by 30 mins, and assign a transport coordinator."*).
- **Admin Review API (`PATCH /ai-insights/:id/review`)**: Enables Admins to `accept`, `modify`, or `reject` recommendations with notes.
- **Closed-Loop Learning Evaluator (`updateActionEffectiveness`)**: Measures post-action rating improvement in subsequent events to update an **Effectiveness Score (0–100%)**.

---

### Module 5: Multi-Tenant Analytics & CSV Exporter (`feedbackExport.controller.js`)
- **`GET /feedback`**:
  - Admin view: Full cross-organization filters (`activityId`, `corporatePartnerId`, `dateFrom`, `dateTo`, `minRating`, `themeId`).
  - SPOC view: Auto-scoped strictly to `req.user.corporatePartnerId`.
  - Analytics Summary: Returns calculated `averageOverallRating`, `totalResponses`, and `topThemes` summary object.
- **`GET /feedback/export`**:
  - Streams downloadable CSV report files containing complete feedback metrics, joined activity/company titles, theme tags, and urgent flags.

---

### Module 6: Fail-Safe Notification Module (`notification.service.js`)
- **Email Triggers**:
  - `notifyProposalDecision`: Proposal approval/rejection updates for SPOCs.
  - `notifyEventReminder`: Event reminders for registered volunteers.
  - `notifyFeedbackPrompt`: Feedback prompts post-activity.
  - `notifyUrgentFeedbackAlert`: Emergency/low-rating alerts for Admins.
- **Resilience**: Handled via Nodemailer with fail-safe error logging (never throws or crashes main HTTP requests).

---

## 🗄️ Database Schemas & Collections (`backend/src/models/`)

### 1. `Feedback` (`feedback.model.js`)
- Fields: `activityId`, `volunteerId`, `corporatePartnerId`, `overallRating`, `organizationRating`, `impactRating`, `comments`, `suggestions`, `language`, `themes`, `isUrgent`, `submittedAt`.
- Unique Index: `{ activityId: 1, volunteerId: 1 }`.

### 2. `AiInsight` (`aiInsight.model.js`)
- Fields: `activityId`, `corporatePartnerId`, `themeName`, `recurringCount`, `severity`, `insightText`, `recommendedAction`, `status`, `adminNotes`, `reviewedBy`, `reviewedAt`, `initialAverageRating`, `postActionAverageRating`, `effectivenessScore`.
- Index: `{ corporatePartnerId: 1, status: 1 }`.

---

## 📡 Complete REST API Endpoint Directory

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/activities/:id/feedback` | `POST` | Volunteer | Submit feedback for completed & attended activity |
| `/feedback` | `GET` | Admin / SPOC | View filtered feedback records & analytics summary |
| `/feedback/export` | `GET` | Admin / SPOC | Download CSV report of feedback records |
| `/ai-insights` | `GET` | Admin / SPOC | View generated AI insights & recommendations |
| `/ai-insights/:id/review` | `PATCH` | Admin | Review, accept, modify, or reject AI recommendations |

---

## 🧪 Testing & Verification Strategy

### Automated Suite (`npm test`)
Executes `backend/src/test_all.js` verifying 8/8 test cases:
1. English & Hindi text theme classification.
2. Multilingual keyword matching.
3. Fail-safe notification wrapper execution.
4. Urgent concern alert dispatch.
5. AI Pattern Finder & Learning Loop functions.

### Manual Verification Commands
```bash
# Test Feedback Submission
curl -X POST "http://localhost:8000/activities/<ACTIVITY_ID>/feedback" \
  -H "Authorization: Bearer <VOLUNTEER_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"overallRating":5, "comments":"Great event!", "language":"en"}'

# Download CSV Report
curl -X GET "http://localhost:8000/feedback/export" \
  -H "Authorization: Bearer <ADMIN_OR_SPOC_JWT_TOKEN>"

# Fetch AI Recommendations
curl -X GET "http://localhost:8000/ai-insights" \
  -H "Authorization: Bearer <ADMIN_OR_SPOC_JWT_TOKEN>"
```

---

## 🚀 Environment Variables & Local Run Instructions

### `.env` File Setup
```ini
PORT=8000
MONGODB_URI=mongodb://tiwarirubi93_db_user:0fmOzN5U5sL0TnX8@ac-fmh2xaf-shard-00-00.k6cblgu.mongodb.net:27017,ac-fmh2xaf-shard-00-01.k6cblgu.mongodb.net:27017,ac-fmh2xaf-shard-00-02.k6cblgu.mongodb.net:27017/tiwarirubi93_db_user?ssl=true&authSource=admin&retryWrites=true&w=majority
DB_NAME=tiwarirubi93_db_user
ACCESS_TOKEN_SECRET=11bce097163ea8162f6f81e1d97f3ba554c74b1e7023d9ec90c88b3e2b7658d517f4d86144bc013615ecbf285ffdef8351d1848c922bd40fc2282b010c1dd1c8
ACCESS_TOKEN_EXPIRY=1d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@sevasahayog.org
SMTP_PASS=samplepassword
ADMIN_ALERT_EMAIL=admin@sevasahayog.org
```

### Running Locally
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```
