import enum
from sqlalchemy import Column, Integer, Numeric, String, DateTime, Text, UniqueConstraint, ForeignKey, text, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base

# ENUMS
class SeatStatusEnum(str, enum.Enum):
    UNBOOKED = 'UNBOOKED'
    PROCESSING = 'PROCESSING'
    BOOKED = 'BOOKED'

class BookingStatusEnum(str, enum.Enum):
    Pending = 'Pending'
    Booked = 'Booked'
    Cancelled = 'Cancelled'

class PaymentStatusEnum(str, enum.Enum):
    Pending = 'Pending'
    Success = 'Success'
    Failed = 'Failed'

# USER & THEATRE & SCREEN & MOVIE
class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    bookings = relationship("Booking", back_populates="user")

class Theatre(Base):
    __tablename__ = "theatre"
    theatre_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    __table_args__ = (UniqueConstraint("name", "city", name="uq_theatre_name_city"),)

    screens = relationship("Screen", back_populates="theatre", cascade="all, delete-orphan")

class Screen(Base):
    __tablename__ = "screen"
    screen_id = Column(Integer, primary_key=True, index=True)
    theatre_id = Column(Integer, ForeignKey("theatre.theatre_id", ondelete="CASCADE"), nullable=False)
    screen_name = Column(String(50), nullable=False)
    total_capacity = Column(Integer, nullable=False)
    __table_args__ = (UniqueConstraint("theatre_id", "screen_name", name="uq_screen_theatre_name"),)

    theatre = relationship("Theatre", back_populates="screens")
    shows = relationship("Show", back_populates="screen", cascade="all, delete-orphan")

class Movie(Base):
    __tablename__ = "movie"
    movie_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    language = Column(String(50), nullable=False)
    duration_mins = Column(Integer, nullable=False)
    release_date = Column(Date, nullable=False)
    certificate = Column(String(10))

    shows = relationship("Show", back_populates="movie", cascade="all, delete-orphan")

# SHOWS & BOOKINGS & PAYMENTS & SEATS
class Show(Base):
    __tablename__ = "show"
    show_id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movie.movie_id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), nullable=False)
    show_time = Column(DateTime, nullable=False)
    seat_price = Column(Numeric(10, 2), nullable=False)
    rows = Column(Integer, nullable=False, default=10)
    cols = Column(Integer, nullable=False, default=20)
    
    movie = relationship("Movie", back_populates="shows")
    screen = relationship("Screen", back_populates="shows")
    bookings = relationship("Booking", back_populates="show", cascade="all, delete-orphan")
    seats = relationship("Seat", back_populates="show", cascade="all, delete-orphan")

class Booking(Base):
    __tablename__ = "booking"
    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    show_id = Column(Integer, ForeignKey("show.show_id", ondelete="CASCADE"), nullable=False)
    booking_time = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(SQLEnum(BookingStatusEnum), nullable=False, default=BookingStatusEnum.Pending)

    user = relationship("User", back_populates="bookings")
    show = relationship("Show", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    seats = relationship("Seat", back_populates="booking")

class Payment(Base):
    __tablename__ = "payment"
    payment_id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("booking.booking_id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(SQLEnum(PaymentStatusEnum), nullable=False, default=PaymentStatusEnum.Pending)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    expires_at = Column(DateTime, nullable=False)

    booking = relationship("Booking", back_populates="payments")

class Seat(Base):
    __tablename__ = "seat"
    seat_id = Column(Integer, primary_key=True, index=True)
    status = Column(SQLEnum(SeatStatusEnum), nullable=False, default=SeatStatusEnum.UNBOOKED)
    booking_id = Column(Integer, ForeignKey("booking.booking_id", ondelete="SET NULL"), nullable=True)
    show_id = Column(Integer, ForeignKey("show.show_id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), nullable=False)
    seat_number = Column(String(10), nullable=False)
    __table_args__ = (UniqueConstraint("show_id", "seat_number", name="uq_seat_show_number"),)

    show = relationship("Show", back_populates="seats")
    booking = relationship("Booking", back_populates="seats")
    screen = relationship("Screen")