CREATE EXTENSION IF NOT EXISTS btree_gist;

-- FOREIGN KEYS
ALTER TABLE screen
    ADD CONSTRAINT fk_screen_theatre FOREIGN KEY (theatre_id) REFERENCES theatre(theatre_id) ON DELETE CASCADE;

ALTER TABLE show
    ADD CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_show_screen FOREIGN KEY (screen_id) REFERENCES screen(screen_id) ON DELETE CASCADE;

ALTER TABLE booking
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_booking_show FOREIGN KEY (show_id) REFERENCES show(show_id) ON DELETE CASCADE;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE;

ALTER TABLE seat
    ADD CONSTRAINT fk_seat_show FOREIGN KEY (show_id) REFERENCES show(show_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_seat_screen FOREIGN KEY (screen_id) REFERENCES screen(screen_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_seat_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE SET NULL;

-- UNIQUE & EXCLUSION CONSTRAINTS
ALTER TABLE "user"
    ADD CONSTRAINT uq_user_email UNIQUE (email),
    ADD CONSTRAINT uq_user_phone UNIQUE (phone);

ALTER TABLE theatre
    ADD CONSTRAINT uq_theatre_name_city UNIQUE (name, city);

ALTER TABLE screen
    ADD CONSTRAINT uq_screen_theatre_name UNIQUE (theatre_id, screen_name);

-- Time overlapping check: prevents shows from overlapping in a 3 hour block on the same screen
ALTER TABLE show
    ADD CONSTRAINT excl_show_screen_time 
    EXCLUDE USING gist (
        screen_id WITH =,
        tsrange(show_time, show_time + INTERVAL '3 hours') WITH &&
    );

ALTER TABLE seat
    ADD CONSTRAINT uq_seat_show_number UNIQUE (show_id, seat_number);

-- CHECK CONSTRAINTS
ALTER TABLE movie
    ADD CONSTRAINT chk_movie_duration CHECK (duration_mins > 0),
    ADD CONSTRAINT chk_movie_release CHECK (release_date <= CURRENT_DATE);

ALTER TABLE show
    ADD CONSTRAINT chk_show_price CHECK (seat_price > 0);

ALTER TABLE booking
    ADD CONSTRAINT chk_booking_total CHECK (total_amount >= 0);