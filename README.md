
# BookMyShow Database Project

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

## 1. Create Environment File

Inside the `backend/` directory, create:

```
.env
```

## 2. Add PostgreSQL Credentials

```env
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookmyshow
```

## 3. Navigate to Root Directory

```bash
cd ..
```

## 4. Initialize Database & Tables

```bash
python dbsetup/init.py
```

And follow on-screen instructions

---

# Step 3: Start the Backend Server (FastAPI)

```bash
cd backend
uvicorn app.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Health check:

```
http://127.0.0.1:8000/health
```

---

# Step 4: Start the Frontend (React + Vite)

Ensure you have Node.js installed.

## 1. Navigate to the Frontend Directory

```bash
cd frontend
```

## 2. Install Dependencies

Install all necessary packages via npm.

```bash
npm install
```

## 3. Start the Development Server

Run the Vite development server.

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Setup Complete

Backend: `http://localhost:8000`
Frontend: `http://localhost:5173`

Project ready to use.

*Note: To run raw SQL presentation queries directly via psql, please refer to the instructions in `database/presentation_queries/README.md`.*
