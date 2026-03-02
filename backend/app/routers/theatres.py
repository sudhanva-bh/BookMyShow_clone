from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import theatre as crud_theatre
from app.database import get_db
from datetime import date
from app.crud import show as crud_show

router = APIRouter(prefix="/theatres", tags=["Theatres"])


@router.get("/cities", response_model=List[str])
def read_all_cities(db: Session = Depends(get_db)):
    return crud_theatre.get_all_cities(db)


@router.post("/", response_model=schemas.TheatreResponse, status_code=201)
def create_theatre(theatre: schemas.TheatreCreate, db: Session = Depends(get_db)):
    return crud_theatre.create_theatre(db=db, theatre=theatre)


@router.get("/", response_model=List[schemas.TheatreResponse])
def read_theatres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_theatre.get_theatres(db, skip=skip, limit=limit)


@router.get("/city/{city_name}", response_model=List[schemas.TheatreResponse])
def read_theatres_by_city(city_name: str, db: Session = Depends(get_db)):
    return crud_theatre.get_theatres_by_city(db, city=city_name)


@router.get("/{theatre_id}/movies", response_model=List[schemas.MovieResponse])
def read_theatre_movies(theatre_id: int, db: Session = Depends(get_db)):
    return crud_theatre.get_movies_by_theatre(db, theatre_id=theatre_id)


@router.get("/{theatre_id}/schedule", response_model=List[schemas.ShowDetailResponse])
def read_theatre_schedule(
    theatre_id: int, target_date: date, db: Session = Depends(get_db)
):
    return crud_show.get_shows_by_theatre_and_date(
        db, theatre_id=theatre_id, target_date=target_date
    )


@router.get("/{theatre_id}", response_model=schemas.TheatreResponse)
def read_theatre(theatre_id: int, db: Session = Depends(get_db)):
    db_theatre = crud_theatre.get_theatre(db, theatre_id=theatre_id)
    if db_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return db_theatre


@router.put("/{theatre_id}", response_model=schemas.TheatreResponse)
def update_theatre(
    theatre_id: int, theatre: schemas.TheatreUpdate, db: Session = Depends(get_db)
):
    updated_theatre = crud_theatre.update_theatre(
        db=db, theatre_id=theatre_id, theatre_update=theatre
    )
    if updated_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return updated_theatre


@router.delete("/{theatre_id}", status_code=204)
def delete_theatre(theatre_id: int, db: Session = Depends(get_db)):
    db_theatre = crud_theatre.delete_theatre(db, theatre_id=theatre_id)
    if db_theatre is None:
        raise HTTPException(status_code=404, detail="Theatre not found")
    return None