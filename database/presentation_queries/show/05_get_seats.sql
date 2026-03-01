-- Fetch all seats and their availability status for a specific show
SELECT seat_id, seat_number, status, screen_id 
FROM seat 
WHERE show_id = 1
ORDER BY seat_number ASC;
