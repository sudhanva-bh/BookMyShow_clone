UPDATE movie 
SET duration_mins = 150 
WHERE title = 'Inception'
RETURNING *;