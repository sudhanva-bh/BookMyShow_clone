SELECT s.show_id, COUNT(bs.seat_id) * 100.0 / (SELECT COUNT(*) FROM seats WHERE screen_id = s.screen_id) as occupancy_rate
FROM shows s LEFT JOIN booking_seats bs ON s.show_id = bs.show_id
GROUP BY s.show_id;
