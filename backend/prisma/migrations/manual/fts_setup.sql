ALTER TABLE tasks ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE tasks SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''));
CREATE INDEX IF NOT EXISTS idx_tasks_fts ON tasks USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_tasks_metadata ON tasks USING GIN(metadata);

CREATE OR REPLACE FUNCTION update_task_search_vector()
RETURNS TRIGGER AS $BODY$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,'')
  );
  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER task_search_vector_update
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_task_search_vector();
