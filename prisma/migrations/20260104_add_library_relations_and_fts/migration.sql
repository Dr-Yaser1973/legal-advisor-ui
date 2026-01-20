-- Enable extensions (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ===== Relations & FAQ tables (if Prisma migration already creates them, this is still fine if you keep one source of truth)
-- NOTE: If you're using Prisma migrate, Prisma will create tables.
-- Keep this SQL for FTS indexes + optional helpers.

-- ===== Full-Text Search index on LawDoc content/title (adjust column names if needed)
-- Assumptions (common in your project):
-- LawDoc has columns: title (text/varchar), content/text (text), section/category enum
-- If your LawDoc uses "text" instead of "content", edit below accordingly.

DO $$
BEGIN
  -- Create GIN index for fast full-text search over Arabic/English.
  -- Using 'simple' config is often better for Arabic than 'english' to avoid stemming issues.
  EXECUTE 'CREATE INDEX IF NOT EXISTS "LawDoc_fts_gin" ON "LawDoc"
           USING GIN (to_tsvector(''simple'', coalesce("title",'''') || '' '' || coalesce("content",'''')));';
EXCEPTION WHEN undefined_column THEN
  -- fallback if column name differs (e.g., "text")
  BEGIN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "LawDoc_fts_gin" ON "LawDoc"
             USING GIN (to_tsvector(''simple'', coalesce("title",'''') || '' '' || coalesce("text",'''')));';
  EXCEPTION WHEN OTHERS THEN
    -- ignore; you can adjust manually
  END;
END $$;

-- Optional: trigram index for partial matches on title (good UX)
DO $$
BEGIN
  EXECUTE 'CREATE INDEX IF NOT EXISTS "LawDoc_title_trgm" ON "LawDoc"
           USING GIN ("title" gin_trgm_ops);';
EXCEPTION WHEN undefined_column THEN
  -- ignore if title doesn't exist
END $$;

