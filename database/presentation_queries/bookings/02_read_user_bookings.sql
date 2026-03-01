-- Retrieve all bookings for a specific user
SELECT b.booking_id, b.show_id, b.total_amount, b.status, b.booking_time
FROM booking b
WHERE b.user_id = 1
ORDER BY b.booking_time DESC;
