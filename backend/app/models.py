from sqlalchemy import Column, Integer, String, DateTime, Text, UniqueConstraint, ForeignKey, text
from app.database import Base


class User(Base):
    __tablename__ = "user"

    # We use exact column names and types matching your 01_tables.sql
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False)

    # Let the database handle the default timestamp via server_default
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))


class Theatre(Base):
    __tablename__ = "theatre"

    theatre_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(Text, nullable=False)  # Maps to TEXT in postgres
    city = Column(String(100), nullable=False)

    # Replicating the uq_theatre_name_city constraint
    __table_args__ = (UniqueConstraint("name", "city", name="uq_theatre_name_city"),)

class Screen(Base):
    __tablename__ = "screen"

    screen_id = Column(Integer, primary_key=True, index=True)
    theatre_id = Column(Integer, ForeignKey("theatre.theatre_id", ondelete="CASCADE"), nullable=False)
    screen_name = Column(String(50), nullable=False)
    total_capacity = Column(Integer, nullable=False)

    __table_args__ = (UniqueConstraint("theatre_id", "screen_name", name="uq_screen_theatre_name"),)
