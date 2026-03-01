from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import payment as crud_payment
from app.database import get_db

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/{payment_id}/confirm", response_model=schemas.PaymentResponse)
def confirm_payment(payment_id: int, success: bool, db: Session = Depends(get_db)):
    return crud_payment.process_payment(db=db, payment_id=payment_id, success=success)