-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
DELETE FROM booking 
WHERE booking_id = $1;