INSERT INTO screen (theatre_id, screen_name, rows, cols) 
VALUES (1, 'Screen 1', 10, 20)
RETURNING *;