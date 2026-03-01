-- Changing a specific seat from Regular to Premium
UPDATE seat 
SET seat_type = 'Premium' 
WHERE screen_id = 1 AND seat_number = 'A1'
RETURNING *;