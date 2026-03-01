from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# -------------------- USER --------------------

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------- THEATRE --------------------

class TheatreBase(BaseModel):
    name: str
    location: str
    city: str

class TheatreCreate(TheatreBase):
    pass

class TheatreResponse(TheatreBase):
    theatre_id: int

    class Config:
        from_attributes = True


# -------------------- SCREEN --------------------

class ScreenBase(BaseModel):
    screen_name: str
    total_capacity: int

class ScreenCreate(ScreenBase):
    pass

class ScreenResponse(ScreenBase):
    screen_id: int
    theatre_id: int

    class Config:
        from_attributes = True


# -------------------- MOVIE --------------------

class MovieBase(BaseModel):
    title: str
    language: str
    duration_mins: int
    release_date: date
    certificate: str

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    movie_id: int

    class Config:
        from_attributes = True


#---------------------- SEAT -----------------------

class SeatBase(BaseModel):
    seat_number: str
    seat_type: str

class SeatCreate(SeatBase):
    pass

class SeatResponse(SeatBase):
    screen_id: int
    class Config:
        from_attributes = True