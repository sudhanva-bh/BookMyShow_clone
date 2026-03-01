UPDATE screen 
SET total_capacity = 200 
WHERE screen_id = 1
RETURNING *;