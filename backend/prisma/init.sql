-- init.sql: Runs on database creation via Docker entrypoint
-- Extensions and base setup for SaaSFlow

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for fuzzy text matching (optional enhancement)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
