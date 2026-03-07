-- Postgres initialization script
-- Runs once when the container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test database for CI (separate from dev)
CREATE DATABASE nexusplay_test;
GRANT ALL PRIVILEGES ON DATABASE nexusplay_test TO nexusplay;
