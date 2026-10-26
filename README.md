# 🎓 Sreenandha Feedback Admin Panel
> **ICT Academy of Kerala — Certified Specialist in Full Stack Development Final Assessment**

A complete, full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application designed for course administrators to collect, view, search, update, and manage student course evaluation feedback with real-time database persistence.

---

## 📑 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation Guide (Windows PowerShell)](#step-by-step-installation-guide-windows-powershell)
- [MongoDB Atlas Configuration (Cloud Database)](#mongodb-atlas-configuration-cloud-database)
- [Environment Variables Setup](#environment-variables-setup)
- [Running the Application](#running-the-application)
- [REST API Documentation](#rest-api-documentation)
- [Manual API Testing with PowerShell](#manual-api-testing-with-powershell)
- [Pushing to GitHub](#pushing-to-github)
- [Troubleshooting & Common FAQs](#troubleshooting--common-faqs)

---

## 🌟 Project Overview

The **Sreenandha Feedback Admin Panel** enables ICT Academy of Kerala administrators to efficiently track feedback on various technical training courses. Each entry records the **Course ID** (automatically generated), **Course Name**, **Course Duration**, **Overall Feedback Rating** (1 to 5 stars), and detailed **Feedback Comments**.

The system is split into two clean, decoupled directories:
- `backend/`: RESTful Express API backed by MongoDB Atlas using Mongoose with full CRUD operations and validation.
- `frontend/`: Fast, reactive Single Page Application (SPA) built with Vite, React 18, React Router DOM, and Bootstrap 5.

---

## ✨ Key Features

1. **Responsive Admin Dashboard**:
   - Live summary metrics (Total Feedback Count, Average Star Rating, System Status).
   - Real-time search filter by Course Name, Course ID, or Duration.
   - Clean tabular display featuring Course ID badges, duration tags, and interactive star ratings.
   - Smooth loading spinner indicators and empty-state placeholders.
2. **Client-Side SPA Routing**:
   - Instant page navigation without full-page reloads using `react-router-dom`.
3. **Automatic Course ID Generation**:
   - Course IDs (e.g. `CRS-4821`) are auto-generated when a new course evaluation is created.
4. **Interactive Create & Update**:
   - Form for submitting feedback with instant field validation.
   - Update workflow: pre-populates existing course data into the form and updates the record in MongoDB.
5. **Secure Deletion with Confirmation**:
   - Modal prompt confirms item removal before deleting from the database to prevent accidental data loss.
6. **Robust Error & CORS Handling**:
   - Detailed server status codes (`200`, `201`, `400`, `404`, `500`) and friendly JSON error responses.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Lightning-fast HMR and build bundling |
| **Routing** | React Router DOM v6 | Declarative client-side routing |
| **Styling** | Bootstrap 5 + Bootstrap Icons | Mobile-responsive design + custom typography |
| **Backend** | Node.js + Express.js | ES Modules (`"type": "module"`), RESTful routing |
| **Database** | MongoDB Atlas / Mongoose | Schema modeling, hooks, and cloud storage |
| **Config** | Dotenv & CORS | Secure environment variables & cross-origin support |

---

## 📂 Project Directory Structure

```text
Sreenandha-Feedback-Admin/
├── backend/
│   ├── models/
│   │   └── Feedback.js          # Mongoose schema with auto Course ID hook
│   ├── routes/
│   │   └── feedbackRoutes.js    # CRUD route handlers (GET, POST, PUT, DELETE)
│   ├── .env                     # Local environment file (DO NOT commit secrets)
│   ├── .env.example             # Safe template for environment variables
│   ├── package.json             # Backend dependencies and scripts
│   └── server.js                # Express app configuration & MongoDB connection
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Responsive header with NavLinks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Metrics cards, search bar & feedback table
│   │   │   └── AddFeedback.jsx  # Dual-mode form (Create and Update)
│   │   ├── App.jsx              # Main routing configuration
│   │   ├── index.css            # Custom modern CSS styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # Vite HTML template with Google Fonts
│   ├── package.json             # Frontend dependencies and Vite scripts
│   └── vite.config.js           # Vite config with API proxy
├── .gitignore                   # Excludes node_modules, build, and .env files
└── README.md                    # Project documentation
```

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed on your Windows machine:
1. **Node.js** (v18.0.0 or higher): [Download Node.js](https://nodejs.org/)
2. **Git**: [Download Git](https://git-scm.com/)
3. **VS Code** (recommended editor): [Download VS Code](https://code.visualstudio.com/)
4. A free **MongoDB Atlas** account: [Sign up for MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

> **Windows PowerShell Execution Policy Note:**  
> If PowerShell gives an error such as `File npm.ps1 cannot be loaded because running scripts is disabled`, run either:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
> Or invoke `npm.cmd` directly instead of `npm`.

---

## 🚀 Step-by-Step Installation Guide (Windows PowerShell)

Open **Windows PowerShell** or the integrated terminal inside VS Code:

### 1. Open the project root directory
```powershell
cd "C:\Users\sree\Desktop\Sreenandha-Feedback-Admin"
```

### 2. Install Backend Dependencies
```powershell
cd backend
npm.cmd install
cd ..
```

### 3. Install Frontend Dependencies
```powershell
cd frontend
npm.cmd install
cd ..
```

---

## ☁️ MongoDB Atlas Configuration (Cloud Database)

To connect this application to a real MongoDB Atlas cloud database:

1. Log into your [MongoDB Atlas](https://cloud.mongodb.com) account.
2. Click **Build a Database** and select the **M0 Free Tier** cluster.
3. Under **Security Quickstart**:
   - **Username & Password**: Create a database user (e.g., `sreenandha_admin` and a strong password).
   - **IP Access List**: Click **Add Current IP Address** or add `0.0.0.0/0` (Allow Access from Anywhere) so your local app can connect.
4. Go to **Clusters** → Click **Connect** → Choose **Drivers** (Node.js).
5. Copy your connection string. It looks like:
   ```text
   mongodb+srv://sreenandha_admin:<password>@cluster0.abcde.mongodb.net/sreenandha_feedback?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual database user password.

---

## ⚙️ Environment Variables Setup

In `backend/.env`, configure your port and connection string:

```ini
PORT=5000
MONGO_URI=mongodb+srv://sreenandha_admin:<password>@cluster0.abcde.mongodb.net/sreenandha_feedback?retryWrites=true&w=majority
```

*(If testing offline with a local MongoDB instance, keep `MONGO_URI=mongodb://127.0.0.1:27017/sreenandha_feedback`)*

> 🔒 **Security Notice:** The `.env` file is excluded in `.gitignore` to prevent database credentials from ever being leaked to GitHub.

---

## 🏃 Running the Application

For the best development experience, run the backend and frontend in **two separate terminal tabs** in VS Code:

### Terminal 1: Start Backend Server
```powershell
cd backend
npm.cmd run dev
```
*Output will display:*
```text
Connecting to MongoDB...
 Successfully connected to MongoDB Database
 Sreenandha Feedback Admin Backend running on http://localhost:5000
 Feedback API Base Endpoint: http://localhost:5000/api/feedback
```

### Terminal 2: Start Frontend Application
```powershell
cd frontend
npm.cmd run dev
```
*Output will display:*
```text
  VITE v5.2.8  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **`http://localhost:5173/`**.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api/feedback`

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/feedback` | List all feedback entries | None | `200 OK` |
| `GET` | `/api/feedback/:id` | Get single feedback by MongoDB `_id` | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/feedback` | Create a new course feedback | JSON `{ courseName, courseDuration, feedbackComments, feedbackRating }` | `201 Created` |
| `PUT` | `/api/feedback/:id` | Update an existing feedback | JSON `{ courseName, courseDuration, feedbackComments, feedbackRating }` | `200 OK` / `404 Not Found` |
| `DELETE`| `/api/feedback/:id` | Remove a feedback entry | None | `200 OK` / `404 Not Found` |

### Sample JSON Request Body (POST / PUT)
```json
{
  "courseName": "Full Stack Web Development - MERN",
  "courseDuration": "6 Months",
  "feedbackComments": "Comprehensive training with real-world hands-on projects and supportive mentors.",
  "feedbackRating": 5
}
```

### Sample JSON Response (201 Created)
```json
{
  "success": true,
  "message": "Feedback created successfully",
  "data": {
    "_id": "671cb1a4b92d6e32d568c091",
    "courseId": "CRS-4821",
    "courseName": "Full Stack Web Development - MERN",
    "courseDuration": "6 Months",
    "feedbackComments": "Comprehensive training with real-world hands-on projects and supportive mentors.",
    "feedbackRating": 5,
    "createdAt": "2026-10-26T10:00:00.000Z",
    "updatedAt": "2026-10-26T10:00:00.000Z"
  }
}
```

---

## 🧪 Manual API Testing with PowerShell

You can test every endpoint directly using Windows PowerShell:

### 1. Test API Health / Welcome Route
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
```

### 2. Create a Feedback Entry (POST)
```powershell
$body = @{
    courseName = "Full Stack Web Development - MERN"
    courseDuration = "6 Months"
    feedbackComments = "Outstanding hands-on sessions on React and Node.js."
    feedbackRating = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/feedback" -Method Post -Body $body -ContentType "application/json"
```

### 3. Retrieve All Feedback Entries (GET)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/feedback" -Method Get
```

### 4. Update a Feedback Entry (PUT)
Replace `<FEEDBACK_ID>` with an actual `_id` from step 3:
```powershell
$updateBody = @{
    feedbackComments = "Updated: Outstanding hands-on sessions and excellent final assessment guidance!"
    feedbackRating = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/feedback/<FEEDBACK_ID>" -Method Put -Body $updateBody -ContentType "application/json"
```

### 5. Delete a Feedback Entry (DELETE)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/feedback/<FEEDBACK_ID>" -Method Delete
```

---

## 🐙 Pushing to GitHub

To submit your project for the ICT Academy assessment, push the entire repository to GitHub:

### 1. Initialize Git in the Project Root
```powershell
cd "C:\Users\sree\Desktop\Sreenandha-Feedback-Admin"
git init
```

### 2. Check Git Status (Verify `.env` and `node_modules` are ignored)
```powershell
git status
```

### 3. Stage and Commit Files
```powershell
git add .
git commit -m "feat: complete Sreenandha Feedback Admin Panel for ICT Academy assessment"
```

### 4. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name the repository: `Sreenandha-Feedback-Admin`.
3. Choose **Public**.
4. Leave "Add a README" **unchecked** (we already have a complete one).
5. Click **Create repository**.

### 5. Link Remote and Push
Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username:
```powershell
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/Sreenandha-Feedback-Admin.git
git push -u origin main
```

---

## ❓ Troubleshooting & Common FAQs

- **Q: PowerShell blocks script execution (`npm : File npm.ps1 cannot be loaded`)**  
  **A**: Use `npm.cmd` instead of `npm`, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in PowerShell as Administrator.

- **Q: Backend shows `MongoDB Connection Error: bad auth : Authentication failed`**  
  **A**: Check your MongoDB Atlas database username and password in `backend/.env`. Ensure special characters in passwords are URL-encoded if necessary.

- **Q: Backend shows `MongooseServerSelectionError: connection timed out`**  
  **A**: In MongoDB Atlas, go to **Network Access** → **IP Access List** and click **Add IP Address** → **Allow Access from Anywhere (`0.0.0.0/0`)**.

- **Q: Can the React app work if the backend is on a different port?**  
  **A**: Yes! CORS is enabled on the backend (`cors()`) and Vite is configured with a proxy in `frontend/vite.config.js`.

---

**Submitted by:** Sreenandha  
**Institution:** ICT Academy of Kerala  
**Course:** Certified Specialist in Full Stack Development  
