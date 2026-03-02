from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.crud import screen as crud_screen
import string

# -------------------- SHOW OPERATIONS --------------------


def get_show(db: Session, show_id: int):
    return db.query(models.Show).filter(models.Show.show_id == show_id).first()


def get_shows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Show).offset(skip).limit(limit).all()


def create_show(db: Session, show: schemas.ShowCreate):
    # 1. Fetch screen details to inherit rows and cols
    screen = db.query(models.Screen).filter(models.Screen.screen_id == show.screen_id).first()
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")

    # 2. Create Show using Screen's dimensions
    db_show = models.Show(
        movie_id=show.movie_id,
        screen_id=show.screen_id,
        show_time=show.show_time,
        seat_price=show.seat_price,
        rows=screen.rows, # Inherited from Screen
        cols=screen.cols  # Inherited from Screen
    )
    db.add(db_show)
    db.commit()
    db.refresh(db_show)

    # 3. Seat Auto-Generation (logic remains the same using db_show.rows/cols)
    seats_to_insert = []
    # ... (rest of the existing seat generation logic)
    return db_show

def update_show(db: Session, show_id: int, show_update: schemas.ShowUpdate):
    db_show = get_show(db, show_id)
    if not db_show:
        return None
    update_data = show_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_show, key, value)
    db.commit()
    db.refresh(db_show)
    return db_show


def get_shows_by_screen(db: Session, screen_id: int):
    return (
        db.query(models.Show)
        .filter(models.Show.screen_id == screen_id)
        .order_by(models.Show.show_time.asc())
        .all()
    )


def delete_show(db: Session, show_id: int):
    db_show = get_show(db, show_id)
    if db_show:
        db.delete(db_show)
        db.commit()
    return db_show


# -------------------- SEAT FETCHING --------------------


def get_seats_for_show(db: Session, show_id: int):
    return db.query(models.Seat).filter(models.Seat.show_id == show_id).all()
