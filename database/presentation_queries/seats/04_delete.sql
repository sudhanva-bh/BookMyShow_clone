-- Removing a seat from the database
DELETE FROM seat 
WHERE screen_id = 1 AND seat_number = 'H10'
RETURNING *;
