SELECT s.* FROM show s 
JOIN screen sc ON s.screen_id = sc.screen_id
JOIN theatre t ON sc.theatre_id = t.theatre_id 
WHERE t.city = :city;