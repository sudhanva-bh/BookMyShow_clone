import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Import the functions from your existing setup script
from init_db import create_database, execute_sql_scripts

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, "backend", ".env")
load_dotenv(dotenv_path=env_path)

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "bookmyshow")

def drop_database():
    print(f"Initiating reset for database '{DB_NAME}'...")
    try:
        conn = psycopg2.connect(
            dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        terminate_query = f"""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{DB_NAME}'
          AND pid <> pg_backend_pid();
        """
        cursor.execute(terminate_query)
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME};")
        print(f"Database '{DB_NAME}' dropped successfully.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error dropping database: {e}")
        exit(1)

if __name__ == "__main__":
    if not DB_PASSWORD:
        print("Error: DB_PASSWORD is not set. Please check your backend/.env file.")
        exit(1)

    drop_database()
    create_database()

    seed_choice = input("Do you want to seed the database with sample data? (y/n): ").strip().lower()
    should_seed = seed_choice in ["y", "yes"]

    # execute_sql_scripts automatically calls the new python seeder logic at the end if should_seed=True
    execute_sql_scripts(seed_data=should_seed)

    print("Full reset complete! You have a perfectly clean slate.")