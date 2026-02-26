# Installation & Setup Guide

This guide walks you through setting up the Backend (FastAPI + PostgreSQL) and Frontend (React + Vite).

---

# Step 1: Backend – Virtual Environment & Dependencies

We use a Python virtual environment to isolate and manage backend dependencies.

## 1. Navigate to the Backend Directory

```bash
cd backend
```

## 2. Create a Virtual Environment

```bash
python -m venv venv
```

## 3. Activate the Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

Your terminal prompt should now display `(venv)` at the beginning.

## 4. Install Required Dependencies

```bash
pip install -r requirements.txt
```

---

# Step 2: Configure Environment & Initialize Database

We use an automated script to provision the PostgreSQL database and apply constraints.

## 1. Create Environment File

Inside the `backend/` directory, create a file named:

```
.env
```

## 2. Add PostgreSQL Credentials

Add the following to `backend/.env`:

```env
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookmyshow
```

## 3. Navigate to Root Directory

Ensure your virtual environment is still active.

```bash
cd ..
```

## 4. Initialize Database & Tables

```bash
python init_db.py
```

---

# Step 3: Start the Backend Server (FastAPI)

## 1. Navigate to Backend Directory

```bash
cd backend
```

## 2. Start the Development Server

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://127.0.0.1:8000
```

Test the health endpoint:

```
http://127.0.0.1:8000/health
```

---

# Step 4: Start the Frontend (React + Vite)

Open a new terminal window and keep the backend running.

## 1. Navigate to Frontend Directory

```bash
cd frontend
```

## 2. Install Node Dependencies

```bash
npm install
```

## 3. Start the Development Server

```bash
npm run dev
```

Frontend will typically be available at:

```
http://localhost:5173
```

---

# Setup Complete

Your application should now be running:

* Backend: `http://127.0.0.1:8000`
* Frontend: `http://localhost:5173`

You are ready to develop and test the application.
