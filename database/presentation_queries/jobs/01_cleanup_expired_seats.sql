-- NOTE: This query does not have a direct 1:1 mapped API endpoint in the current backend.
BEGIN;

-- 1. Identify and update expired pending payments
WITH expired_payments AS (
    UPDATE payment
    SET status = 'Failed'
    WHERE status = 'Pending' AND expires_at < CURRENT_TIMESTAMP
    RETURNING booking_id
),
-- 2. Cancel the associated bookings
cancelled_bookings AS (
    UPDATE booking
    SET status = 'Cancelled'
    WHERE booking_id IN (SELECT booking_id FROM expired_payments)
    RETURNING booking_id
)
-- 3. Free up the seats
UPDATE seat
SET status = 'UNBOOKED', booking_id = NULL
WHERE booking_id IN (SELECT booking_id FROM cancelled_bookings);

COMMIT;
