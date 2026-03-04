SELECT s.* FROM shows s JOIN screens sc ON s.screen_id = sc.screen_id
JOIN theatres t ON sc.theatre_id = t.theatre_id WHERE t.city = :city;
