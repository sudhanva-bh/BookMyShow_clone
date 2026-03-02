-- 1. SEED DATA: USERS (Independent)
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

-- 2. SEED DATA: THEATRES (Independent)
INSERT INTO theatre (name, location, city) VALUES
('AMB Cinemas', 'Sarath City Capital Mall, Kondapur', 'Hyderabad'),
('Prasads Multiplex', 'NTR Marg, Central Secretariat', 'Hyderabad'),
('PVR Inorbit', 'Inorbit Mall, Cyberabad', 'Hyderabad'),
('Asian Shiva Shakti', 'Kompally Road, Shamirpet', 'Hyderabad');

-- 3. SEED DATA: MOVIES (Independent)
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

-- 4. SEED DATA: SCREENS
INSERT INTO screen (theatre_id, screen_name, rows, cols) VALUES
-- Theatre 1: AMB Cinemas (theatre_id = 1)
(1, 'Screen 1', 10, 25),
(1, 'Screen 2', 10, 22),
(1, 'IMAX', 15, 20),

-- Theatre 2: Prasads Multiplex (theatre_id = 2)
(2, 'Screen 1', 14, 20),
(2, 'Screen 2', 10, 20),
(2, 'Screen 3', 10, 18),
(2, 'Large Format', 16, 20),

-- Theatre 3: PVR Inorbit (theatre_id = 3)
(3, 'Screen 1', 10, 21),
(3, 'Screen 2', 10, 19),
(3, 'Screen 3', 10, 17),

-- Theatre 4: Asian Shiva Shakti (theatre_id = 4)
(4, 'Screen 1', 10, 23),
(4, 'Screen 2', 10, 20);