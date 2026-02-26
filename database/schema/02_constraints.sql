-- ==========================================
-- 1. FOREIGN KEY CONSTRAINTS
-- ==========================================
ALTER TABLE screen
    ADD CONSTRAINT fk_screen_theatre FOREIGN KEY (theatre_id) REFERENCES theatre(theatre_id) ON DELETE CASCADE;

ALTER TABLE seat
    ADD CONSTRAINT fk_seat_screen FOREIGN KEY (screen_id) REFERENCES screen(screen_id) ON DELETE CASCADE;

ALTER TABLE show
    ADD CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_show_screen FOREIGN KEY (screen_id) REFERENCES screen(screen_id) ON DELETE CASCADE;

ALTER TABLE booking
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_booking_show FOREIGN KEY (show_id) REFERENCES show(show_id) ON DELETE CASCADE;

-- Complex Composite Foreign Keys mapped to the weak SEAT entity
ALTER TABLE booking_seat
    ADD CONSTRAINT fk_bookingseat_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bookingseat_show FOREIGN KEY (show_id) REFERENCES show(show_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bookingseat_seat FOREIGN KEY (screen_id, seat_number) REFERENCES seat(screen_id, seat_number) ON DELETE CASCADE;

-- ==========================================
-- 2. UNIQUE CONSTRAINTS
-- ==========================================
ALTER TABLE "user"
    ADD CONSTRAINT uq_user_email UNIQUE (email),
    ADD CONSTRAINT uq_user_phone UNIQUE (phone);

ALTER TABLE theatre
    ADD CONSTRAINT uq_theatre_name_city UNIQUE (name, city);

ALTER TABLE screen
    ADD CONSTRAINT uq_screen_theatre_name UNIQUE (theatre_id, screen_name);

ALTER TABLE show
    ADD CONSTRAINT uq_show_screen_time UNIQUE (screen_id, show_time);

-- CRITICAL CONSTRAINT #1: Absolutely prevents double bookings 
ALTER TABLE booking_seat
    ADD CONSTRAINT uq_bookingseat_show_seat UNIQUE (show_id, screen_id, seat_number);

-- ==========================================
-- 3. CHECK CONSTRAINTS
-- ==========================================
ALTER TABLE movie
    ADD CONSTRAINT chk_movie_duration CHECK (duration_mins > 0),
    ADD CONSTRAINT chk_movie_release CHECK (release_date <= CURRENT_DATE);

ALTER TABLE screen
    ADD CONSTRAINT chk_screen_capacity CHECK (total_capacity > 0);

ALTER TABLE show
    ADD CONSTRAINT chk_show_price CHECK (base_price > 0);

ALTER TABLE booking
    ADD CONSTRAINT chk_booking_total CHECK (total_amount >= 0);