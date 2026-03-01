from sqlalchemy import Column, Integer, Numeric, String, DateTime, Text, UniqueConstraint, ForeignKey, text, Date
from app.database import Base

# USER & THEATRE & SCREEN & MOVIE
class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

class Theatre(Base):
    __tablename__ = "theatre"
    theatre_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    __table_args__ = (UniqueConstraint("name", "city", name="uq_theatre_name_city"),)

class Screen(Base):
    __tablename__ = "screen"
    screen_id = Column(Integer, primary_key=True, index=True)
    theatre_id = Column(Integer, ForeignKey("theatre.theatre_id", ondelete="CASCADE"), nullable=False)
    screen_name = Column(String(50), nullable=False)
    total_capacity = Column(Integer, nullable=False)
    __table_args__ = (UniqueConstraint("theatre_id", "screen_name", name="uq_screen_theatre_name"),)

class Movie(Base):
    __tablename__ = "movie"
    movie_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    language = Column(String(50), nullable=False)
    duration_mins = Column(Integer, nullable=False)
    release_date = Column(Date, nullable=False)
    certificate = Column(String(10))

# SHOWS & BOOKINGS & PAYMENTS & SEATS
class Show(Base):
    __tablename__ = "show"
    show_id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movie.movie_id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), nullable=False)
    show_time = Column(DateTime, nullable=False)
    seat_price = Column(Numeric(10, 2), nullable=False)
    __table_args__ = (UniqueConstraint("screen_id", "show_time", name="uq_show_screen_time"),)

class Booking(Base):
    __tablename__ = "booking"
    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    show_id = Column(Integer, ForeignKey("show.show_id", ondelete="CASCADE"), nullable=False)
    booking_time = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(String(20), nullable=False)

class Payment(Base):
    __tablename__ = "payment"
    payment_id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("booking.booking_id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False, default='Pending')
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    expires_at = Column(DateTime, nullable=False)

class Seat(Base):
    __tablename__ = "seat"
    seat_id = Column(Integer, primary_key=True, index=True)
    status = Column(String(20), nullable=False, default='UNBOOKED')
    booking_id = Column(Integer, ForeignKey("booking.booking_id", ondelete="SET NULL"), nullable=True)
    show_id = Column(Integer, ForeignKey("show.show_id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), nullable=False)
    seat_number = Column(String(10), nullable=False)
    __table_args__ = (UniqueConstraint("show_id", "seat_number", name="uq_seat_show_number"),)