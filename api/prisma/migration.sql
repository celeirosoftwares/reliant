-- Reliant MVP — Database Schema
-- Generated from Prisma schema for Supabase PostgreSQL

-- Projects table
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "projects_api_key_key" ON "projects"("api_key");

-- Schemas table
CREATE TABLE IF NOT EXISTS "schemas" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "safe_fallback" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "schemas_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "schemas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "schemas_project_id_slug_version_key" ON "schemas"("project_id", "slug", "version");
CREATE INDEX IF NOT EXISTS "schemas_project_id_slug_idx" ON "schemas"("project_id", "slug");

-- Executions table
CREATE TABLE IF NOT EXISTS "executions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "project_id" TEXT NOT NULL,
    "schema_id" TEXT,
    "schema_version" INTEGER,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "latency_ms" INTEGER NOT NULL,
    "tokens_used" INTEGER,
    "input_prompt" TEXT NOT NULL,
    "output" JSONB,
    "validation_errors" JSONB,
    "error_message" TEXT,
    "retry_log" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "executions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "executions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "executions_schema_id_fkey" FOREIGN KEY ("schema_id") REFERENCES "schemas"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "executions_project_id_created_at_idx" ON "executions"("project_id", "created_at");
CREATE INDEX IF NOT EXISTS "executions_project_id_status_idx" ON "executions"("project_id", "status");
CREATE INDEX IF NOT EXISTS "executions_schema_id_idx" ON "executions"("schema_id");
