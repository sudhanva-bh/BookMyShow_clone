UPDATE theatre 
SET location = 'Secunderabad' 
WHERE name = 'Asian Shiva Shakti' AND city = 'Hyderabad'
RETURNING *;
