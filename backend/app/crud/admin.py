from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app import models


def get_revenue_by_movie(db: Session, movie_id: int):
    movie = db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()
    if not movie:
        return None

    total_revenue = (
        db.query(func.sum(models.Booking.total_amount))
        .join(models.Show, models.Booking.show_id == models.Show.show_id)
        .filter(
            models.Show.movie_id == movie_id,
            models.Booking.status == models.BookingStatusEnum.Booked,
        )
        .scalar()
    )

    return {
        "movie_id": movie.movie_id,
        "movie_title": movie.title,
        "total_revenue": total_revenue or 0.0,
    }


def get_all_shows_occupancy(db: Session):
    shows = (
        db.query(models.Show)
        .options(
            joinedload(models.Show.movie),
            joinedload(models.Show.screen).joinedload(models.Screen.theatre),
        )
        .all()
    )

    occupancy_stats = []
    for show in shows:
        seats = (
            db.query(models.Seat.status, func.count(models.Seat.seat_id))
            .filter(models.Seat.show_id == show.show_id)
            .group_by(models.Seat.status)
            .all()
        )

        total_seats = 0
        booked_seats = 0
        for status, count in seats:
            total_seats += count
            if status == models.SeatStatusEnum.BOOKED:
                booked_seats += count

        occupancy_pct = (booked_seats / total_seats * 100) if total_seats > 0 else 0.0

        occupancy_stats.append(
            {
                "show_id": show.show_id,
                "movie_title": show.movie.title,
                "theatre_name": show.screen.theatre.name,
                "show_time": show.show_time,
                "total_seats": total_seats,
                "booked_seats": booked_seats,
                "occupancy_percentage": round(occupancy_pct, 2),
            }
        )

    return occupancy_stats
