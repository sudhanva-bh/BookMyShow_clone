from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from datetime import datetime, timedelta
from app import models, schemas


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
        db.query(models.Seat)
        .filter(models.Seat.seat_id.in_(booking.seat_ids))
        .with_for_update()
        .all()
    )

    if len(seats) != len(booking.seat_ids):
        raise HTTPException(status_code=404, detail="One or more seats not found")

    for seat in seats:
        if (
            seat.status != models.SeatStatusEnum.UNBOOKED
            or seat.show_id != booking.show_id
        ):
            raise HTTPException(
                status_code=400, detail=f"Seat {seat.seat_number} is not available"
            )

    total_amount = len(seats) * float(show.seat_price)

    db_booking = models.Booking(
        user_id=booking.user_id,
        show_id=booking.show_id,
        total_amount=total_amount,
        status=models.BookingStatusEnum.Pending,
    )
    db.add(db_booking)
    db.flush()

    for seat in seats:
        seat.status = models.SeatStatusEnum.PROCESSING
        seat.booking_id = db_booking.booking_id

    db_payment = models.Payment(
        booking_id=db_booking.booking_id,
        amount=total_amount,
        status=models.PaymentStatusEnum.Pending,
        expires_at=current_time + timedelta(seconds=120),
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_booking)

    return db_booking


def get_user_bookings(db: Session, user_id: int):
    return (
        db.query(models.Booking)
        .options(
            joinedload(models.Booking.show).joinedload(models.Show.movie),
            joinedload(models.Booking.show)
            .joinedload(models.Show.screen)
            .joinedload(models.Screen.theatre),
            joinedload(models.Booking.seats),
        )
        .filter(models.Booking.user_id == user_id)
        .order_by(models.Booking.booking_time.desc())
        .all()
    )
