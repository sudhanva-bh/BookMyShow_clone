SELECT COUNT(*) as total_seats, 
       SUM(CASE WHEN status IN ('BOOKED', 'PROCESSING') THEN 1 ELSE 0 END) as booked_seats
FROM seat 
WHERE show_id = :show_id;