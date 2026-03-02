from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app import schemas
from app.crud import movie as crud_movie
from app.crud import show as crud_show
from app.database import get_db

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.post("/", response_model=schemas.MovieResponse, status_code=201)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return crud_movie.create_movie(db=db, movie=movie)


@router.get("/", response_model=List[schemas.MovieResponse])
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_movie.get_movies(db, skip=skip, limit=limit)


@router.get("/now-playing", response_model=List[schemas.MovieResponse])
def get_now_playing_movies(db: Session = Depends(get_db)):
    return crud_movie.get_now_playing(db)


@router.get("/search", response_model=List[schemas.MovieResponse])
def search_movies(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return crud_movie.search_movies(db, query=q)


@router.get("/{movie_id}", response_model=schemas.MovieResponse)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud_movie.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@router.get("/{movie_id}/shows", response_model=List[schemas.ShowDetailResponse])
def get_movie_shows(
    movie_id: int, target_date: date, city: str, db: Session = Depends(get_db)
):
    return crud_show.get_shows_for_movie_by_date_and_city(
        db, movie_id=movie_id, target_date=target_date, city=city
    )


@router.put("/{movie_id}", response_model=schemas.MovieResponse)
def update_movie(
    movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)
):
    updated_movie = crud_movie.update_movie(
        db=db, movie_id=movie_id, movie_update=movie
    )
    if updated_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return updated_movie


@router.delete("/{movie_id}", status_code=204)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud_movie.delete_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return None
