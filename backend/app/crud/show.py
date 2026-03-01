# backend/app/crud/show.py
from sqlalchemy.orm import Session
from app import models, schemas

def get_show(db: Session, show_id: int):
    return db.query(models.Show).filter(models.Show.show_id == show_id).first()

def get_shows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Show).offset(skip).limit(limit).all()

def create_show(db: Session, show: schemas.ShowCreate):
    db_show = models.Show(
        movie_id=show.movie_id,
        screen_id=show.screen_id,
        show_time=show.show_time,
        base_price=show.base_price
    )
    db.add(db_show)
    db.commit()
    db.refresh(db_show)
    return db_show

def delete_show(db: Session, show_id: int):
    db_show = get_show(db, show_id)
    if db_show:
        db.delete(db_show)
        db.commit()
    return db_show