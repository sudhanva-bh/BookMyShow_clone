BEGIN;

-- 1. Lock the selected seats for processing to prevent race conditions
SELECT * FROM seat 
WHERE show_id = 1 AND seat_number IN ('A01', 'A02') 
FOR UPDATE;

-- 2. Insert the pending booking record
INSERT INTO booking (user_id, show_id, total_amount, status) 
VALUES (1, 1, 500.00, 'Pending') 
RETURNING booking_id;

-- 3. Update the seats to 'PROCESSING' and assign the new booking_id
-- (Assume the returned booking_id from the previous step is 1)
UPDATE seat 
SET status = 'PROCESSING', booking_id = 1 
WHERE show_id = 1 AND seat_number IN ('A01', 'A02');

-- 4. Initialize the pending payment with a 120-second expiry
INSERT INTO payment (booking_id, amount, status, expires_at) 
VALUES (1, 500.00, 'Pending', CURRENT_TIMESTAMP + INTERVAL '120 seconds');

COMMIT;
