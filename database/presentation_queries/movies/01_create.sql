INSERT INTO movie (title, language, duration_mins, release_date, certificate) 
VALUES ('Inception', 'English', 148, '2010-07-16', 'UA')
RETURNING *;