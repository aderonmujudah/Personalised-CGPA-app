# Personalised CGPA App & Academic Planner

A mobile-first progressive academic companion tailored for the **Nigerian 5.0 University Grading System**, pre-configured with the **University of Lagos (UNILAG) B.Sc. Systems Engineering Curriculum** and official student transcript records.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Capacitor Android**.

---

## 🚀 Key Features

### 1. ⏪ True "Rollback" Timeline (Non-Destructive What-If Planning)
- **The Core Problem Solved**: On other GPA calculators, adding future planned semesters overwrites your actual CGPA, forcing you to delete them when you want to check your current standing.
- **Rollback Engine**: Drag or tap along the interactive timeline directly beneath your CGPA card to view your exact standing at any past semester milestone (e.g., *100L 1st*, *200L 2nd*, *300L 1st*).
- **Dual Perspective**:
  - **Current CGPA (3.75)**: Computed strictly from verified, completed semesters.
  - **Projected CGPA**: Simulates future graduation outcomes when planned semesters have expected grades.
  - None of your planned future semesters are ever deleted or reset during rollback.

### 2. 📋 Official Transcript Pre-Loaded
- Seeded with verified records from `StudentTranscript Aderonmu Judah.pdf`:
  - **Student**: `Aderonmu, Judah Adetunji` (`210407089`)
  - **Department**: Systems Engineering, Faculty of Engineering, University of Lagos
  - **Completed Semesters**: 100L 1st through 400L 1st semester with exact course codes, credit units, and letter grades.
  - **Current Standing**: **3.75 CGPA** (Second Class Honours, Upper Division).

### 3. 🔁 Discreet, Automated Carryover Management
- **No Stigmatizing Separate Tab**: Carryovers are integrated naturally into course registration lists.
- **Session-to-Session Carryover Rule**:
  - If a course is graded **F (0.0)** in Session $Y$ Semester $S$ (e.g., `CEG 211` failed in 2023/2024 First Semester), it automatically recurs in Session $Y+1$ Semester $S$ (2024/2025 First Semester) with a clean `Carryover from 2023/2024` badge.
  - Once retaken and passed ($\ge$ **E**), it automatically clears and stops recurring in future sessions.

### 4. 📚 Smart Elective Management & Unpicked Rollover
- **Compulsory Auto-Load**: New semesters automatically populate compulsory courses.
- **Student-Controlled Electives**: Electives are never auto-assigned; the student chooses them.
- **Cross-Specialization Freedom**: Students are not restricted to one track and can select electives across:
  - *Artificial Intelligence & Mechatronics*
  - *Engineering Analysis, Mechanics & Control*
  - *Industrial & Management Engineering*
  - *General Engineering*
- **Unpicked Electives Rollover**: Electives not taken in an earlier semester (e.g., 400L First Semester electives like `SSG 431`, `SSG 433`, `SSG 439`) remain eligible to be registered in subsequent corresponding semesters (e.g., 500L First Semester).
- **24 Credit Units Ceiling**: The registration interface enforces the university limit of **24 maximum units** per semester and alerts if an addition exceeds the cap.

### 5. 🎓 Graduation Units Progress Tracker
- Directly mirrors **Section 8a** of the Systems Engineering Curriculum:
  - **Total Required Units to Graduate**: **172 Units**
  - **Compulsory**: 154 Units (89.5%)
  - **Electives**: 18 Units (10.5%)
- Visual progress bar tracks earned units toward graduation (excluding duplicate retake units), displaying completed vs. remaining degree units.

### 6. 🎨 Sky Blue & White UI (Light + Dark Modes)
- **Light Theme**: Clean white surfaces, soft pale-sky background (`#eef4fa`), and a vibrant sky-blue accent (`#0b8ce0`).
- **Dark Theme**: Deep blue-grey canvas (`#0b1016`) with slate surface cards and sky-blue highlights (`#46b3f2`).
- Designed without generic AI gradients; uses native iOS/Android mobile typography, tactile haptic button states, and smooth sheet modals.
- Includes a desktop **Mobile Phone Frame** toggle for authentic mobile viewport simulation during PC testing.

### 7. 💾 Local-First Persistence & Backups
- Automatically persists state in browser `localStorage`.
- **JSON Backup Export/Import**: Download a complete `.json` backup file or restore previously saved data at any time.
- **1-Click Reset**: Instant restoration of the original official transcript dataset.

---

## 🛠️ Project Structure

```
cgpa-app/
├── android/                         # Native Android Studio / Gradle project (Capacitor)
├── src/
│   ├── components/
│   │   ├── HomeView.tsx             # Main dashboard (CGPA card, rollback scrubber, semester list)
│   │   ├── SemesterScreen.tsx       # Course registration, inline grade picker, 24-unit ceiling
│   │   ├── PlanView.tsx             # Target CGPA simulator & units by level
│   │   ├── SettingsView.tsx         # Profile, light/dark mode, backup export/import
│   │   ├── TabBar.tsx               # Bottom navigation (Home, Plan, Settings)
│   │   ├── NewSemesterSheet.tsx     # Add semester modal with auto-filled compulsory courses
│   │   └── ui.tsx                   # Reusable components (PhoneFrame, Sheet, Stepper, Segmented)
│   ├── data/
│   │   └── curriculumData.ts        # Systems Engineering 100L-500L curriculum & Section 8a rules
│   ├── hooks/
│   │   └── useTheme.ts              # System / Light / Dark theme state management
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces (Course, Semester, Grade, Profile)
│   ├── utils/
│   │   ├── cgpaEngine.ts            # Nigerian 5.0 GP engine, rollback logic, carryover normalization
│   │   └── storage.ts               # LocalStorage I/O & transcript initial state
│   ├── App.tsx                      # Root application component
│   ├── index.css                    # Tailwind v4 theme variables (Sky Blue palette)
│   └── main.tsx                     # Application entry point
├── capacitor.config.json            # Capacitor mobile bridge configuration
├── package.json
└── vite.config.ts
```

---

## 💻 Running the App on PC (Live Preview)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Development Server
1. Navigate into the application folder:
   ```powershell
   cd "cgpa-app"
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the Vite local server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📱 Packaging into an Android APK

The project is pre-configured with **Capacitor Android**.

### Build Steps:
1. Build the production web bundle:
   ```powershell
   cd "cgpa-app"
   npm run build
   ```
2. Sync the compiled assets into the native Android project:
   ```powershell
   npx cap sync android
   ```
3. Compile the debug APK using Gradle:
   ```powershell
   cd android
   .\gradlew assembleDebug
   ```
4. The generated `.apk` will be available at:
   ```
   cgpa-app\android\app\build\outputs\apk\debug\app-debug.apk
   ```

You can copy this file directly to your Android device to install and use the app natively.

---

## 📊 Nigerian 5.0 Grading Scale Reference

| Letter Grade | Percentage Range | Grade Points (GP) |
| :---: | :---: | :---: |
| **A** | 70% – 100% | **5.0** |
| **B** | 60% – 69% | **4.0** |
| **C** | 50% – 59% | **3.0** |
| **D** | 45% – 49% | **2.0** |
| **E** | 40% – 44% | **1.0** |
| **F** | 0% – 39% | **0.0** |

### Degree Classifications:
- **4.50 – 5.00**: First Class Honours
- **3.50 – 4.49**: Second Class Honours (Upper Division / 2:1)
- **2.40 – 3.49**: Second Class Honours (Lower Division / 2:2)
- **1.50 – 2.39**: Third Class Honours
- **1.00 – 1.49**: Pass Degree
- **0.00 – 0.99**: Fail / Academic Probation

---

## 📄 License
Personal Academic Project — Designed for Systems Engineering students following the Nigerian university 5.0 scale.
