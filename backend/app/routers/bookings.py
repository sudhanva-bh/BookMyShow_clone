from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import booking as crud_booking
from app.database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=schemas.BookingResponse, status_code=201)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    return crud_booking.create_booking(db=db, booking=booking)