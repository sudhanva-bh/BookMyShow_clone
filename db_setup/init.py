import argparse
import os
import sys

# Add necessary paths for imports to work regardless of where the script is run from
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, BASE_DIR)

from init_db import create_database, execute_sql_scripts
from reset_db import drop_database
from seed_shows import seed_shows_and_seats

def interactive_menu():
    print("\n=== BookMyShow Database Setup CLI ===")
    print("1. Initialize Database (Empty schema only)")
    print("2. Initialize Database (With Sample Data & Shows)")
    print("3. Reset Database (Drop, Recreate, Empty)")
    print("4. Reset Database (Drop, Recreate, With Sample Data & Shows)")
    print("5. Seed Shows & Seats Only (DB must already be initialized)")
    print("0. Exit")
    
    choice = input("\nEnter your choice (0-5): ").strip()
    
    if choice == "1":
        create_database()
        execute_sql_scripts(seed_base_data=False)
    elif choice == "2":
        create_database()
        execute_sql_scripts(seed_base_data=True)
        seed_shows_and_seats()
    elif choice == "3":
        drop_database()
        create_database()
        execute_sql_scripts(seed_base_data=False)
    elif choice == "4":
        drop_database()
        create_database()
        execute_sql_scripts(seed_base_data=True)
        seed_shows_and_seats()
    elif choice == "5":
        seed_shows_and_seats()
    elif choice == "0":
        print("Exiting.")
        sys.exit(0)
    else:
        print("Invalid choice. Exiting.")

def main():
    parser = argparse.ArgumentParser(description="Database Operations CLI")
    parser.add_argument("action", nargs="?", choices=["init", "reset", "seed"], help="Action to perform")
    parser.add_argument("--with-seed", action="store_true", help="Include sample data when initializing or resetting")
    
    args = parser.parse_args()
    
    if not args.action:
        interactive_menu()
        return
        
    if args.action == "init":
        create_database()
        execute_sql_scripts(seed_base_data=args.with_seed)
        if args.with_seed:
            seed_shows_and_seats()
    elif args.action == "reset":
        drop_database()
        create_database()
        execute_sql_scripts(seed_base_data=args.with_seed)
        if args.with_seed:
            seed_shows_and_seats()
    elif args.action == "seed":
        seed_shows_and_seats()

if __name__ == "__main__":
    main()