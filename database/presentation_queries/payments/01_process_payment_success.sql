BEGIN;

-- 1. Lock the payment row to prevent concurrent processing
SELECT * FROM payment 
WHERE payment_id = 1 
FOR UPDATE;

-- 2. Update payment status to 'Success'
UPDATE payment 
SET status = 'Success' 
WHERE payment_id = 1;

-- 3. Update the associated booking to 'Booked'
UPDATE booking 
SET status = 'Booked' 
WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);

-- 4. Finalize the seats as 'BOOKED'
UPDATE seat 
SET status = 'BOOKED' 
WHERE booking_id = (SELECT booking_id FROM payment WHERE payment_id = 1);

COMMIT;
