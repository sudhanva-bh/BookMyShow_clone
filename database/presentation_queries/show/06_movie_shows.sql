SELECT s.*, t.name, t.city 
FROM show s 
JOIN screen sc ON s.screen_id = sc.screen_id
JOIN theatre t ON sc.theatre_id = t.theatre_id 
WHERE s.movie_id = :movie_id;