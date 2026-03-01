from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import theatre as crud_theatre
from app.database import get_db

router = APIRouter(prefix="/theatres", tags=["Theatres"])

@router.post("/", response_model=schemas.TheatreResponse, status_code=201)
def create_theatre(theatre: schemas.TheatreCreate, db: Session = Depends(get_db)):
    return crud_theatre.create_theatre(db=db, theatre=theatre)

@router.get("/", response_model=List[schemas.TheatreResponse])
def read_theatres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_theatre.get_theatres(db, skip=skip, limit=limit)

@router.get("/{theatre_id}", response_model=schemas.TheatreResponse)
def read_theatre(theatre_id: int, db: Session = Depends(get_db)):
    db_theatre = crud_theatre.get_theatre(db, theatre_id=theatre_id)
    if db_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return db_theatre

@router.put("/{theatre_id}", response_model=schemas.TheatreResponse)
def update_theatre(theatre_id: int, theatre: schemas.TheatreUpdate, db: Session = Depends(get_db)):
    updated_theatre = crud_theatre.update_theatre(db=db, theatre_id=theatre_id, theatre_update=theatre)
    if updated_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return updated_theatre

@router.delete("/{theatre_id}", status_code=204)
def delete_theatre(theatre_id: int, db: Session = Depends(get_db)):
    db_theatre = crud_theatre.delete_theatre(db, theatre_id=theatre_id)
    if db_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return None