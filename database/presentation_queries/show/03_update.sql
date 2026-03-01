UPDATE show 
SET seat_price = 350.00 
WHERE show_id = 1
RETURNING *;
