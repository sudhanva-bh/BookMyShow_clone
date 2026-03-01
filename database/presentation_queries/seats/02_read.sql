-- View all seats assigned to a specific screen (e.g., Screen 1)
SELECT screen_id, seat_number, seat_type 
FROM seat 
WHERE screen_id = 1
ORDER BY seat_number;