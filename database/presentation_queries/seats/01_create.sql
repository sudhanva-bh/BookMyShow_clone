-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
-- Inserting a new VIP seat for Screen 1
INSERT INTO seat (screen_id, show_id, seat_number, status) 
VALUES (1, 1, 'H10', 'UNBOOKED')
RETURNING *;
