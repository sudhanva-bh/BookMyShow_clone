INSERT INTO screen (theatre_id, screen_name, total_capacity) 
VALUES (1, 'Screen 1', 150)
RETURNING *;