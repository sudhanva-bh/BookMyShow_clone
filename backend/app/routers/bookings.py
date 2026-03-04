from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import booking as crud_booking
from app.database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=schemas.BookingResponse, status_code=201)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    """Create a new booking."""
    return crud_booking.create_booking(db=db, booking=booking)


@router.get("/user/{user_id}", response_model=List[schemas.BookingDetailResponse])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all bookings for a specific user."""
    bookings = crud_booking.get_user_bookings(db=db, user_id=user_id)
    return bookings
