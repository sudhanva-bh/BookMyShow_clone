from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import seat as crud_seat
from app.database import get_db

router = APIRouter(prefix="/seats", tags=["Seats"])

@router.post("/{screen_id}", response_model=schemas.SeatResponse, status_code=201)
def create_seat(screen_id: int, seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    return crud_seat.create_seat(db=db, seat=seat, screen_id=screen_id)

@router.get("/screen/{screen_id}", response_model=List[schemas.SeatResponse])
def read_seats_by_screen(screen_id: int, db: Session = Depends(get_db)):
    return crud_seat.get_seats_by_screen(db, screen_id=screen_id)

@router.delete("/{screen_id}/{seat_number}", status_code=204)
def delete_seat(screen_id: int, seat_number: str, db: Session = Depends(get_db)):
    db_seat = crud_seat.delete_seat(db, screen_id=screen_id, seat_number=seat_number)
    if db_seat is None:
        raise HTTPException(status_code=404, detail="Seat not found")
    return None