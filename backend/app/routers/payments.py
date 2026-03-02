from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.crud import payment as crud_payment
from app.database import get_db

router = APIRouter(prefix="/payments", tags=["Payments"])

# NEW ROUTE: This handles the request coming from your React frontend
@router.post("/", response_model=schemas.PaymentResponse)
def handle_frontend_payment(payload: schemas.PaymentBase, db: Session = Depends(get_db)):
    # 1. Find the payment row using the booking_id sent by the frontend
    payment = db.query(models.Payment).filter(models.Payment.booking_id == payload.booking_id).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
        
    # 2. Check if the frontend simulated a 'Success' or 'Failed' status
    success = payload.status == models.PaymentStatusEnum.Success
    
    # 3. Pass it to your existing CRUD logic
    return crud_payment.process_payment(db=db, payment_id=payment.payment_id, success=success)

# Original Route (Kept for testing/Admin purposes)
@router.post("/{payment_id}/confirm", response_model=schemas.PaymentResponse)
def confirm_payment(payment_id: int, success: bool, db: Session = Depends(get_db)):
    return crud_payment.process_payment(db=db, payment_id=payment_id, success=success)