from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email, phone=user.phone)
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user) # Fetches the new ID and created_at timestamp
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email or phone already registered")

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user