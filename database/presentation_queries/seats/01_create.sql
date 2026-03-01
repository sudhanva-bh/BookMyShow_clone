-- Inserting a new VIP seat for Screen 1
INSERT INTO seat (screen_id, seat_number, seat_type) 
VALUES (1, 'H10', 'VIP')
RETURNING *;