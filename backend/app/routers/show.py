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


@router.put("/{show_id}", response_model=schemas.ShowResponse)
def update_show(show_id: int, show: schemas.ShowUpdate, db: Session = Depends(get_db)):
    updated_show = crud_show.update_show(db=db, show_id=show_id, show_update=show)
    if updated_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return updated_show


@router.get("/screen/{screen_id}", response_model=List[schemas.ShowResponse])
def read_shows_by_screen(screen_id: int, db: Session = Depends(get_db)):
    # Check if the screen exists first (optional but recommended)
    from app.crud import screen as crud_screen

    db_screen = crud_screen.get_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")

    return crud_show.get_shows_by_screen(db, screen_id=screen_id)


@router.delete("/{show_id}", status_code=204)
def delete_show(show_id: int, db: Session = Depends(get_db)):
    db_show = crud_show.delete_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return None


@router.get("/{show_id}/seats", response_model=List[schemas.SeatResponse])
def read_show_seats(show_id: int, db: Session = Depends(get_db)):
    db_show = crud_show.get_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return crud_show.get_seats_for_show(db, show_id=show_id)
