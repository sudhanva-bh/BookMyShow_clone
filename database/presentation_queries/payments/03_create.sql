INSERT INTO payment (booking_id, amount, status, expires_at) 
VALUES ($1, $2, 'Pending', $3) 
RETURNING payment_id;