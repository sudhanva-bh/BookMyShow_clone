import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Path to your backend/.env file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, "backend", ".env")

# Load the environment variables
load_dotenv(dotenv_path=env_path)

# IMPORTANT: Add the backend directory to sys.path so we can import the app modules
sys.path.append(os.path.join(BASE_DIR, "backend"))

# --- Configuration (Pulled from .env) ---
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "bookmyshow")

SCHEMA_DIR = os.path.join(BASE_DIR, "database", "schema")

SQL_FILES = [
    "01_tables.sql",
    "02_constraints.sql",
]

def create_database():
    """Connects to default 'postgres' database to create the new one."""
    try:
        conn = psycopg2.connect(
            dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        if not cursor.fetchone():
            print(f"Creating database '{DB_NAME}'...")
            cursor.execute(f"CREATE DATABASE {DB_NAME};")
            print("Database created successfully.")
        else:
            print(f"Database '{DB_NAME}' already exists. Skipping creation.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        exit(1)

def seed_shows_and_seats():
    """Uses the backend CRUD methods to properly auto-generate seats for shows."""
    from app.database import SessionLocal
    from app.crud.show import create_show
    from app.schemas import ShowCreate

    db = SessionLocal()
    now = datetime.now()

    # Data mapped to match the original constraints and screen capacities.
    shows_to_create = [
        {"movie_id": 1, "screen_id": 1, "show_time": now + timedelta(hours=2), "seat_price": 250.00, "rows": 10, "cols": 25},
        {"movie_id": 2, "screen_id": 2, "show_time": now + timedelta(days=1, hours=3), "seat_price": 300.00, "rows": 10, "cols": 22},
        {"movie_id": 3, "screen_id": 4, "show_time": now + timedelta(hours=5), "seat_price": 200.00, "rows": 14, "cols": 20},
        {"movie_id": 4, "screen_id": 5, "show_time": now + timedelta(days=2), "seat_price": 350.00, "rows": 10, "cols": 20},
        {"movie_id": 5, "screen_id": 7, "show_time": now + timedelta(minutes=45), "seat_price": 150.00, "rows": 16, "cols": 20},
        {"movie_id": 6, "screen_id": 8, "show_time": now + timedelta(minutes=25), "seat_price": 200.00, "rows": 10, "cols": 21},
        {"movie_id": 8, "screen_id": 10, "show_time": now + timedelta(minutes=15), "seat_price": 250.00, "rows": 10, "cols": 17},
        # Fixed: Moved this to screen_id 6 so it doesn't conflict with screen 10's 3-hour exclusion constraint
        {"movie_id": 8, "screen_id": 6, "show_time": now + timedelta(minutes=19), "seat_price": 250.00, "rows": 10, "cols": 18},
        {"movie_id": 7, "screen_id": 9, "show_time": now - timedelta(hours=5), "seat_price": 180.00, "rows": 10, "cols": 19},
        {"movie_id": 9, "screen_id": 11, "show_time": now - timedelta(days=1), "seat_price": 200.00, "rows": 10, "cols": 23},
        {"movie_id": 10, "screen_id": 12, "show_time": now + timedelta(days=3, hours=4), "seat_price": 400.00, "rows": 10, "cols": 20},
        {"movie_id": 1, "screen_id": 3, "show_time": now + timedelta(hours=12), "seat_price": 450.00, "rows": 15, "cols": 20},
    ]

    print("\nSeeding shows and generating seats via Python CRUD...")
    for data in shows_to_create:
        try:
            show_in = ShowCreate(**data)
            create_show(db, show_in)
        except Exception as e:
            # Added db.rollback() so the session can continue seeding other shows even if one fails
            db.rollback()
            print(f"Failed to create show for movie {data['movie_id']} on screen {data['screen_id']}: {e}")
    
    db.close()
    print("Shows and seats successfully seeded!")

def execute_sql_scripts(seed_data=False):
    """Connects to the newly created database and runs the SQL files."""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        cursor = conn.cursor()

        # Copy the base files and conditionally add the seed script
        files_to_run = SQL_FILES.copy()
        if seed_data:
            files_to_run.append("03_sample_data.sql")

        for filename in files_to_run:
            filepath = os.path.join(SCHEMA_DIR, filename)
            if os.path.exists(filepath):
                print(f"Executing {filename}...")
                with open(filepath, 'r') as file:
                    cursor.execute(file.read())
                conn.commit()
                print(f"{filename} executed successfully.")
            else:
                print(f"Warning: File not found at {filepath}")

        cursor.close()
        conn.close()
        
        # --- Call Python seeder for dependent records ---
        if seed_data:
            seed_shows_and_seats()

        print("\nDatabase setup complete!")

    except Exception as e:
        print(f"Error executing scripts: {e}")

if __name__ == "__main__":
    if not DB_PASSWORD:
        print("Error: DB_PASSWORD is not set. Please check your backend/.env file.")
        exit(1)
        
    # Ask the user if they want to seed the database
    seed_choice = input("Do you want to seed the database with sample data? (y/n): ").strip().lower()
    should_seed = seed_choice in ['y', 'yes']

    create_database()
    execute_sql_scripts(seed_data=should_seed)