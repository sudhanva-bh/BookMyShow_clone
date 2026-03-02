from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app import models, schemas


def get_theatre(db: Session, theatre_id: int):
    return (
        db.query(models.Theatre).filter(models.Theatre.theatre_id == theatre_id).first()
    )


def get_theatres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Theatre).offset(skip).limit(limit).all()


def get_theatres_by_city(db: Session, city: str):
    return db.query(models.Theatre).filter(models.Theatre.city.ilike(city)).all()


def get_movies_by_theatre(db: Session, theatre_id: int):
    return (
        db.query(models.Movie)
        .join(models.Show)
        .join(models.Screen)
        .filter(models.Screen.theatre_id == theatre_id)
        .distinct()
        .all()
    )


def create_theatre(db: Session, theatre: schemas.TheatreCreate):
    db_theatre = models.Theatre(
        name=theatre.name, location=theatre.location, city=theatre.city
    )
    db.add(db_theatre)
    try:
        db.commit()
        db.refresh(db_theatre)
        return db_theatre
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Theatre '{theatre.name}' already exists in '{theatre.city}'",
        )


def update_theatre(db: Session, theatre_id: int, theatre_update: schemas.TheatreUpdate):
    db_theatre = get_theatre(db, theatre_id)
    if not db_theatre:
        return None
    update_data = theatre_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_theatre, key, value)
    db.commit()
    db.refresh(db_theatre)
    return db_theatre


def delete_theatre(db: Session, theatre_id: int):
    db_theatre = get_theatre(db, theatre_id)
    if db_theatre:
        db.delete(db_theatre)
        db.commit()
    return db_theatre
