from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

<<<<<<< HEAD
from app.routers import users, theatres, screens
=======
from app.routers import users, theatres,movies
>>>>>>> cc837318862347699f27153ee02b26bfbda28d96

app = FastAPI(
    title="BookMyShow Clone API",
    description="Backend API for the Database Management System Academic Project",
    version="1.0.0",
)

app.include_router(users.router)
app.include_router(theatres.router)
<<<<<<< HEAD
app.include_router(screens.router)

=======
app.include_router(movies.router)
>>>>>>> cc837318862347699f27153ee02b26bfbda28d96

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the BookMyShow Clone API"}


@app.get("/health", tags=["Diagnostics"])
def health_check(db: Session = Depends(get_db)):
    """
    Checks if the API is running AND if the database is actively connected.
    """
    try:
        # Execute a raw SQL query to verify the connection is alive
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API and Database are communicating successfully.",
        }
    except Exception as e:
        # If the DB is down or credentials are wrong, this will catch it
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )
