-- AlterTable
ALTER TABLE "schemas" ADD COLUMN     "fallback_providers" JSONB,
ADD COLUMN     "system_prompt" TEXT;
