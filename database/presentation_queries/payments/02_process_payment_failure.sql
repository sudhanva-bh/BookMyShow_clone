BEGIN;

-- 1. Lock the payment row
SELECT * FROM payment 
WHERE payment_id = 1 
FOR UPDATE;

-- 2. Update payment status to 'Failed'
UPDATE payment 
SET status = 'Failed' 
WHERE payment_id = 1;

-- 3. Update the associated booking to 'Cancelled'
UPDATE booking 
SET status = 'Cancelled' 
WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);

-- 4. Release the seats back into the pool
UPDATE seat 
SET status = 'UNBOOKED', booking_id = NULL 
WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);

COMMIT;
