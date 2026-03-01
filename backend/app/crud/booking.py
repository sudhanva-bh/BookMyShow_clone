from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
from app import models, schemas

# -------------------- BOOKING OPERATIONS --------------------


def create_booking(db: Session, booking: schemas.BookingCreate):
    show = db.query(models.Show).filter(models.Show.show_id == booking.show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")

    current_time = datetime.now()
    if show.show_time <= current_time + timedelta(minutes=20):
        raise HTTPException(
            status_code=400,
            detail="Cannot book tickets for a show starting in less than 20 minutes",
        )

    seats = (
        db.query(models.Seat).filter(models.Seat.seat_id.in_(booking.seat_ids)).all()
    )
    if len(seats) != len(booking.seat_ids):
        raise HTTPException(status_code=404, detail="One or more seats not found")

    for seat in seats:
        if seat.status != "UNBOOKED" or seat.show_id != booking.show_id:
            raise HTTPException(
                status_code=400, detail=f"Seat {seat.seat_number} is not available"
            )

    total_amount = len(seats) * float(show.seat_price)

    db_booking = models.Booking(
        user_id=booking.user_id,
        show_id=booking.show_id,
        total_amount=total_amount,
        status="Pending",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    # Lock Seats for Processing
    for seat in seats:
        seat.status = "PROCESSING"
        seat.booking_id = db_booking.booking_id

    # Initialize Payment with 120s Expiry
    db_payment = models.Payment(
        booking_id=db_booking.booking_id,
        amount=total_amount,
        status="Pending",
        expires_at=current_time + timedelta(seconds=120),
    )
    db.add(db_payment)
    db.commit()

    return db_booking
