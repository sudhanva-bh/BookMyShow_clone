# BookMyShow Database Project

# Installation & Setup Guide

This guide walks you through setting up the Backend (FastAPI + PostgreSQL), Frontend (React + Vite), and running SQL queries directly.

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
python init_db.py
```

---

# Step 3: Running SQL Queries Directly (Using psql)

Navigate to the project root directory first.

```bash
psql -U postgres
```

Inside `psql`:

```sql
\c bookmyshow
```

Then run the following files using `\i`.

---

## Users

```sql
\i database/presentation_queries/users/01_create.sql
\i database/presentation_queries/users/02_read.sql
\i database/presentation_queries/users/03_update.sql
\i database/presentation_queries/users/04_delete.sql
```

---

## Movies

```sql
\i database/presentation_queries/movies/01_create.sql
\i database/presentation_queries/movies/02_read.sql
\i database/presentation_queries/movies/03_update.sql
\i database/presentation_queries/movies/04_delete.sql
```

---

## Theatres

```sql
\i database/presentation_queries/theatres/01_create.sql
\i database/presentation_queries/theatres/02_read.sql
\i database/presentation_queries/theatres/03_update.sql
\i database/presentation_queries/theatres/04_delete.sql
```

---

## Screens

```sql
\i database/presentation_queries/screen/01_create.sql
\i database/presentation_queries/screen/02_read.sql
\i database/presentation_queries/screen/03_update.sql
\i database/presentation_queries/screen/04_delete.sql
```

---

## Seats

```sql
\i database/presentation_queries/seats/01_create.sql
\i database/presentation_queries/seats/02_read.sql
\i database/presentation_queries/seats/03_update.sql
\i database/presentation_queries/seats/04_delete.sql
```

---

## Shows

```sql
\i database/presentation_queries/show/01_create.sql
\i database/presentation_queries/show/02_read.sql
\i database/presentation_queries/show/03_update.sql
\i database/presentation_queries/show/04_delete.sql
\i database/presentation_queries/show/05_get_seats.sql
```

---

## Bookings

```sql
\i database/presentation_queries/bookings/01_create_booking_transaction.sql
\i database/presentation_queries/bookings/02_read_user_bookings.sql
```

---

## Payments

```sql
\i database/presentation_queries/payments/01_process_payment_success.sql
\i database/presentation_queries/payments/02_process_payment_failure.sql
```

---

## Jobs

```sql
\i database/presentation_queries/jobs/01_cleanup_expired_seats.sql
```

---

# Step 4: Start the Backend Server (FastAPI)

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

# Step 5: Start the Frontend (React + Vite)

Open a new terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Setup Complete

Backend: `http://127.0.0.1:8000`
Frontend: `http://localhost:5173`

Project ready to use.
