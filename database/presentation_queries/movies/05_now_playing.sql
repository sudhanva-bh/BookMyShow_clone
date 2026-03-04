SELECT DISTINCT m.* FROM movies m JOIN shows s ON m.movie_id = s.movie_id WHERE s.start_time > CURRENT_TIMESTAMP;
