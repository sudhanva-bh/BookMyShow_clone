SELECT m.movie_id, SUM(p.amount) as total_revenue
FROM movie m 
JOIN show s ON m.movie_id = s.movie_id
JOIN booking b ON s.show_id = b.show_id
JOIN payment p ON b.booking_id = p.booking_id
WHERE m.movie_id = :movie_id AND p.status = 'Success' 
GROUP BY m.movie_id;