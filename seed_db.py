import sys
import os
import string
from datetime import datetime, timedelta

# Add backend to path so we can import app modules
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, "backend"))

from app.database import SessionLocal
from app import models

def seed():
    db = SessionLocal()
    try:
        # 1. Seed Users
        users = [
            models.User(name='Aditya Varma', email='aditya.v@example.com', phone='9876543201'),
            models.User(name='Priya Reddy', email='priya.reddy@example.com', phone='9876543202'),
            models.User(name='Karthik Nair', email='karthik.n@example.com', phone='9876543203'),
            models.User(name='Sneha Rao', email='sneha.rao@example.com', phone='9876543204'),
            models.User(name='Rahul Sharma', email='rahul.s@example.com', phone='9876543205'),
            models.User(name='Anjali Desai', email='anjali.d@example.com', phone='9876543206'),
            models.User(name='Vikram Singh', email='vikram.s@example.com', phone='9876543207'),
            models.User(name='Neha Gupta', email='neha.g@example.com', phone='9876543208'),
            models.User(name='Rohan Kapoor', email='rohan.k@example.com', phone='9876543209'),
            models.User(name='Pooja Joshi', email='pooja.j@example.com', phone='9876543210'),
        ]
        db.add_all(users)
        db.commit()

        # 2. Seed Theatres
        theatres = [
            models.Theatre(name='AMB Cinemas', location='Sarath City Capital Mall, Kondapur', city='Hyderabad'),
            models.Theatre(name='Prasads Multiplex', location='NTR Marg, Central Secretariat', city='Hyderabad'),
            models.Theatre(name='PVR Inorbit', location='Inorbit Mall, Cyberabad', city='Hyderabad'),
            models.Theatre(name='Asian Shiva Shakti', location='Kompally Road, Shamirpet', city='Hyderabad'),
        ]
        db.add_all(theatres)
        db.commit()

        # 3. Seed Movies
        movies = [
            models.Movie(title='Inception', language='English', duration_mins=148, release_date=datetime(2010, 7, 16).date(), certificate='UA'),
            models.Movie(title='Interstellar', language='English', duration_mins=169, release_date=datetime(2014, 11, 7).date(), certificate='U'),
            models.Movie(title='RRR', language='Telugu', duration_mins=187, release_date=datetime(2022, 3, 25).date(), certificate='UA'),
            models.Movie(title='Kalki 2898 AD', language='Telugu', duration_mins=181, release_date=datetime(2024, 6, 27).date(), certificate='UA'),
            models.Movie(title='The Dark Knight', language='English', duration_mins=152, release_date=datetime(2008, 7, 18).date(), certificate='UA'),
            models.Movie(title='Pushpa: The Rise', language='Telugu', duration_mins=179, release_date=datetime(2021, 12, 17).date(), certificate='UA'),
            models.Movie(title='Dangal', language='Hindi', duration_mins=161, release_date=datetime(2016, 12, 23).date(), certificate='U'),
            models.Movie(title='KGF: Chapter 2', language='Kannada', duration_mins=168, release_date=datetime(2022, 4, 14).date(), certificate='UA'),
            models.Movie(title='Parasite', language='Korean', duration_mins=132, release_date=datetime(2019, 5, 30).date(), certificate='A'),
            models.Movie(title='Jawan', language='Hindi', duration_mins=169, release_date=datetime(2023, 9, 7).date(), certificate='UA'),
        ]
        db.add_all(movies)
        db.commit()

        # 4. Seed Screens
        screens_data = [
            (1, 'Screen 1', 250), (1, 'Screen 2', 220), (1, 'IMAX', 300),
            (2, 'Screen 1', 280), (2, 'Screen 2', 200), (2, 'Screen 3', 180), (2, 'Large Format', 320),
            (3, 'Screen 1', 210), (3, 'Screen 2', 190), (3, 'Screen 3', 170),
            (4, 'Screen 1', 230), (4, 'Screen 2', 200)
        ]
        for t_id, s_name, cap in screens_data:
            db.add(models.Screen(theatre_id=t_id, screen_name=s_name, total_capacity=cap))
        db.commit()

        # 5. Seed Shows & Generating Seats
        now = datetime.now()
        shows_data = [
            (1, 1, now + timedelta(hours=2), 250.00),
            (2, 2, now + timedelta(days=1, hours=3), 300.00),
            (3, 4, now + timedelta(hours=5), 200.00),
            (4, 5, now + timedelta(days=2), 350.00),
            (5, 7, now + timedelta(minutes=45), 150.00),
            (6, 8, now + timedelta(minutes=25), 200.00),
            (8, 10, now + timedelta(minutes=15), 250.00),
            (8, 10, now + timedelta(minutes=19), 250.00),
            (7, 9, now - timedelta(hours=5), 180.00),
            (9, 11, now - timedelta(days=1), 200.00),
            (10, 12, now + timedelta(days=3, hours=4), 400.00),
            (1, 3, now + timedelta(hours=12), 450.00),
        ]

        letters = string.ascii_uppercase
        for m_id, s_id, s_time, price in shows_data:
            show = models.Show(movie_id=m_id, screen_id=s_id, show_time=s_time, seat_price=price)
            db.add(show)
            db.flush() # Flush to get show_id
            
            # Fetch screen capacity
            screen = db.query(models.Screen).filter(models.Screen.screen_id == s_id).first()
            capacity = screen.total_capacity
            
            # Divide seats evenly into 10 rows
            rows = 10
            cols = capacity // rows
            remainder = capacity % rows
            
            seats_to_insert = []
            
            for r in range(rows):
                row_letter = letters[r % 26] if r < 26 else letters[(r // 26) - 1] + letters[r % 26]
                for c in range(1, cols + 1):
                    seats_to_insert.append(models.Seat(
                        status="UNBOOKED", show_id=show.show_id, screen_id=show.screen_id, seat_number=f"{row_letter}{c:02d}"
                    ))
            
            # Handle remainder seats in an extra row
            if remainder > 0:
                r = rows
                row_letter = letters[r % 26] if r < 26 else letters[(r // 26) - 1] + letters[r % 26]
                for c in range(1, remainder + 1):
                    seats_to_insert.append(models.Seat(
                        status="UNBOOKED", show_id=show.show_id, screen_id=show.screen_id, seat_number=f"{row_letter}{c:02d}"
                    ))

            if seats_to_insert:
                db.bulk_save_objects(seats_to_insert)

        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()