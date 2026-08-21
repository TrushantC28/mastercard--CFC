# Implementation Plan — Feedback System Add-ons & Feature Enhancements

Based on the **SevaSahayog Foundation — Volunteer Feedback Collection & Experience Tracking System** requirement document, we have audited our Backend implementation against all **MUST HAVES** (A, B, C, E, F, G, H, I, L) and **GOOD TO HAVES** (D, J, K, M).

This plan covers the implementation of the missing **GOOD TO HAVES** and critical operational add-ons required for stakeholder reporting and real-time alerts.

---

## 🔍 Audit & Status Against Requirement Document

| Section | Requirement Description | Current Status | Required Action |
| :--- | :--- | :--- | :--- |
| **Must Have (A, B, H)** | Activity Configuration & Mapping | ✅ Implemented | None |
| **Must Have (E, F, G)** | Guided Volunteer Feedback & Duplicate Guard | ✅ Implemented | None |
| **Must Have (C)** | Theme Classification & Sentiment Extraction | ✅ Implemented | Enhance with "Urgent Concern" flag |
| **Must Have (I, L)** | Filtered Views & Summaries for Admin & SPOC | ✅ Implemented | None |
| **Good To Have (J, M)** | **Export reports to Excel (.xlsx/CSV) / PDF** | ❌ Missing | **[NEW] Add `GET /feedback/export` endpoint** |
| **Good To Have (D)** | **Multilingual Support & Language Handling** | 🟡 Basic (`language` string field) | **[NEW] Add Auto-Language detection & translation helper** |
| **Business Need** | **Surface Urgent Concerns (Real-time alerting)** | ❌ Missing | **[NEW] Flag ratings $\le 2$ or urgent themes and trigger admin alert** |

---

## 🛠️ Proposed Add-On Changes

### 1. Report Export Service (`GET /feedback/export`) — (Good To Have J & M)
Allows Admins (all companies) and SPOCs (their company only) to download feedback data as a clean CSV/Excel file for internal review and board presentation.

- **Endpoint**: `GET /feedback/export?format=csv` (or `.xlsx`)
- **Filters supported**: Same as `GET /feedback` (`activityId`, `corporatePartnerId`, `dateFrom`, `dateTo`, `minRating`, `themeId`).
- **Output**: Downloads a formatted CSV file with columns:
  `Submitted Date`, `Activity Title`, `Corporate Partner`, `Volunteer Name`, `Overall Rating`, `Organization Rating`, `Impact Rating`, `Comments`, `Suggestions`, `Themes`, `Language`, `Urgent Flag`.

#### [NEW] [feedbackExport.controller.js](file:///c:/Users/bigha/OneDrive/Desktop/mastercard2/mastercard--CFC/backend/src/controllers/feedbackExport.controller.js)
Handles request, checks role scoping (SPOC company lock), formats data into CSV buffer using `json2csv` or native string builder, sets headers `Content-Type: text/csv` and `Content-Disposition: attachment; filename=feedback_report.csv`.

---

### 2. "Urgent Concern" Detection & Real-time Alerting
The problem statement highlights: *"surface urgent concerns... without adding operational burden"*.

- **Logic**:
  - When a feedback document is submitted with an `overallRating <= 2` OR text containing urgent keywords (e.g., *safety, injury, harassment, poor food, emergency, terrible*):
  - Mark `isUrgent: true` in `feedback` document.
  - Trigger `notifyUrgentFeedbackAlert({ adminEmail, activityTitle, volunteerName, rating, comments })` via Nodemailer to alert SevaSahayog admins immediately.

#### [MODIFY] [feedback.model.js](file:///c:/Users/bigha/OneDrive/Desktop/mastercard2/mastercard--CFC/backend/src/models/feedback.model.js)
- Add `isUrgent: { type: Boolean, default: false }` field and index `{ isUrgent: 1 }`.

#### [MODIFY] [classifier.service.js](file:///c:/Users/bigha/OneDrive/Desktop/mastercard2/mastercard--CFC/backend/src/services/classifier.service.js)
- Detect urgent sentiment and update `isUrgent` flag + send notification to admin.

---

### 3. Multilingual Support Enhancement (Good To Have D)
Volunteers come from diverse backgrounds and may submit feedback in regional languages (e.g. Hindi, Marathi, English).

- **Enhancement**:
  - Add language normalization utility in classifier to support multi-language keyword tokens (e.g. Hindi/Marathi common feedback terms like *अच्छा, खराब, समय, अनुभव, सुविधा*).
  - Include language badge in output payload for analytics reporting.

---

## 🧪 Verification Plan

### Automated Tests
- Run `npm test` to verify:
  1. Export generation generates valid CSV structure.
  2. Urgent feedback logic triggers flag on low rating ($\le 2$) or urgent text.
  3. SPOC export is locked to their `corporatePartnerId`.

### Manual Testing Commands
- `curl -X GET "http://localhost:8000/feedback/export?format=csv"` (Admin report download)
- `curl -X GET "http://localhost:8000/feedback/export"` (SPOC report download)

---

## ❓ User Review Required

> [!IMPORTANT]
> Please confirm if you would like me to proceed with implementing these 3 add-ons:
> 1. **`GET /feedback/export`** (CSV/Excel report download for Admin & SPOC).
> 2. **Urgent Concern Alerting** (Low rating / urgent text detection & real-time Admin notification).
> 3. **Enhanced Multilingual Theme Matching** (Hindi & Marathi keyword tokens).
