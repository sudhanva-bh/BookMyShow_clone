-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
-- View all seats assigned to a specific screen
SELECT screen_id, seat_number, status 
FROM seat 
WHERE screen_id = 1
ORDER BY seat_number;
