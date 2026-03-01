import os

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "presentation_queries")

# Dictionary holding all the queries organized by folder
QUERIES = {
    "users": {
        "01_create.sql": "INSERT INTO \"user\" (name, email, phone) \nVALUES ('Name', 'email@example.com', '9999999999')\nRETURNING *;",
        "02_read.sql": "SELECT user_id, name, email, phone, created_at \nFROM \"user\" \nWHERE email = 'email@example.com';",
        "03_update.sql": "UPDATE \"user\" \nSET phone = '9999999999' \nWHERE email = 'email@example.com'\nRETURNING *;",
        "04_delete.sql": "DELETE FROM \"user\" \nWHERE email = 'email@example.com'\nRETURNING *;"
    },
    "theatres": {
        "01_create.sql": "INSERT INTO theatre (name, location, city) \nVALUES ('Asian Shiva Shakti', 'Shamirpet', 'Hyderabad')\nRETURNING *;",
        "02_read.sql": "SELECT theatre_id, name, location, city \nFROM theatre \nWHERE city = 'Hyderabad';",
        "03_update.sql": "UPDATE theatre \nSET location = 'Secunderabad' \nWHERE name = 'Asian Shiva Shakti' AND city = 'Hyderabad'\nRETURNING *;",
        "04_delete.sql": "DELETE FROM theatre \nWHERE name = 'Asian Shiva Shakti' AND city = 'Hyderabad'\nRETURNING *;"
    },
    "movies": {
        "01_create.sql": "INSERT INTO movie (title, language, duration_mins, release_date, certificate) \nVALUES ('Inception', 'English', 148, '2010-07-16', 'UA')\nRETURNING *;",
        "02_read.sql": "SELECT * FROM movie \nWHERE language = 'English' AND certificate = 'UA';",
        "03_update.sql": "UPDATE movie \nSET duration_mins = 150 \nWHERE title = 'Inception'\nRETURNING *;",
        "04_delete.sql": "DELETE FROM movie \nWHERE title = 'Inception'\nRETURNING *;"
    },
    "screen": {
        "01_create.sql": "INSERT INTO screen (theatre_id, screen_name, total_capacity) \nVALUES (1, 'Screen 1', 150)\nRETURNING *;",
        "02_read.sql": "SELECT screen_id, theatre_id, screen_name, total_capacity \nFROM screen \nWHERE theatre_id = 1;",
        "03_update.sql": "UPDATE screen \nSET total_capacity = 200 \nWHERE screen_id = 1\nRETURNING *;",
        "04_delete.sql": "DELETE FROM screen \nWHERE screen_id = 1\nRETURNING *;"
    },
    "show": {
        "01_create.sql": "INSERT INTO show (movie_id, screen_id, show_time, seat_price) \nVALUES (1, 1, '2026-03-05 14:30:00', 250.00)\nRETURNING *;",
        "02_read.sql": "SELECT show_id, movie_id, screen_id, show_time, seat_price \nFROM show \nWHERE movie_id = 1;",
        "03_update.sql": "UPDATE show \nSET seat_price = 350.00 \nWHERE show_id = 1\nRETURNING *;",
        "04_delete.sql": "DELETE FROM show \nWHERE show_id = 1\nRETURNING *;",
        "05_get_seats.sql": "-- Fetch all seats and their availability status for a specific show\nSELECT seat_id, seat_number, status, screen_id \nFROM seat \nWHERE show_id = 1\nORDER BY seat_number ASC;"
    },
    "seats": {
        "01_create.sql": "-- Inserting a new VIP seat for Screen 1\nINSERT INTO seat (screen_id, show_id, seat_number, status) \nVALUES (1, 1, 'H10', 'UNBOOKED')\nRETURNING *;",
        "02_read.sql": "-- View all seats assigned to a specific screen\nSELECT screen_id, seat_number, status \nFROM seat \nWHERE screen_id = 1\nORDER BY seat_number;",
        "03_update.sql": "-- Changing a specific seat's status\nUPDATE seat \nSET status = 'BOOKED' \nWHERE screen_id = 1 AND seat_number = 'A1'\nRETURNING *;",
        "04_delete.sql": "-- Removing a seat from the database\nDELETE FROM seat \nWHERE screen_id = 1 AND seat_number = 'H10'\nRETURNING *;"
    },
    "bookings": {
        "01_create_booking_transaction.sql": "BEGIN;\n\n-- 1. Lock the selected seats for processing\nSELECT * FROM seat \nWHERE show_id = 1 AND seat_number IN ('A01', 'A02') \nFOR UPDATE;\n\n-- 2. Insert the pending booking record\nINSERT INTO booking (user_id, show_id, total_amount, status) \nVALUES (1, 1, 500.00, 'Pending') \nRETURNING booking_id;\n\n-- 3. Update the seats to 'PROCESSING'\nUPDATE seat \nSET status = 'PROCESSING', booking_id = 1 \nWHERE show_id = 1 AND seat_number IN ('A01', 'A02');\n\n-- 4. Initialize the pending payment with a 120-second expiry\nINSERT INTO payment (booking_id, amount, status, expires_at) \nVALUES (1, 500.00, 'Pending', CURRENT_TIMESTAMP + INTERVAL '120 seconds');\n\nCOMMIT;",
        "02_read_user_bookings.sql": "-- Retrieve all bookings for a specific user\nSELECT b.booking_id, b.show_id, b.total_amount, b.status, b.booking_time\nFROM booking b\nWHERE b.user_id = 1\nORDER BY b.booking_time DESC;"
    },
    "payments": {
        "01_process_payment_success.sql": "BEGIN;\n\n-- 1. Lock the payment row\nSELECT * FROM payment WHERE payment_id = 1 FOR UPDATE;\n\n-- 2. Update payment status to 'Success'\nUPDATE payment SET status = 'Success' WHERE payment_id = 1;\n\n-- 3. Update the associated booking to 'Booked'\nUPDATE booking SET status = 'Booked' WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);\n\n-- 4. Finalize the seats as 'BOOKED'\nUPDATE seat SET status = 'BOOKED' WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);\n\nCOMMIT;",
        "02_process_payment_failure.sql": "BEGIN;\n\n-- 1. Lock the payment row\nSELECT * FROM payment WHERE payment_id = 1 FOR UPDATE;\n\n-- 2. Update payment status to 'Failed'\nUPDATE payment SET status = 'Failed' WHERE payment_id = 1;\n\n-- 3. Update the associated booking to 'Cancelled'\nUPDATE booking SET status = 'Cancelled' WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);\n\n-- 4. Release the seats back into the pool\nUPDATE seat SET status = 'UNBOOKED', booking_id = NULL WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);\n\nCOMMIT;"
    },
    "jobs": {
        "01_cleanup_expired_seats.sql": "BEGIN;\n\n-- 1. Identify and update expired pending payments\nWITH expired_payments AS (\n    UPDATE payment\n    SET status = 'Failed'\n    WHERE status = 'Pending' AND expires_at < CURRENT_TIMESTAMP\n    RETURNING booking_id\n),\n-- 2. Cancel the associated bookings\ncancelled_bookings AS (\n    UPDATE booking\n    SET status = 'Cancelled'\n    WHERE booking_id IN (SELECT booking_id FROM expired_payments)\n    RETURNING booking_id\n)\n-- 3. Free up the seats\nUPDATE seat\nSET status = 'UNBOOKED', booking_id = NULL\nWHERE booking_id IN (SELECT booking_id FROM cancelled_bookings);\n\nCOMMIT;"
    }
}

def generate_queries():
    print("Generating presentation SQL queries...")
    for folder, files in QUERIES.items():
        folder_path = os.path.join(BASE_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        for file_name, sql_content in files.items():
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(sql_content + "\n")
            print(f"Created: {folder}/{file_name}")

    print(f"\nSuccessfully generated all SQL queries inside: {BASE_DIR}")

if __name__ == "__main__":
    generate_queries()