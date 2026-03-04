from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app import models


def process_payment(db: Session, payment_id: int, success: bool):
    # Lock the payment row to prevent processing it twice concurrently
    payment = (
        db.query(models.Payment)
        .filter(models.Payment.payment_id == payment_id)
        .with_for_update()
        .first()
    )

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != models.PaymentStatusEnum.Pending:
        raise HTTPException(status_code=400, detail="Payment is already processed")

    booking = (
        db.query(models.Booking)
        .filter(models.Booking.booking_id == payment.booking_id)
        .first()
    )
    seats = (
        db.query(models.Seat).filter(models.Seat.booking_id == booking.booking_id).all()
    )

    current_time = datetime.now()
    is_expired = current_time > payment.expires_at

    if success and not is_expired:
        payment.status = models.PaymentStatusEnum.Success
        booking.status = models.BookingStatusEnum.Booked
        for seat in seats:
            seat.status = models.SeatStatusEnum.BOOKED
    else:
        payment.status = models.PaymentStatusEnum.Failed
        booking.status = models.BookingStatusEnum.Cancelled
        for seat in seats:
            seat.status = models.SeatStatusEnum.UNBOOKED
            seat.booking_id = None  # Free up the seat

    db.commit()
    db.refresh(payment)
    return payment
