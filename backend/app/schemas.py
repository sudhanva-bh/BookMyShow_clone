from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List
from app.models import SeatStatusEnum, BookingStatusEnum, PaymentStatusEnum


# USER & THEATRE & SCREEN & MOVIE
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


class ScreenBase(BaseModel):
    screen_name: str
    rows: int
    cols: int


class ScreenCreate(ScreenBase):
    pass


class ScreenResponse(ScreenBase):
    screen_id: int
    theatre_id: int

    class Config:
        from_attributes = True


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


# SHOWS & SEATS
class ShowBase(BaseModel):
    movie_id: int
    screen_id: int
    show_time: datetime
    seat_price: float


class ShowCreate(ShowBase):
    pass


class ShowResponse(ShowBase):
    show_id: int

    class Config:
        from_attributes = True


class SeatBase(BaseModel):
    show_id: int
    screen_id: int
    seat_number: str
    status: SeatStatusEnum
    booking_id: Optional[int] = None


class SeatResponse(SeatBase):
    seat_id: int

    class Config:
        from_attributes = True


# BOOKINGS & PAYMENTS
class BookingBase(BaseModel):
    user_id: int
    show_id: int
    total_amount: float
    status: BookingStatusEnum


class BookingCreate(BaseModel):
    user_id: int
    show_id: int
    seat_ids: List[int]


class BookingResponse(BookingBase):
    booking_id: int
    booking_time: datetime

    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    status: PaymentStatusEnum


class PaymentResponse(PaymentBase):
    payment_id: int
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class TheatreUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None

class ScreenUpdate(BaseModel):
    screen_name: Optional[str] = None
    total_capacity: Optional[int] = None

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    language: Optional[str] = None
    duration_mins: Optional[int] = None
    release_date: Optional[date] = None
    certificate: Optional[str] = None

class ShowUpdate(BaseModel):
    movie_id: Optional[int] = None
    screen_id: Optional[int] = None
    show_time: Optional[datetime] = None
    seat_price: Optional[float] = None
