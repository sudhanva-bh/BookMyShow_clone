import os
import sys
from datetime import datetime, timedelta, date

# Setup path so we can import backend app modules (Adjusted for nested folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, "backend"))

from app.database import SessionLocal
from app.crud.show import create_show
from app.schemas import ShowCreate

def seed_shows_and_seats():
    db = SessionLocal()
    
    # Base starting date (Midnight today, so offsets align with CURRENT_DATE)
    base_date = datetime.combine(date.today(), datetime.min.time())
    
    # Define time slots (4 shows per screen strictly prevents 3-hour overlap issues)
    time_slots = [(9, 30), (13, 15), (17, 0), (20, 45)]

    # Map Screen ID to -> ([List of Movie IDs], Base Price)
    # If 1 movie is listed, it plays all 4 shows. If 2 are listed, they alternate.
    screen_movie_map = {
        # AMB Cinemas (Hyd) - Telugu & English
        1: ([7], 200),        # Screen 1: RRR all day
        2: ([8, 9], 200),     # Screen 2: Baahubali & Kalki alternating
        3: ([1, 2], 400),     # VIP Lounge: Inception & Interstellar
        4: ([9], 220),        # Screen 4: Kalki all day
        
        # Prasads (Hyd)
        5: ([2], 450),        # IMAX: Interstellar all day (Premium)
        6: ([9], 350),        # PCX: Kalki all day
        7: ([3, 7], 200),     # Screen 3: Dark Knight & RRR
        
        # PVR Juhu (Mumbai) - Hindi & English
        8: ([5], 250),        # Screen 1: Jawan all day
        9: ([4, 6], 250),     # Screen 2: Dangal & 3 Idiots
        10: ([3], 400),       # PXL: The Dark Knight all day
        11: ([5, 1], 500),    # 4DX: Jawan & Inception
        
        # INOX Nariman (Mumbai)
        12: ([4], 280),       # Screen 1: Dangal all day
        13: ([5, 3], 600),    # INSIGNIA: Jawan & Dark Knight
        
        # PVR Forum (Bangalore) - Tamil & English
        14: ([12], 250),      # Screen 1: Jailer all day
        15: ([10, 11], 250),  # Screen 2: Leo & Vikram
        16: ([1, 12], 750),   # Gold Class: Inception & Jailer
        
        # Cinepolis Orion (Bangalore)
        17: ([10], 250),      # Screen 1: Leo all day
        18: ([11, 2], 350),   # MACRO XE: Vikram & Interstellar
        19: ([10, 12], 550),  # VIP: Leo & Jailer
        
        # PVR Select Citywalk (Delhi) - Hindi & English
        20: ([5], 300),       # Screen 1: Jawan all day
        21: ([4, 6], 300),    # Screen 2: Dangal & 3 Idiots
        22: ([2, 3], 900),    # Director's Cut: Interstellar & Dark Knight
        
        # INOX Nehru Place (Delhi)
        23: ([4], 250),       # Screen 1: Dangal all day
        24: ([5, 6], 250),    # Screen 2: Jawan & 3 Idiots
    }

    all_shows_config = []

    # Generate shows for exactly 7 days
    for day_offset in range(1, 8):
        for screen_id, (movies, base_price) in screen_movie_map.items():
            for slot_idx, (hour, minute) in enumerate(time_slots):
                # If array has 1 movie, it always returns index 0. If 2 movies, it alternates 0, 1, 0, 1
                movie_id = movies[slot_idx % len(movies)]
                
                # Evening and Night shows get a 50 Rs premium surge
                price = base_price + (50 if hour >= 17 else 0)
                
                all_shows_config.append((movie_id, screen_id, day_offset, hour, minute, price))

    shows_created = 0
    print(f"\n[Seeder] Generating {len(all_shows_config)} perfectly packed shows (7 days * 24 screens * 4 slots)...")

    for config in all_shows_config:
        movie_id, screen_id, day_offset, hour, minute, price = config
        show_time = base_date + timedelta(days=day_offset, hours=hour, minutes=minute)
        
        show_data = ShowCreate(
            movie_id=movie_id,
            screen_id=screen_id,
            show_time=show_time,
            seat_price=float(price)
        )

        try:
            create_show(db, show_data)
            shows_created += 1
        except Exception as e:
            db.rollback()
            print(f"Failed to create show for Movie {movie_id} on Screen {screen_id} at {show_time}: {e}")

    db.close()
    print(f"[Seeder] Successfully seeded {shows_created} shows and all their seats!")

if __name__ == "__main__":
    seed_shows_and_seats()