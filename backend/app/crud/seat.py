from sqlalchemy.orm import Session
from app import models, schemas

def get_seats_by_screen(db: Session, screen_id: int):
    return db.query(models.Seat).filter(models.Seat.screen_id == screen_id).all()

def create_seat(db: Session, seat: schemas.SeatCreate, screen_id: int):
    db_seat = models.Seat(
        screen_id=screen_id,
        seat_number=seat.seat_number,
        seat_type=seat.seat_type
    )
    db.add(db_seat)
    db.commit()
    db.refresh(db_seat)
    return db_seat

def delete_seat(db: Session, screen_id: int, seat_number: str):
    db_seat = db.query(models.Seat).filter(
        models.Seat.screen_id == screen_id, 
        models.Seat.seat_number == seat_number
    ).first()
    if db_seat:
        db.delete(db_seat)
        db.commit()
    return db_seat