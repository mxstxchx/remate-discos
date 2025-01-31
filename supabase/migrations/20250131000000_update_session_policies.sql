-- Drop existing policy
DROP POLICY IF EXISTS "User sessions are insertable by anyone" ON user_sessions;

-- Create separate policies for regular and admin sessions
CREATE POLICY "Allow regular session creation"
  ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (
    NOT is_admin
  );

CREATE POLICY "Allow admin session creation with verification"
  ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (
    is_admin AND 
    EXISTS (
      SELECT 1 FROM admin_allowlist 
      WHERE alias = NEW.alias
    )
  );

-- Create audit logging trigger
CREATE OR REPLACE FUNCTION log_session_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO session_audit_log (
    session_id,
    alias,
    is_admin,
    action,
    created_at
  ) VALUES (
    NEW.id,
    NEW.alias,
    NEW.is_admin,
    'created',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_creation_audit
  AFTER INSERT ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION log_session_creation();