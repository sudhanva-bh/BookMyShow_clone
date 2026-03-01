DELETE FROM movie 
WHERE title = 'Inception'
RETURNING *;
