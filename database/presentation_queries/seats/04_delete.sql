-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
-- Removing a seat from the database
DELETE FROM seat 
WHERE screen_id = 1 AND seat_number = 'H10'
RETURNING *;
