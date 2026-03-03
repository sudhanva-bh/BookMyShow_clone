from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import show as crud_show
from app.database import get_db
from datetime import date

router = APIRouter(prefix="/shows", tags=["Shows"])

@router.post("/", response_model=schemas.ShowResponse, status_code=201)
def create_show(show: schemas.ShowCreate, db: Session = Depends(get_db)):
    """Create a new show schedule."""
    return crud_show.create_show(db=db, show=show)

@router.get("/", response_model=List[schemas.ShowResponse])
def read_shows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve a paginated list of all shows."""
    return crud_show.get_shows(db, skip=skip, limit=limit)

@router.get("/{show_id}", response_model=schemas.ShowResponse)
def read_show(show_id: int, db: Session = Depends(get_db)):
    """Retrieve details of a specific show by its ID."""
    db_show = crud_show.get_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return db_show

@router.put("/{show_id}", response_model=schemas.ShowResponse)
def update_show(show_id: int, show: schemas.ShowUpdate, db: Session = Depends(get_db)):
    """Update an existing show."""
    updated_show = crud_show.update_show(db=db, show_id=show_id, show_update=show)
    if updated_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return updated_show

@router.get("/screen/{screen_id}", response_model=List[schemas.ShowResponse])
def read_shows_by_screen(screen_id: int, db: Session = Depends(get_db)):
    """Retrieve all shows scheduled for a specific screen."""
    from app.crud import screen as crud_screen

    db_screen = crud_screen.get_screen(db, screen_id=screen_id)
    if db_screen is None:
        raise HTTPException(status_code=404, detail="Screen not found")
    return crud_show.get_shows_by_screen(db, screen_id=screen_id)

@router.get("/city-schedule", response_model=List[schemas.ShowDetailResponse])
def read_city_schedule(city: str, target_date: date, db: Session = Depends(get_db)):
    """Retrieve all shows in a specific city for a given date."""
    return crud_show.get_city_shows_by_date(db, city=city, target_date=target_date)

@router.get("/movies-by-city", response_model=List[schemas.MovieResponse])
def read_movies_by_city(city: str, db: Session = Depends(get_db)):
    """Retrieve all movies currently playing in a specific city."""
    return crud_show.get_movies_by_city(db, city=city)

@router.get("/city-schedule-all", response_model=List[schemas.ShowDetailResponse])
def read_all_city_schedule(city: str, db: Session = Depends(get_db)):
    """Retrieve the complete show schedule for a specific city."""
    return crud_show.get_all_city_shows(db, city=city)

@router.get("/movies-by-date", response_model=List[schemas.MovieResponse])
def read_movies_by_date(city: str, target_date: date, db: Session = Depends(get_db)):
    """Retrieve movies playing in a specific city on a given date."""
    return crud_show.get_movies_by_date(db, city=city, target_date=target_date)

@router.delete("/{show_id}", status_code=204)
def delete_show(show_id: int, db: Session = Depends(get_db)):
    """Delete a scheduled show."""
    db_show = crud_show.delete_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return None

@router.get("/{show_id}/seats", response_model=List[schemas.SeatResponse])
def read_show_seats(show_id: int, db: Session = Depends(get_db)):
    """Retrieve the seating arrangement and availability for a specific show."""
    db_show = crud_show.get_show(db, show_id=show_id)
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return crud_show.get_seats_for_show(db, show_id=show_id)

@router.get("/{show_id}/seatmap-stats", response_model=schemas.SeatMapStatsResponse)
def read_seatmap_stats(show_id: int, db: Session = Depends(get_db)):
    """Retrieve seat booking statistics (booked vs available) for a show."""
    stats = crud_show.get_seatmap_stats(db, show_id=show_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="Show not found")
    return stats