from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import admin as crud_admin
from app.database import get_db

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])


@router.get("/stats/revenue/{movie_id}", response_model=schemas.RevenueStatsResponse)
def get_revenue(movie_id: int, db: Session = Depends(get_db)):
    """Retrieve revenue statistics for a specific movie."""
    stats = crud_admin.get_revenue_by_movie(db, movie_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Movie not found")
    return stats


@router.get("/stats/occupancy", response_model=List[schemas.OccupancyStatsResponse])
def get_occupancy(db: Session = Depends(get_db)):
    """Retrieve occupancy statistics across all shows."""
    return crud_admin.get_all_shows_occupancy(db)