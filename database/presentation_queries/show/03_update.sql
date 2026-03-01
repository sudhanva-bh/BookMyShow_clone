UPDATE show 
SET base_price = 350.00 
WHERE show_id = 1
RETURNING *;