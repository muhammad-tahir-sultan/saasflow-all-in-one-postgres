CREATE OR REPLACE FUNCTION notify_task_change()
RETURNS TRIGGER AS $BODY$
BEGIN
  PERFORM pg_notify('task_events', json_build_object(
    'event', TG_OP,
    'task_id', NEW.id,
    'organization_id', NEW.organization_id,
    'title', NEW.title
  )::text);
  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER task_change_notify
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_change();
