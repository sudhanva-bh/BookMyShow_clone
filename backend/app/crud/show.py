from sqlalchemy.orm import Session
from app import models, schemas
import string

# -------------------- SHOW OPERATIONS --------------------


def get_show(db: Session, show_id: int):
    return db.query(models.Show).filter(models.Show.show_id == show_id).first()


def get_shows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Show).offset(skip).limit(limit).all()


def create_show(db: Session, show: schemas.ShowCreate):
    db_show = models.Show(
        movie_id=show.movie_id,
        screen_id=show.screen_id,
        show_time=show.show_time,
        seat_price=show.seat_price,
    )
    db.add(db_show)
    db.commit()
    db.refresh(db_show)

    # Seat Auto-Generation
    seats_to_insert = []
    letters = string.ascii_uppercase

    for r in range(show.rows):
        # Handle rows going beyond Z (e.g., AA, AB)
        row_letter = letters[r % 26]
        if r >= 26:
            row_letter = letters[(r // 26) - 1] + row_letter

        for c in range(1, show.cols + 1):
            seat_num = f"{row_letter}{c:02d}"
            db_seat = models.Seat(
                status="UNBOOKED",
                show_id=db_show.show_id,
                screen_id=db_show.screen_id,
                seat_number=seat_num,
            )
            seats_to_insert.append(db_seat)

    if seats_to_insert:
        db.bulk_save_objects(seats_to_insert)
        db.commit()

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

def delete_show(db: Session, show_id: int):
    db_show = get_show(db, show_id)
    if db_show:
        db.delete(db_show)
        db.commit()
    return db_show


# -------------------- SEAT FETCHING --------------------


def get_seats_for_show(db: Session, show_id: int):
    return db.query(models.Seat).filter(models.Seat.show_id == show_id).all()
