from pydantic import BaseModel, EmailStr
from datetime import datetime

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