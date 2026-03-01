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

-- 4. SEED DATA: SCREENS (Requires Theatre ID)
-- We assume IDs 1, 2, 3, 4 are generated for the theatres above
INSERT INTO screen (theatre_id, screen_name, total_capacity) VALUES
(1, 'Screen 1', 100),
(1, 'Screen 2', 120),
(2, 'IMAX Large', 250),
(3, 'Audi 1', 150),
(4, 'Main Screen', 200);

-- 5. SEED DATA: SEATS (Requires Screen ID)
-- Adding seats for AMB Cinemas - Screen 1 (ID: 1)
INSERT INTO seat (screen_id, seat_number, seat_type) VALUES
(1, 'A1', 'Regular'), (1, 'A2', 'Regular'), (1, 'A3', 'Regular'),
(1, 'B1', 'Premium'), (1, 'B2', 'Premium'), (1, 'J1', 'VIP');

-- Adding seats for Prasads Multiplex - IMAX (ID: 3)
INSERT INTO seat (screen_id, seat_number, seat_type) VALUES
(3, 'A1', 'Regular'), (3, 'A2', 'Regular'), (3, 'A3', 'Regular'),
(3, 'M1', 'Premium'), (3, 'M2', 'Premium'), (3, 'S1', 'VIP');