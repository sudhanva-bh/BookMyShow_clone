-- SEED DATA: USERS
INSERT INTO "user" (name, email, phone) VALUES
('Aditya Varma', 'aditya.v@example.com', '9876543201'),
('Priya Reddy', 'priya.reddy@example.com', '9876543202'),
('Karthik Nair', 'karthik.n@example.com', '9876543203'),
('Sneha Rao', 'sneha.rao@example.com', '9876543204'),
('Rahul Sharma', 'rahul.s@example.com', '9876543205'),
('Anjali Desai', 'anjali.d@example.com', '9876543206'),
('Vikram Singh', 'vikram.s@example.com', '9876543207'),
('Neha Gupta', 'neha.g@example.com', '9876543208'),
('Rohan Kapoor', 'rohan.k@example.com', '9876543209'),
('Pooja Joshi', 'pooja.j@example.com', '9876543210');

-- SEED DATA: THEATRES (4 Records)
INSERT INTO theatre (name, location, city) VALUES
('AMB Cinemas', 'Sarath City Capital Mall, Kondapur', 'Hyderabad'),
('Prasads Multiplex', 'NTR Marg, Central Secretariat', 'Hyderabad'),
('PVR Inorbit', 'Inorbit Mall, Cyberabad', 'Hyderabad'),
('Asian Shiva Shakti', 'Kompally Road, Shamirpet', 'Hyderabad');

-- SEED DATA: MOVIES
INSERT INTO movie (title, language, duration_mins, release_date, certificate) VALUES
('Inception', 'English', 148, '2010-07-16', 'UA'),
('Interstellar', 'English', 169, '2014-11-07', 'U'),
('RRR', 'Telugu', 187, '2022-03-25', 'UA'),
('Kalki 2898 AD', 'Telugu', 181, '2024-06-27', 'UA'),
('The Dark Knight', 'English', 152, '2008-07-18', 'UA'),
('Pushpa: The Rise', 'Telugu', 179, '2021-12-17', 'UA'),
('Dangal', 'Hindi', 161, '2016-12-23', 'U'),
('KGF: Chapter 2', 'Kannada', 168, '2022-04-14', 'UA'),
('Parasite', 'Korean', 132, '2019-05-30', 'A'),
('Jawan', 'Hindi', 169, '2023-09-07', 'UA');

-- SEED DATA: SHOWS
INSERT INTO show (movie_id, screen_id, show_time, base_price) VALUES
(1, 1, '2026-03-05 14:30:00', 250.00),
(1, 2, '2026-03-05 18:00:00', 300.00),
(2, 1, '2026-03-05 10:00:00', 200.00);