SELECT DISTINCT m.* FROM movies m JOIN shows s ON m.movie_id = s.movie_id
JOIN screens sc ON s.screen_id = sc.screen_id WHERE sc.theatre_id = :theatre_id;
