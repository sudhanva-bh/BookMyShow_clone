from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app import models

# -------------------- PAYMENT OPERATIONS --------------------

def process_payment(db: Session, payment_id: int, success: bool):
    payment = db.query(models.Payment).filter(models.Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != 'Pending':
        raise HTTPException(status_code=400, detail="Payment is already processed")

    booking = db.query(models.Booking).filter(models.Booking.booking_id == payment.booking_id).first()
    seats = db.query(models.Seat).filter(models.Seat.booking_id == booking.booking_id).all()

    current_time = datetime.now()
    is_expired = current_time > payment.expires_at

    if success and not is_expired:
        payment.status = 'Success'
        booking.status = 'Booked'
        for seat in seats:
            seat.status = 'BOOKED'
    else:
        payment.status = 'Failed'
        booking.status = 'Cancelled'
        for seat in seats:
            seat.status = 'UNBOOKED'
            seat.booking_id = None  # Free up the seat

    db.commit()
    db.refresh(payment)
    return payment