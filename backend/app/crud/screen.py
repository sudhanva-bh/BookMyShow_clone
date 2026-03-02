from sqlalchemy.orm import Session
from app import models, schemas

def get_screen(db: Session, screen_id: int):
    return db.query(models.Screen).filter(models.Screen.screen_id == screen_id).first()

def get_screens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Screen).offset(skip).limit(limit).all()

def create_screen(db: Session, screen: schemas.ScreenCreate, theatre_id: int):
    db_screen = models.Screen(
        screen_name=screen.screen_name,
        rows=screen.rows,
        cols=screen.cols,
        theatre_id=theatre_id
    )
    db.add(db_screen)
    db.commit()
    db.refresh(db_screen)
    return db_screen

def update_screen(db: Session, screen_id: int, screen_update: schemas.ScreenUpdate):
    db_screen = get_screen(db, screen_id)
    if not db_screen:
        return None
    update_data = screen_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_screen, key, value)
    db.commit()
    db.refresh(db_screen)
    return db_screen

def delete_screen(db: Session, screen_id: int):
    db_screen = get_screen(db, screen_id)
    if db_screen:
        db.delete(db_screen)
        db.commit()
    return db_screen