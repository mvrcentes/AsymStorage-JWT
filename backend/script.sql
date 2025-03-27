-- Ejecutar esto primero si no está activa:
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL,
  llave_publica TEXT
);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  content_hash TEXT NOT NULL,
  content TEXT NOT NULL
);