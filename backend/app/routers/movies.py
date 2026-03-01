# backend/app/routers/movies.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import movie as crud_movie
from app.database import get_db

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.post("/", response_model=schemas.MovieResponse, status_code=201)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return crud_movie.create_movie(db=db, movie=movie)

@router.get("/", response_model=List[schemas.MovieResponse])
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_movie.get_movies(db, skip=skip, limit=limit)

@router.get("/{movie_id}", response_model=schemas.MovieResponse)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud_movie.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@router.put("/{movie_id}", response_model=schemas.MovieResponse)
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    updated_movie = crud_movie.update_movie(db=db, movie_id=movie_id, movie_update=movie)
    if updated_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return updated_movie

@router.delete("/{movie_id}", status_code=204)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud_movie.delete_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return None