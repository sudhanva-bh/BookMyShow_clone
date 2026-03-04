SELECT COUNT(*) as total_seats, SUM(CASE WHEN is_booked THEN 1 ELSE 0 END) as booked_seats
FROM seats WHERE show_id = :show_id;
