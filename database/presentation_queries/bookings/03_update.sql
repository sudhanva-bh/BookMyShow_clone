-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
UPDATE booking 
SET status = $1 
WHERE booking_id = $2;