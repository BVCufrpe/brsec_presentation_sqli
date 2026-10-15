-- 1. Create Database and User
CREATE DATABASE IF NOT EXISTS inj_sandbox;
CREATE OR REPLACE USER 'username'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON inj_sandbox.* TO 'username'@'localhost';
FLUSH PRIVILEGES;

USE inj_sandbox;

-- 2. Drop existing tables for a clean reset
DROP TABLE IF EXISTS user_courses;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE courses (
    uuid CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    isFree BOOLEAN DEFAULT FALSE,
    img_uri VARCHAR(255) DEFAULT '/next.svg',
    `users` INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE users (
    uuid CHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_courses (
    user_uuid CHAR(36),
    course_uuid CHAR(36),
    grantedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_uuid, course_uuid),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (course_uuid) REFERENCES courses(uuid) ON DELETE CASCADE
);

-- 4. Insert Data
INSERT INTO users (uuid, username, password, isAdmin) VALUES
(UUID(), 'admin', 'admin', TRUE),
(UUID(), 'myuser123', '123456', FALSE);
INSERT INTO courses (uuid, name, description, price, isFree, img_uri) VALUES
(UUID(), 'Intro to Algorithms', 'Learn the basics of sorting and searching.', 0.00, TRUE, '/algorithms.svg'),
(UUID(), 'Linux for Beginners', 'Master the command line and basic system administration.', 0.00, TRUE, '/gemini-svg (1).svg'),
(UUID(), 'Git & GitHub Basics', 'Version control essentials for every developer.', 0.00, TRUE, '/gemini-svg (2).svg'),
(UUID(), 'Advanced Data Structures', 'Trees, Graphs, and Hash Maps explained in depth.', 199.99, FALSE, '/gemini-svg (3).svg'),
(UUID(), 'Mastering Database Security', 'How to prevent SQL Injections and other attacks.', 899.00, FALSE, '/gemini-svg (4).svg'),
(UUID(), 'React Zero to Hero', 'Build modern web applications with React.', 149.50, FALSE, '/gemini-svg (5).svg'),
(UUID(), 'NestJS Backend Architecture', 'Scalable Node.js applications with NestJS.', 249.99, FALSE, '/gemini-svg (6).svg'),
(UUID(), 'Python for Data Science', 'Data analysis with Pandas, NumPy, and visualization tools.', 299.00, FALSE, '/gemini-svg (7).svg'),
(UUID(), 'Docker & Kubernetes', 'Containerization and orchestration for microservices.', 349.00, FALSE, '/gemini-svg (8).svg'),
(UUID(), 'Rust Programming', 'Systems programming with memory safety.', 199.00, FALSE, '/gemini-svg (9).svg');
