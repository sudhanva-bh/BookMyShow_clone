UPDATE "user" 
SET phone = '9999999999' 
WHERE email = 'email@example.com'
RETURNING *;
