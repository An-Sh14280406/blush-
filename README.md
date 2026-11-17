# blush.
### A little world for Ananya ♡

> *"Your cycle. Your feelings. Your little moments."*

---

## 🌸 Product Overview

**blush.** is an intimate, full-stack menstrual cycle, mood tracking, fertility estimation, and personal wellness application created especially for Ananya.

The visual identity blends:
- **A Romantic Digital Scrapbook**: Pink gingham patterns, satin bows, butterflies, white hearts, layered frames, paper borders, and stickers.
- **A Bold Strawberry-Pink Editorial Magazine**: Dramatic typography (`Cormorant Garamond`), high-contrast compositions, and vibrant strawberry accents (`#F27F9D`, `#F04478`, `#C51F46`, `#FFF4E9`, `#171316`).
- **A Premium Feminine Wellness Sanctuary**: Intuitive cycle rhythm predictions, mood journaling, physical symptom monitoring, energy tracking, and personal wellness insights.

---

## ✨ Key Capabilities

1. **Intelligent Prediction Engine**:
   - Calculates consecutive cycle lengths strictly from confirmed period start dates.
   - Computes statistical average, median, and variation.
   - Calculates next period predicted ranges (earliest, target, latest) and days remaining.
   - Discloses limitations transparently when data is insufficient.
2. **Fertility & Ovulation Estimates with Strict Clinical Transparency**:
   - Calculates estimated ovulation (~14 days before next predicted period) and fertile windows (~6-day window).
   - Features permanent clinical disclaimers: calendar predictions cannot confirm ovulation and are never safe for contraception.
3. **Emotive Mood Journal**:
   - Categories for bright feelings (*Happy, Excited, Calm, Confident, Relaxed, Affectionate, Playful, Flirty, Romantic, Sociable*) and tender feelings (*Sad, Irritated, Anxious, Stressed, Lonely, Overwhelmed, Emotionally sensitive, Low energy*).
   - Intensity ratings (1–5) and personal "Dear Diary" reflections.
4. **Physical Symptoms & Wellness Tracker**:
   - Tracks cramps, headache, bloating, fatigue, acne, back pain, sleep quality, and food cravings.
5. **Rules-Based Personal Insights**:
   - Generates grounded, self-reported pattern reflections with verified observation counts.
   - Safe ethical boundaries: never infers consent, attraction, or hormonal mood stereotypes.
6. **Preloaded Historical Records for Ananya**:
   - **March 2026**: March 7 to March 11 (5 days)
   - **May 2026**: May 10 start (end unknown)
   - **June 2026**: June 10 to June 13 (4 days)
   - **August 2026**: August 9 random confirmed observation (NOT counted as period start)
   - **September 2026**: September 2 to September 6 (5 days)
   - **October 2026**: October 2 start (end unknown)
   - **November 2026**: November 2 to November 6 (5 days)
   - **Consecutive Confirmed Cycles**: Sep to Oct = 30 days, Oct to Nov = 31 days. Average: 30.5 days!
7. **Complete Data Sovereignty**:
   - Full JSON data export for health privacy.
   - Permanent account and data erasure option.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Recharts, Lucide React, date-fns.
- **Backend**: Node.js, Express.js, REST APIs, JSON Web Tokens (JWT), bcryptjs.
- **Database**: MongoDB with Mongoose, plus an embedded persistent fallback engine (`server/data/blush_db.json`) enabling immediate zero-configuration local execution if MongoDB daemon is not currently active.
- **Testing**: Dedicated unit test suite for cycle intervals, August observation handling, and fertility calculations (`npm test`).

---

## 📁 Project Structure

```
blush/
├── client/
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddEditPeriodModal.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── DisclaimerAlert.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ScrapbookCard.jsx
│   │   │   ├── ScrapbookDecorations.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   ├── pages/
│   │   │   ├── CycleInsightsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FertilityCalendarPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MoodHistoryPage.jsx
│   │   │   ├── MoodTrackerPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── OnboardingPage.jsx
│   │   │   ├── PeriodCalendarPage.jsx
│   │   │   ├── PeriodHistoryPage.jsx
│   │   │   ├── PersonalInsightsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SymptomTrackerPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── embeddedStore.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── moodController.js
│   │   ├── notificationController.js
│   │   ├── periodController.js
│   │   ├── symptomController.js
│   │   └── wellnessController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── MoodLog.js
│   │   ├── Notification.js
│   │   ├── Period.js
│   │   ├── SymptomLog.js
│   │   ├── User.js
│   │   ├── WellnessLog.js
│   │   └── modelBridge.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── moodRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── periodRoutes.js
│   │   ├── symptomRoutes.js
│   │   └── wellnessRoutes.js
│   ├── services/
│   │   ├── demoSeedService.js
│   │   ├── insightsService.js
│   │   └── predictionService.js
│   ├── tests/
│   │   └── prediction.test.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+

### 2. Environment Configuration
The server comes pre-configured with default fallbacks. Optionally create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blush
JWT_SECRET=blush_super_secret_jwt_key_2026_ananya
NODE_ENV=development
```

### 3. Running Unit Tests
To run the automated calculation tests:
```bash
cd blush/server
node tests/prediction.test.js
```
*(All 7 unit tests test the September, October, and November intervals, average 30.5d, August non-start handling, and clinical disclaimers).*

### 4. Running the Application Locally

#### Terminal 1 — Start Backend Server:
```bash
cd blush/server
npm start
```
The server will start on `http://localhost:5000`.

#### Terminal 2 — Start Frontend Client:
```bash
cd blush/client
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎀 Quick Demo Access

- **One-Click Demo Button**: Click **"Enter Ananya's Space ♡"** on the landing page or login page to log in directly.
- **Manual Demo Credentials**:
  - **Email**: `ananya@blush.love`
  - **Password**: `blushpassword123`

---

*Made with love for Ananya ♡*
