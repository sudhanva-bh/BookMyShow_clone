import asyncio
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime

from app.database import get_db, SessionLocal
from app import models
from app.routers import (
    users,
    theatres,
    screens,
    movies,
    show,
    bookings,
    payments,
    admin,
)

app = FastAPI(
    title="BookMyShow Clone API",
    description="Backend API for the Database Management System Academic Project",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(theatres.router)
app.include_router(screens.router)
app.include_router(movies.router)
app.include_router(show.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(admin.router)


def clean_expired_seats():
    db = SessionLocal()
    try:
        now = datetime.now()
        expired_payments = (
            db.query(models.Payment)
            .filter(
                models.Payment.status == models.PaymentStatusEnum.Pending,
                models.Payment.expires_at < now,
            )
            .all()
        )

        for payment in expired_payments:
            payment.status = models.PaymentStatusEnum.Failed
            booking = (
                db.query(models.Booking)
                .filter(models.Booking.booking_id == payment.booking_id)
                .first()
            )
            if booking:
                booking.status = models.BookingStatusEnum.Cancelled
                seats = (
                    db.query(models.Seat)
                    .filter(models.Seat.booking_id == booking.booking_id)
                    .all()
                )
                for seat in seats:
                    seat.status = models.SeatStatusEnum.UNBOOKED
                    seat.booking_id = None
        db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()


async def seat_cleanup_job():
    while True:
        await asyncio.to_thread(clean_expired_seats)
        await asyncio.sleep(60)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(seat_cleanup_job())


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the BookMyShow Clone API"}


@app.get("/health", tags=["Diagnostics"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API and Database are communicating successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )
