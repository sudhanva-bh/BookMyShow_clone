SELECT DISTINCT m.* FROM movie m 
JOIN show s ON m.movie_id = s.movie_id 
WHERE s.show_time > CURRENT_TIMESTAMP;