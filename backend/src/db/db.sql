-- Active: 1729875021501@@127.0.0.1@5432@postgres
-- Connect to the default database to create a new database


-- Create the table with the specified fields
CREATE TABLE IF NOT EXISTS job_listings (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
	title TEXT NOT NULL,
	company TEXT NOT NULL,
    description TEXT NOT NULL,
    response TEXT,
    apply BOOLEAN,
    applied BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
