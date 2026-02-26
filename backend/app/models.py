from sqlalchemy import Column, Integer, String, DateTime, text
from app.database import Base

class User(Base):
    __tablename__ = "user"

    # We use exact column names and types matching your 01_tables.sql
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False)
    
    # Let the database handle the default timestamp via server_default
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))