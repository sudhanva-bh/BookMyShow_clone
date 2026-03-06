SELECT DISTINCT m.* FROM movie m 
JOIN show s ON m.movie_id = s.movie_id
JOIN screen sc ON s.screen_id = sc.screen_id 
WHERE sc.theatre_id = :theatre_id;