from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    String,
    DateTime,
    Text,
    UniqueConstraint,
    ForeignKey,
    text,
    Date,
)
from app.database import Base


# -------------------- USER --------------------

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))


# -------------------- THEATRE --------------------

class Theatre(Base):
    __tablename__ = "theatre"

    theatre_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)

    __table_args__ = (
        UniqueConstraint("name", "city", name="uq_theatre_name_city"),
    )


# -------------------- SCREEN --------------------

class Screen(Base):
    __tablename__ = "screen"

    screen_id = Column(Integer, primary_key=True, index=True)
    theatre_id = Column(
        Integer,
        ForeignKey("theatre.theatre_id", ondelete="CASCADE"),
        nullable=False,
    )
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

#---------------------- SEAT ------------------------

class Seat(Base):
    __tablename__ = "seat"

    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), primary_key=True)
    seat_number = Column(String(10), primary_key=True)
    seat_type = Column(String(20), nullable=False)

class Show(Base):
    __tablename__ = "show"

    show_id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movie.movie_id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screen.screen_id", ondelete="CASCADE"), nullable=False)
    show_time = Column(DateTime, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (UniqueConstraint("screen_id", "show_time", name="uq_show_screen_time"),)
