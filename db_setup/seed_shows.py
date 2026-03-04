import os
import sys
import random
from datetime import datetime, timedelta, date

# Setup path so we can import backend app modules (Adjusted for nested folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, "backend"))

from app.database import SessionLocal
from app.crud.show import create_show
from app.schemas import ShowCreate


def seed_shows_and_seats():
    db = SessionLocal()

    # Base starting date (Midnight today)
    base_date = datetime.combine(date.today(), datetime.min.time())

    # Define time slots (4 shows per screen strictly prevents overlap issues)
    time_slots = [(9, 30), (13, 15), (17, 0), (20, 45)]

    # Map Screen ID to -> ([List of 1 or 2 Movie IDs], Base Price)
    screen_movie_map = {
        # AMB Cinemas (Hyd)
        1: ([7, 8], 200),  # Screen 1: RRR & Baahubali
        2: ([8, 9], 200),  # Screen 2: Baahubali & Kalki
        3: ([1, 2], 400),  # VIP Lounge: Inception & Interstellar
        4: ([9, 7], 220),  # Screen 4: Kalki & RRR
        # Prasads (Hyd)
        5: ([2, 3], 450),  # IMAX: Interstellar & Dark Knight
        6: ([9, 8], 350),  # PCX: Kalki & Baahubali
        7: ([3, 7], 200),  # Screen 3: Dark Knight & RRR
        # PVR Juhu (Mumbai)
        8: ([5, 4], 250),  # Screen 1: Jawan & Dangal
        9: ([4, 6], 250),  # Screen 2: Dangal & 3 Idiots
        10: ([3, 1], 400),  # PXL: The Dark Knight & Inception
        11: ([5, 1], 500),  # 4DX: Jawan & Inception
        # INOX Nariman (Mumbai)
        12: ([4, 5], 280),  # Screen 1: Dangal & Jawan
        13: ([5, 3], 600),  # INSIGNIA: Jawan & Dark Knight
        # PVR Forum (Bangalore)
        14: ([12, 10], 250),  # Screen 1: Jailer & Leo
        15: ([10, 11], 250),  # Screen 2: Leo & Vikram
        16: ([1, 12], 750),  # Gold Class: Inception & Jailer
        # Cinepolis Orion (Bangalore)
        17: ([10, 11], 250),  # Screen 1: Leo & Vikram
        18: ([11, 2], 350),  # MACRO XE: Vikram & Interstellar
        19: ([10, 12], 550),  # VIP: Leo & Jailer
        # PVR Select Citywalk (Delhi)
        20: ([5, 6], 300),  # Screen 1: Jawan & 3 Idiots
        21: ([4, 6], 300),  # Screen 2: Dangal & 3 Idiots
        22: ([2, 3], 900),  # Director's Cut: Interstellar & Dark Knight
        # INOX Nehru Place (Delhi)
        23: ([4, 5], 250),  # Screen 1: Dangal & Jawan
        24: ([5, 6], 250),  # Screen 2: Jawan & 3 Idiots
    }

    all_shows_config = []
    
    # Initialize the counter BEFORE the loop!
    shows_created = 0

    # Generate shows for exactly 7 days (Starting from 0 to include TODAY)
    for day_offset in range(0, 7):
        for screen_id, (movies, base_price) in screen_movie_map.items():
            for slot_idx, (hour, minute) in enumerate(time_slots):

                # This simply shifts the starting movie by 1 every day.
                # Day 0: Slot 0 plays Movie A, Slot 1 plays Movie B
                # Day 1: Slot 0 plays Movie B, Slot 1 plays Movie A
                movie_id = movies[(slot_idx + day_offset) % len(movies)]

                # Evening and Night shows get a 50 Rs premium surge
                price = base_price + (50 if hour >= 17 else 0)

                show_time = base_date + timedelta(
                    days=day_offset, hours=hour, minutes=minute
                )

                # Skip shows that are already in the past for today
                if day_offset == 0 and show_time <= datetime.now():
                    continue

                show_data = ShowCreate(
                    movie_id=movie_id,
                    screen_id=screen_id,
                    show_time=show_time,
                    seat_price=float(price),
                )

                try:
                    create_show(db, show_data)
                    shows_created += 1
                except Exception as e:
                    db.rollback()
                    print(
                        f"Failed to create show for Movie {movie_id} on Screen {screen_id} at {show_time}: {e}"
                    )

    db.close()
    print(
        f"[Seeder] Successfully seeded {shows_created} shows with a rotating daily schedule!"
    )


if __name__ == "__main__":
    seed_shows_and_seats()