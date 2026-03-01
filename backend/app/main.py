from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

from app.routers import (
    users,
    theatres,
    screens,
    movies,
    seats,
    show,
    bookings,
    payments,
)

app = FastAPI(
    title="BookMyShow Clone API",
    description="Backend API for the Database Management System Academic Project",
    version="1.0.0",
)

app.include_router(users.router)
app.include_router(theatres.router)
app.include_router(screens.router)
app.include_router(movies.router)
app.include_router(seats.router)
app.include_router(show.router)
app.include_router(bookings.router)  # New
app.include_router(payments.router)  # New


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the BookMyShow Clone API"}


@app.get("/health", tags=["Diagnostics"])
def health_check(db: Session = Depends(get_db)):
    """
    Checks if the API is running AND if the database is actively connected.
    """
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API and Database are communicating successfully.",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )
