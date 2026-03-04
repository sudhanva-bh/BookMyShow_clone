import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Adjusted BASE_DIR since this file is now one folder deep
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, "backend", ".env")
load_dotenv(dotenv_path=env_path)

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
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute(
            f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'"
        )
        if not cursor.fetchone():
            print(f"Creating database '{DB_NAME}'")
            cursor.execute(f"CREATE DATABASE {DB_NAME};")
            print("Database created successfully")
        else:
            print(f"Database '{DB_NAME}' already exists. Skipping creation.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        exit(1)


def execute_sql_scripts(seed_base_data=False):
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
        )
        cursor = conn.cursor()

        files_to_run = SQL_FILES.copy()
        if seed_base_data:
            files_to_run.append("03_sample_data.sql")

        for filename in files_to_run:
            filepath = os.path.join(SCHEMA_DIR, filename)
            if os.path.exists(filepath):
                print(f"Executing {filename}")
                with open(filepath, "r") as file:
                    cursor.execute(file.read())
                conn.commit()
                print(f"{filename} executed successfully")
            else:
                print(f"Warning: File not found at {filepath}")

        cursor.close()
        conn.close()
        print("\nSQL execution complete")

    except Exception as e:
        print(f"Error executing scripts: {e}")
