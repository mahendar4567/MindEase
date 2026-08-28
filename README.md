# 🧠 MindEase – Student Personal Pattern Intelligence Platform

**MindEase** is an advanced, student-focused, privacy-first wellness pattern intelligence platform. It tracks daily mood, stress, energy, sleep quality, academic triggers, and helpful actions to calculate personalized baseline trends without diagnosing or comparing users against others.

---

## ✨ Features

- 🔒 **Privacy-First Architecture**: User-created hashed PIN lock screen (`bcryptjs`), instant privacy blur screen, and HTTP-Only cookie security.
- ⚡ **Personal Baseline Intelligence**: Analyzes 14+ days of personal historical data to detect routine shifts (`mean ± 1 std dev`).
- 🎯 **11 Advanced Analytical Modules**:
  - **Small Wins Tracker**: Log daily achievements (`Completed a task`, `Exercise`, `Took a break`, etc.).
  - **Personal Stability Score**: Categorizes user rhythm as `Stable`, `Moderately Variable`, or `Highly Variable`.
  - **Pressure Combination Detector**: Multi-trigger pairing analysis (`Exams + Career`, `Exams + Sleep`).
  - **Pressure Recovery Time**: Measures stress return time after major academic events.
  - **Stress Chain Explorer**: Visual sequence flow discovery (`Poor Sleep → Low Energy → Stress`).
  - **Emotion-Behavior Mismatch Detector**: Detects positive mood alongside high stress or poor sleep.
  - **Semester Wellness Timeline**: Overlay academic deadlines and project milestones.
  - **Emotional Pattern Replay**: Step-by-step interactive chronological day replay.
  - **Pattern-Based Pressure Forecast**: Historical pressure projections near upcoming events.
  - **Wellness Battery & Recovery Trend**: Transparent 0–100 wellness score.
  - **Data Transparency Center**: Full ownership with single-click **JSON Data Export**, selective category data deletion, and account deletion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Lucide Icons
- **Charts**: Recharts & Custom SVG Gauges
- **State & Context**: React Context (AuthContext & ThemeContext)

### Backend
- **Server**: Node.js & Express.js
- **Database**: MongoDB with Mongoose (with automated In-Memory fallback)
- **Security**: JWT (`httpOnly` cookies), `bcryptjs` PIN hashing, CORS, Helmet

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📄 License
MIT License
