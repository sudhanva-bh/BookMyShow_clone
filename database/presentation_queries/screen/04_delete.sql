UPDATE screen 
SET rows = 15, cols = 25 
WHERE screen_id = 1
RETURNING *;