# backend/app/routers/shows.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import show as crud_show
from app.database import get_db

router = APIRouter(prefix="/shows", tags=["Shows"])

@router.post("/", response_model=schemas.ShowResponse, status_code=201)
def create_show(show: schemas.ShowCreate, db: Session = Depends(get_db)):
    return crud_show.create_show(db=db, show=show)

@router.get("/", response_model=List[schemas.ShowResponse])
def read_shows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_show.get_shows(db, skip=skip, limit=limit)

@router.get("/{show_id}", response_model=schemas.ShowResponse)
def read_show(show_id: int, db: Session = Depends(get_db)):
    db_show = crud_show.get_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return db_show

@router.delete("/{show_id}", status_code=204)
def delete_show(show_id: int, db: Session = Depends(get_db)):
    db_show = crud_show.delete_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return None