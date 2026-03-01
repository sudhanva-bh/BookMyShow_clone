INSERT INTO show (movie_id, screen_id, show_time, seat_price) 
VALUES (1, 1, '2026-03-05 14:30:00', 250.00)
RETURNING *;
