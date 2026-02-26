import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Path to your backend/.env file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, "backend", ".env")

# Load the environment variables
load_dotenv(dotenv_path=env_path)

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

def execute_sql_scripts():
    """Connects to the newly created database and runs the SQL files."""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        cursor = conn.cursor()

        for filename in SQL_FILES:
            filepath = os.path.join(SCHEMA_DIR, filename)
            if os.path.exists(filepath):
                print(f"⏳ Executing {filename}...")
                with open(filepath, 'r') as file:
                    cursor.execute(file.read())
                conn.commit()
                print(f"{filename} executed successfully.")
            else:
                print(f"Warning: File not found at {filepath}")

        cursor.close()
        conn.close()
        print("\nDatabase setup complete!")

    except Exception as e:
        print(f"Error executing scripts: {e}")

if __name__ == "__main__":
    if not DB_PASSWORD:
        print("Error: DB_PASSWORD is not set. Please check your backend/.env file.")
        exit(1)
    create_database()
    execute_sql_scripts()