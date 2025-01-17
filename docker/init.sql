-- Use template0 for clean initialization
\c postgres;

-- Create database if it doesn't exist
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'url_shortener') THEN
        CREATE DATABASE url_shortener TEMPLATE template0 LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
    END IF;
END
$$;

-- Connect to database
\c url_shortener;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create URL table
CREATE TABLE IF NOT EXISTS public."Url" (
    "id" TEXT PRIMARY KEY,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clicks" INTEGER NOT NULL DEFAULT 0
);

-- Set up proper permissions
ALTER USER postgres WITH PASSWORD 'password';

-- Grant database permissions
GRANT ALL PRIVILEGES ON DATABASE url_shortener TO postgres;

-- Grant schema permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- Grant table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;

-- Create index on shortUrl for faster lookups
CREATE INDEX IF NOT EXISTS "Url_shortUrl_idx" ON public."Url"("shortUrl");

-- Set proper ownership
ALTER TABLE public."Url" OWNER TO postgres;