from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, cast, Date
from app import models, schemas
import string
from datetime import date

# -------------------- SHOW OPERATIONS --------------------


def get_show(db: Session, show_id: int):
    return (
        db.query(models.Show)
        .options(joinedload(models.Show.movie))
        .filter(models.Show.show_id == show_id)
        .first()
    )


def get_shows(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Show)
        .options(joinedload(models.Show.movie))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_show(db: Session, show: schemas.ShowCreate):
    screen = (
        db.query(models.Screen)
        .filter(models.Screen.screen_id == show.screen_id)
        .first()
    )
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")

    db_show = models.Show(
        movie_id=show.movie_id,
        screen_id=show.screen_id,
        show_time=show.show_time,
        seat_price=show.seat_price,
        rows=screen.rows,
        cols=screen.cols,
    )
    db.add(db_show)
    db.commit()
    db.refresh(db_show)

    # Seat Auto-Generation
    seats_to_insert = []
    for r in range(db_show.rows):
        row_letter = string.ascii_uppercase[r] if r < 26 else f"Z{r}"
        for c in range(1, db_show.cols + 1):
            seat_number = f"{row_letter}{c}"
            seats_to_insert.append(
                models.Seat(
                    show_id=db_show.show_id,
                    screen_id=db_show.screen_id,
                    seat_number=seat_number,
                    status=models.SeatStatusEnum.UNBOOKED,
                )
            )
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


def get_shows_by_screen(db: Session, screen_id: int):
    # FIX: Added joinedload for movie details
    return (
        db.query(models.Show)
        .options(joinedload(models.Show.movie))
        .filter(models.Show.screen_id == screen_id)
        .order_by(models.Show.show_time.asc())
        .all()
    )


def get_shows_by_theatre_and_date(db: Session, theatre_id: int, target_date: date):
    return (
        db.query(models.Show)
        .options(joinedload(models.Show.movie), joinedload(models.Show.screen))
        .join(models.Screen)
        .filter(
            models.Screen.theatre_id == theatre_id,
            cast(models.Show.show_time, Date) == target_date,
        )
        .order_by(models.Show.show_time.asc())
        .all()
    )


def get_city_shows_by_date(db: Session, city: str, target_date: date):
    return (
        db.query(models.Show)
        .options(
            joinedload(models.Show.movie),
            joinedload(models.Show.screen).joinedload(models.Screen.theatre),
        )
        .join(models.Screen)
        .join(models.Theatre)
        .filter(
            models.Theatre.city.ilike(city),
            cast(models.Show.show_time, Date) == target_date,
        )
        .order_by(models.Show.show_time.asc())
        .all()
    )


def get_movies_by_date(db: Session, city: str, target_date: date):
    return (
        db.query(models.Movie)
        .join(models.Show)
        .join(models.Screen)
        .join(models.Theatre)
        .filter(
            models.Theatre.city.ilike(city),
            cast(models.Show.show_time, Date) == target_date,
        )
        .distinct()
        .all()
    )


def get_movies_by_city(db: Session, city: str):
    return (
        db.query(models.Movie)
        .join(models.Show)
        .join(models.Screen)
        .join(models.Theatre)
        .filter(models.Theatre.city.ilike(city))
        .distinct()
        .all()
    )


def get_all_city_shows(db: Session, city: str):
    return (
        db.query(models.Show)
        .options(
            joinedload(models.Show.movie),
            joinedload(models.Show.screen).joinedload(models.Screen.theatre),
        )
        .join(models.Screen)
        .join(models.Theatre)
        .filter(models.Theatre.city.ilike(city))
        .order_by(models.Show.show_time.asc())
        .all()
    )


def get_shows_for_movie_by_date_and_city(
    db: Session, movie_id: int, target_date: str, city: str
):
    return (
        db.query(models.Show)
        .options(
            joinedload(models.Show.movie),
            joinedload(models.Show.screen).joinedload(models.Screen.theatre),
        )
        .join(models.Screen)
        .join(models.Theatre)
        .filter(
            models.Show.movie_id == movie_id,
            cast(models.Show.show_time, Date) == target_date,
            models.Theatre.city.ilike(city),
        )
        .order_by(models.Show.show_time.asc())
        .all()
    )


def delete_show(db: Session, show_id: int):
    db_show = get_show(db, show_id)
    if db_show:
        db.delete(db_show)
        db.commit()
    return db_show


# -------------------- SEAT FETCHING & STATS --------------------


def get_seats_for_show(db: Session, show_id: int):
    return db.query(models.Seat).filter(models.Seat.show_id == show_id).all()


def get_seatmap_stats(db: Session, show_id: int):
    show = db.query(models.Show).filter(models.Show.show_id == show_id).first()
    if not show:
        return None

    seats = (
        db.query(models.Seat.status, func.count(models.Seat.seat_id))
        .filter(models.Seat.show_id == show_id)
        .group_by(models.Seat.status)
        .all()
    )

    stats = {
        models.SeatStatusEnum.UNBOOKED: 0,
        models.SeatStatusEnum.BOOKED: 0,
        models.SeatStatusEnum.PROCESSING: 0,
    }

    for status, count in seats:
        stats[status] = count

    return {
        "show_id": show_id,
        "total_seats": sum(stats.values()),
        "available_seats": stats[models.SeatStatusEnum.UNBOOKED],
        "booked_seats": stats[models.SeatStatusEnum.BOOKED],
        "processing_seats": stats[models.SeatStatusEnum.PROCESSING],
        "seat_price": float(show.seat_price),
    }
