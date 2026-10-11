CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('mentee', 'mentor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'blocked', 'pending');
CREATE TYPE mentor_approval AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE mentoring_status AS ENUM ('pending', 'approved', 'in_progress', 'completed', 'cancelled');
CREATE TYPE conversation_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE bookkeeping_type AS ENUM ('income', 'expense');
CREATE TYPE audit_status AS ENUM ('success', 'failure');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'mentee',
  status user_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE TABLE mentee_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(150),
  business_category VARCHAR(100),
  phone_number VARCHAR(30),
  bio TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mentor_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  expertise_topic TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  availability_status BOOLEAN NOT NULL DEFAULT true,
  approval_status mentor_approval NOT NULL DEFAULT 'pending',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mentor_profiles_approval ON mentor_profiles(approval_status, availability_status);

CREATE TABLE mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status mentoring_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (mentee_id <> mentor_id)
);
CREATE INDEX idx_sessions_mentee_schedule ON mentoring_sessions(mentee_id, scheduled_at DESC);
CREATE INDEX idx_sessions_mentor_schedule ON mentoring_sessions(mentor_id, scheduled_at DESC);
CREATE INDEX idx_sessions_status_schedule ON mentoring_sessions(status, scheduled_at);

CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status conversation_status NOT NULL DEFAULT 'active',
  summary TEXT,
  last_message_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (mentee_id <> mentor_id)
);
CREATE UNIQUE INDEX uq_active_conversation_pair ON chat_conversations(mentee_id, mentor_id) WHERE status='active';
CREATE INDEX idx_conversation_mentee_updated ON chat_conversations(mentee_id, updated_at DESC);
CREATE INDEX idx_conversation_mentor_updated ON chat_conversations(mentor_id, updated_at DESC);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  message_text TEXT NOT NULL CHECK (length(message_text) BETWEEN 1 AND 5000),
  attachment_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (sender_id <> receiver_id)
);
CREATE INDEX idx_messages_conversation_created ON chat_messages(conversation_id, created_at);
CREATE INDEX idx_messages_receiver_unread ON chat_messages(receiver_id, read_at) WHERE read_at IS NULL;

CREATE TABLE bookkeeping_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type bookkeeping_type NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  description VARCHAR(500) NOT NULL,
  transaction_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookkeeping_owner_date ON bookkeeping_records(mentee_id, transaction_date DESC);
CREATE INDEX idx_bookkeeping_owner_type_date ON bookkeeping_records(mentee_id, type, transaction_date DESC);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_modules_published_created ON modules(is_published, created_at DESC);

CREATE TABLE module_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  event VARCHAR(30) NOT NULL CHECK (event IN ('view', 'download')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_module_access_user_created ON module_access_logs(user_id, created_at DESC);

CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  role user_role,
  action VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  ip_address INET,
  user_agent VARCHAR(500),
  status audit_status NOT NULL DEFAULT 'success',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_role_action_created ON activity_logs(role, action, created_at DESC);
CREATE INDEX idx_activity_user_created ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_metadata_gin ON activity_logs USING GIN(metadata);

-- Keep updated_at consistent for tables that expose it.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_mentee_profiles_updated BEFORE UPDATE ON mentee_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_mentor_profiles_updated BEFORE UPDATE ON mentor_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_sessions_updated BEFORE UPDATE ON mentoring_sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_conversations_updated BEFORE UPDATE ON chat_conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookkeeping_updated BEFORE UPDATE ON bookkeeping_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
