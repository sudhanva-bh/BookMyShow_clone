DELETE FROM "user" 
WHERE email = 'email@example.com'
RETURNING *;