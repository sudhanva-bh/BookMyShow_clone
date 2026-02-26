from pydantic import BaseModel, EmailStr
from datetime import date, datetime

# Shared properties
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

# Properties required to create a user (Frontend sends this)
class UserCreate(UserBase):
    pass

# Properties returned from the API (Backend sends this)
class UserResponse(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Tells Pydantic to read data from SQLAlchemy models

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

<<<<<<< HEAD
class ScreenBase(BaseModel):
    screen_name: str
    total_capacity: int

class ScreenCreate(ScreenBase):
    pass

class ScreenResponse(ScreenBase):
    screen_id: int
    theatre_id: int
=======
class MovieBase(BaseModel):
    title: str
    language: str
    duration_mins: int
    release_date: date  # You will need: from datetime import date, datetime
    certificate: str

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    movie_id: int
>>>>>>> cc837318862347699f27153ee02b26bfbda28d96

    class Config:
        from_attributes = True