-- ENUMS
CREATE TYPE seat_status_enum AS ENUM ('UNBOOKED', 'PROCESSING', 'BOOKED');
CREATE TYPE booking_status_enum AS ENUM ('Pending', 'Booked', 'Cancelled');
CREATE TYPE payment_method_enum AS ENUM ('UPI', 'Card', 'NetBanking', 'Cash');
CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Success', 'Failed');

-- CORE TABLES
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    duration_mins INT NOT NULL,
    release_date DATE NOT NULL,
    certificate VARCHAR(10)
);

CREATE TABLE theatre (
    theatre_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE screen (
    screen_id SERIAL PRIMARY KEY,
    theatre_id INT NOT NULL,
    screen_name VARCHAR(50) NOT NULL,
    total_capacity INT NOT NULL
);

CREATE TABLE show (
    show_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_time TIMESTAMP NOT NULL,
    seat_price DECIMAL(10,2) NOT NULL
);

-- BOOKING & PAYMENTS
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status booking_status_enum NOT NULL
);

CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status_enum NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- SEATS
CREATE TABLE seat (
    seat_id SERIAL PRIMARY KEY,
    status seat_status_enum NOT NULL DEFAULT 'UNBOOKED',
    booking_id INT,
    show_id INT NOT NULL,
    screen_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL
);