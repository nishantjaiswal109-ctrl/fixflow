# FixFlow — AI-Powered Smart Campus Issue Reporting & Resolution Platform
> *"Report It. Track It. Fix It."*

FixFlow is an intelligent campus maintenance and issue-resolution platform engineered to modernize facilities management across educational institutions. FixFlow connects students, campus facility administrators, and maintenance contractors through a single digital platform.

The core differentiator is its **AI/NLP Duplicate Detection Engine**, which automatically identifies and groups multiple reports describing the same physical fault using Scikit-Learn TF-IDF vectorization and cosine similarity, preventing redundant technician dispatches.

---

## 🚀 Live Demo Quick Access

| User Persona | Email | Password | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Alex Chen** | `student@campus.edu` | `student123` | **Student:** Submit issues, view personal dashboard & tracking timeline. |
| **Priya Sharma** | `priya@campus.edu` | `student123` | **Student:** Submitted duplicate ceiling fan report for testing NLP correlation. |
| **Dr. Robert Vance**| `admin@campus.edu` | `admin123` | **Administrator:** Triage dashboard, review duplicate suggestions, assign crews. |

*Tip for Hackathon Judges: Use the **"Judge Demo Switch"** button in the top navigation bar to switch between student and administrator roles with a single click!*

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework:** React 19 + TypeScript (Vite 8 build tool)
- **Styling:** Tailwind CSS v4 + Responsive Flexbox/Grid
- **Icons:** Lucide React
- **Analytics & Data Viz:** Recharts (Bar, Pie, Layout charts)
- **Delight Effects:** Canvas Confetti

### **Backend**
- **API Framework:** Python 3.15 + FastAPI (High-performance async REST endpoints)
- **Database:** SQLite 3 + SQLAlchemy 2.0 ORM (Schema structured for seamless PostgreSQL migration)
- **Authentication:** Role-Based Access Control (RBAC), PBKDF2-HMAC-SHA256 password hashing with unique random salts, PyJWT bearer token authorization.
- **File Storage:** Local static file mount with MIME verification (JPG/PNG/WEBP) and 5MB size enforcement.

### **AI / Machine Learning Engine**
- **Library:** Python `scikit-learn` & `numpy`
- **Methodology:** TF-IDF (Term Frequency–Inverse Document Frequency) Vectorization combined with sublinear term frequency scaling and pairwise Cosine Similarity calculation.
- **Composite Scoring:**
  $$\text{Composite Score} = 0.60 \times S_{\text{text}} + 0.20 \times \text{CategoryMatch} + 0.20 \times \text{LocationMatch}$$
  *(With automatic boost if pure text correlation exceeds 70%)*
- **Explainable Priority Scoring:** Rule-based algorithm factoring reported severity, corroboration counts, urgent active hazard flags, and unresolved aging SLA timers.

---

## 🧠 How the AI/NLP Duplicate Engine Works

1. **Text Extraction & Normalization:**
   When a student submits a complaint, the engine combines the title and description, performs domain-specific synonym normalization (e.g. mapping `"lab"` $\to$ `"laboratory"`, `"broken"` / `"stopped working"` $\to$ `"not working"`, `"toilet"` $\to$ `"restroom"`), and strips non-alphanumeric noise.

2. **Vector Space Construction:**
   The new complaint is appended to the corpus of existing unresolved campus issues. A `TfidfVectorizer` (with 1-2 n-grams and English stopword elimination) transforms the corpus into a sparse numerical TF-IDF feature matrix.

3. **Cosine Similarity Calculation:**
   The engine computes the angular cosine similarity between the incoming document vector and all existing vectors:
   $$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$

4. **Multi-Factor Correlation:**
   The algorithm cross-references the facility category, campus building name, and classroom/room identifier.

5. **Human-in-the-Loop Review:**
   Crucially, **FixFlow never automatically merges or closes tickets on an AI prediction alone**. Possible duplicates exceeding the similarity threshold are queued in the **Administrative Review Center** where facilities directors can inspect side-by-side text comparisons and click **"Confirm Duplicate"** or **"Reject / Distinct Fault"**.

---

## 🏃 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 1. Backend Setup & Startup
```powershell
# Navigate to the backend directory
cd "C:\Users\nishant jaiswal\.gemini\antigravity\scratch\fixflow\backend"

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Run the FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000
```
*The database (`fixflow.db`) is automatically initialized and seeded with demonstration records on first startup.*
*Health Check: `http://127.0.0.1:8000/api/health`*

### 2. Frontend Setup & Startup
```powershell
# In a separate terminal, navigate to the frontend directory
cd "C:\Users\nishant jaiswal\.gemini\antigravity\scratch\fixflow\frontend"

# Start the Vite development server
npm run dev
```
*Open your browser at `http://127.0.0.1:5173/`.*

---

## 📋 Hackathon Demonstration Walkthrough (5-Minute Script)

1. **Landing Page:** Show the hero headline, feature cards, and the real-world duplicate example card comparing *"Fan is not working in Room 204"* vs *"The ceiling fan in classroom 204 has stopped working"*.
2. **Student Experience:**
   - Click **"Judge Demo Switch"** $\to$ select **Alex Chen (Student)**.
   - Show personal dashboard KPI cards (Total Submitted, Pending, In Progress, Resolved).
   - Click **"Report a Problem"**. Submit a new issue in *Science Block, Room 204* with title: *"Ceiling fan in room 204 has completely burned out"*.
   - Watch the instant confirmation screen with celebratory confetti and the **AI Duplicate Detection Flag** displaying an 80%+ match against the existing room 204 fan ticket!
3. **Administrative Triage:**
   - Click **"Judge Demo Switch"** $\to$ select **Dr. Robert Vance (Administrator)**.
   - Review live interactive Recharts: Category Distribution, Building Hotspots, and Unresolved Issue Aging histogram.
   - Click **"AI Duplicates"** in the top navigation bar.
   - Inspect the side-by-side comparison of the newly flagged fan report against the prior report. Click **"Confirm Duplicate"**.
4. **Issue Lifecycle Tracking:**
   - Go to **"All Reports"**, find the issue, and open **"Detail"**.
   - Show the 6-Step Visual Stepper: `Submitted` $\to$ `Under Review` $\to$ `Assigned` $\to$ `In Progress` $\to$ `Resolved` $\to$ `Closed`.
   - Update the status to `In Progress` and assign the `Electrical Maintenance Crew`.
   - Show the live timestamped activity audit history recording the transition and notes.
5. **Project Overview:**
   - Click **"Project Overview"** in the navbar to showcase the 13 justification sections, competitive advantage matrix, system architecture flow, and monetization strategy.

---

## 🧪 Integration Verification Results

The automated end-to-end test suite (`test_verification.py`) executed all 14 mandatory hackathon scenarios with **100% pass rate**:
- ✅ 1. API Health & Engine Check
- ✅ 2. Student Authentication
- ✅ 3. Admin Authentication
- ✅ 4. Student Registration
- ✅ 5. Invalid Form Rejected by Backend Validation
- ✅ 6. Report Submission & Unique ID Generation
- ✅ 7. NLP Duplicate Detection Active (TF-IDF & Cosine Similarity)
- ✅ 8. Explainable Priority Calculation & Reasons Breakdown
- ✅ 9. Admin Status Transition & Team Assignment
- ✅ 10. Student Lifecycle Visibility & Timestamped Audit Trail
- ✅ 11. Role-Based Access Control (Students blocked from admin endpoints)
- ✅ 12. Admin Duplicate Review & Confirmation
- ✅ 13. Advanced Multi-Criteria Search & Filtering
- ✅ 14. Live Dashboard Aggregation & MTTR Analytics

---

## 📜 Key Quote
> *"FixFlow is not just a platform for reporting problems; it is a smarter way to make campuses more responsive, accountable and efficient."*

