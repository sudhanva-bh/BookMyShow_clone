-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
-- Changing a specific seat's status
UPDATE seat 
SET status = 'BOOKED' 
WHERE screen_id = 1 AND seat_number = 'A1'
RETURNING *;
