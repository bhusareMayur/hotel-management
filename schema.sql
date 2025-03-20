-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS hotelRooms;
CREATE DATABASE hotelRooms;
USE hotelRooms;

-- Create rooms table
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  room_type ENUM('Single', 'Double', 'Suite', 'Deluxe') NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_occupancy INT NOT NULL,
  description TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(100) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Confirmed', 'Checked-in', 'Checked-out', 'Cancelled') DEFAULT 'Confirmed',
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Insert sample room data
INSERT INTO rooms (room_number, room_type, price_per_night, max_occupancy, description) VALUES
('101', 'Single', 99.99, 1, 'Cozy single room with city view'),
('102', 'Single', 99.99, 1, 'Comfortable single room with garden view'),
('103', 'Single', 99.99, 1, 'Quiet single room near the elevator'),
('104', 'Single', 105.99, 1, 'Modern single room with free breakfast'),
('105', 'Single', 95.99, 1, 'Budget single room with basic amenities'),
('201', 'Double', 149.99, 2, 'Spacious double room with queen bed'),
('202', 'Double', 149.99, 2, 'Modern double room with two single beds'),
('203', 'Double', 159.99, 2, 'Double room with balcony and city view'),
('204', 'Double', 155.99, 2, 'Double room with kitchenette and garden view'),
('205', 'Double', 139.99, 2, 'Cozy double room with en-suite bathroom'),
('301', 'Suite', 249.99, 4, 'Luxury suite with separate living area'),
('302', 'Suite', 269.99, 4, 'Premium suite with sea view and living room'),
('303', 'Suite', 279.99, 4, 'Executive suite with modern decor and jacuzzi'),
('304', 'Suite', 259.99, 4, 'Family suite with two bedrooms and dining area'),
('305', 'Suite', 289.99, 4, 'Presidential suite with private pool'),
('401', 'Deluxe', 349.99, 2, 'Premium deluxe room with panoramic view and jacuzzi'),
('402', 'Deluxe', 329.99, 2, 'Deluxe room with king bed and ocean view'),
('403', 'Deluxe', 359.99, 2, 'Deluxe room with private terrace and hot tub'),
('404', 'Deluxe', 339.99, 2, 'Spacious deluxe room with garden view and lounge area'),
('405', 'Deluxe', 369.99, 2, 'Deluxe room with personalized concierge service'),
('501', 'Single', 109.99, 1, 'Single room with modern furnishings and smart TV'),
('502', 'Single', 119.99, 1, 'Single room with complimentary gym access'),
('503', 'Single', 99.99, 1, 'Compact single room with workspace and fast Wi-Fi'),
('504', 'Single', 89.99, 1, 'Single room with access to rooftop garden'),
('505', 'Single', 99.99, 1, 'Comfortable single room with close proximity to lobby'),
('601', 'Double', 149.99, 2, 'Double room with stylish decor and comfortable bedding'),
('602', 'Double', 159.99, 2, 'Double room with partial sea view and modern amenities'),
('603', 'Double', 169.99, 2, 'Double room with balcony and private seating area'),
('604', 'Double', 139.99, 2, 'Cozy double room with high-speed Wi-Fi'),
('605', 'Double', 159.99, 2, 'Double room with garden-facing windows and luxury bedding'),
('701', 'Suite', 249.99, 4, 'Suite with large windows and spectacular views'),
('702', 'Suite', 259.99, 4, 'Luxury suite with personal butler service'),
('703', 'Suite', 269.99, 4, 'Suite with separate bedroom, dining, and living area'),
('704', 'Suite', 279.99, 4, 'Executive suite with complimentary minibar and lounge access'),
('705', 'Suite', 299.99, 4, 'Presidential suite with exclusive amenities and VIP treatment'),
('801', 'Deluxe', 349.99, 2, 'Deluxe room with marble bathroom and spa access'),
('802', 'Deluxe', 359.99, 2, 'Deluxe room with private fireplace and outdoor seating area'),
('803', 'Deluxe', 369.99, 2, 'Deluxe room with floor-to-ceiling windows and scenic view'),
('804', 'Deluxe', 379.99, 2, 'Deluxe room with custom furniture and premium bedding'),
('805', 'Deluxe', 389.99, 2, 'Exclusive deluxe room with 24-hour room service'),
('901', 'Single', 109.99, 1, 'Single room with mountain view and en-suite bathroom'),
('902', 'Single', 119.99, 1, 'Single room with coffee maker and work desk'),
('903', 'Single', 99.99, 1, 'Single room with fast Wi-Fi and flat-screen TV'),
('904', 'Single', 105.99, 1, 'Single room with complimentary toiletries and slippers'),
('905', 'Single', 95.99, 1, 'Single room with access to business lounge'),
('1001', 'Double', 169.99, 2, 'Double room with large windows and stylish furnishings'),
('1002', 'Double', 159.99, 2, 'Double room with balcony and partial garden view'),
('1003', 'Double', 149.99, 2, 'Double room with smart TV and rainfall shower'),
('1004', 'Double', 139.99, 2, 'Double room with comfortable bedding and cozy lighting'),
('1005', 'Double', 159.99, 2, 'Double room with private balcony and outdoor furniture');


-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert an admin user (password: admin123, hashed using bcrypt)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@hotel.com', '$2a$10$7JXxGnc2GUEGuRcCYZF8s.q3MrEKvNZCcWQPXLpUQcXQ3RGP8X5Py', 'admin');
