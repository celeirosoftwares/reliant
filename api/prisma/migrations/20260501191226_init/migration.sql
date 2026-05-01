-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schemas" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "safe_fallback" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_api_key_key" ON "projects"("api_key");

-- CreateIndex
CREATE INDEX "schemas_project_id_slug_idx" ON "schemas"("project_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "schemas_project_id_slug_version_key" ON "schemas"("project_id", "slug", "version");

-- CreateIndex
CREATE INDEX "executions_project_id_created_at_idx" ON "executions"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "executions_project_id_status_idx" ON "executions"("project_id", "status");

-- CreateIndex
CREATE INDEX "executions_schema_id_idx" ON "executions"("schema_id");

-- AddForeignKey
ALTER TABLE "schemas" ADD CONSTRAINT "schemas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_schema_id_fkey" FOREIGN KEY ("schema_id") REFERENCES "schemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
