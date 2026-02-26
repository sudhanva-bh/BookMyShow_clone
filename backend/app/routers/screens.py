from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import screen as crud_screen
from app.database import get_db

router = APIRouter(prefix="/screens", tags=["Screens"])

@router.post("/{theatre_id}", response_model=schemas.ScreenResponse, status_code=201)
def create_screen(theatre_id: int, screen: schemas.ScreenCreate, db: Session = Depends(get_db)):
    return crud_screen.create_screen(db=db, screen=screen, theatre_id=theatre_id)

@router.get("/", response_model=List[schemas.ScreenResponse])
def read_screens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_screen.get_screens(db, skip=skip, limit=limit)

@router.get("/{screen_id}", response_model=schemas.ScreenResponse)
def read_screen(screen_id: int, db: Session = Depends(get_db)):
    db_screen = crud_screen.get_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return db_screen

@router.delete("/{screen_id}", status_code=204)
def delete_screen(screen_id: int, db: Session = Depends(get_db)):
    db_screen = crud_screen.delete_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return None