DELETE FROM theatre 
WHERE name = 'Asian Shiva Shakti' AND city = 'Hyderabad'
RETURNING *;