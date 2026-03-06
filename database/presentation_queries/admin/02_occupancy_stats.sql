SELECT s.show_id, 
       COUNT(st.seat_id) FILTER (WHERE st.status IN ('BOOKED', 'PROCESSING')) * 100.0 / 
       NULLIF((SELECT COUNT(*) FROM seat WHERE screen_id = s.screen_id), 0) as occupancy_rate
FROM show s 
LEFT JOIN seat st ON s.show_id = st.show_id
GROUP BY s.show_id, s.screen_id;