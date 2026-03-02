from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas


def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.movie_id == movie_id).first()


def get_movies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Movie).offset(skip).limit(limit).all()


def get_now_playing(db: Session):
    now = datetime.now()
    return (
        db.query(models.Movie)
        .join(models.Show)
        .filter(models.Show.show_time > now)
        .distinct()
        .all()
    )


def search_movies(db: Session, query: str):
    return db.query(models.Movie).filter(models.Movie.title.ilike(f"%{query}%")).all()


def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(
        title=movie.title,
        language=movie.language,
        duration_mins=movie.duration_mins,
        release_date=movie.release_date,
        certificate=movie.certificate,
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def update_movie(db: Session, movie_id: int, movie_update: schemas.MovieUpdate):
    db_movie = get_movie(db, movie_id)
    if not db_movie:
        return None
    update_data = movie_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def delete_movie(db: Session, movie_id: int):
    db_movie = get_movie(db, movie_id)
    if db_movie:
        db.delete(db_movie)
        db.commit()
    return db_movie
