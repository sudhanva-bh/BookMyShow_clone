SELECT m.movie_id, SUM(p.amount) as total_revenue
FROM movies m JOIN shows s ON m.movie_id = s.movie_id
JOIN bookings b ON s.show_id = b.show_id
JOIN payments p ON b.booking_id = p.booking_id
WHERE m.movie_id = :movie_id AND p.status = 'Success' GROUP BY m.movie_id;
