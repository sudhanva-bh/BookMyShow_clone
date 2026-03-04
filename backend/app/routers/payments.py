from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.crud import payment as crud_payment
from app.database import get_db

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/", response_model=schemas.PaymentResponse)
def handle_frontend_payment(
    payload: schemas.PaymentBase, db: Session = Depends(get_db)
):
    """Process a payment status update originating from the frontend."""
    payment = (
        db.query(models.Payment)
        .filter(models.Payment.booking_id == payload.booking_id)
        .first()
    )

    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    success = payload.status == models.PaymentStatusEnum.Success
    return crud_payment.process_payment(
        db=db, payment_id=payment.payment_id, success=success
    )


@router.post("/{payment_id}/confirm", response_model=schemas.PaymentResponse)
def confirm_payment(payment_id: int, success: bool, db: Session = Depends(get_db)):
    """Directly confirm or fail a payment by its ID (Admin/Testing)."""
    return crud_payment.process_payment(db=db, payment_id=payment_id, success=success)
