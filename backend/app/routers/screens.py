from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import screen as crud_screen
from app.database import get_db

router = APIRouter(prefix="/screens", tags=["Screens"])


@router.post("/{theatre_id}", response_model=schemas.ScreenResponse, status_code=201)
def create_screen(
    theatre_id: int, screen: schemas.ScreenCreate, db: Session = Depends(get_db)
):
    """Add a new screen to a specific theatre."""
    return crud_screen.create_screen(db=db, screen=screen, theatre_id=theatre_id)


@router.get("/", response_model=List[schemas.ScreenResponse])
def read_screens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve a paginated list of all screens."""
    return crud_screen.get_screens(db, skip=skip, limit=limit)


@router.get("/{screen_id}", response_model=schemas.ScreenResponse)
def read_screen(screen_id: int, db: Session = Depends(get_db)):
    """Retrieve details of a specific screen by its ID."""
    db_screen = crud_screen.get_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return db_screen


@router.put("/{screen_id}", response_model=schemas.ScreenResponse)
def update_screen(
    screen_id: int, screen: schemas.ScreenUpdate, db: Session = Depends(get_db)
):
    """Update details of an existing screen."""
    updated_screen = crud_screen.update_screen(
        db=db, screen_id=screen_id, screen_update=screen
    )
    if updated_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return updated_screen


@router.delete("/{screen_id}", status_code=204)
def delete_screen(screen_id: int, db: Session = Depends(get_db)):
    """Delete a screen from the database."""
    db_screen = crud_screen.delete_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return None
