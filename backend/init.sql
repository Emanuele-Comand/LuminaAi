CREATE EXTESNION IF NOT EXISTS "uuid-ossp";

-- User table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Convos table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Messages table 
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}',
);

-- INDEXES

-- Indexes to create messages on conversation_id
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id,
ON messages(created_at);

-- Indexes ti sort messages by created_at
CREATE INDEX IF NOT EXISTS idx_messages_created_at,
ON messages(created_at);

-- Indexes to search conversations by user_id
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
ON conversations(user_id);

-- Indexes to sort convos by updated_at
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at
ON conversations(updated_at);

-- Indexes to search full-text messages
CREATE INDEX IF NOT EXISTS idx_messages_content_fts
ON messages USING GIN(to_tsvector('english', content));

-- TIMESTAMP UPDATE TRIGGERS

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN 
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Convos trigger
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- USER PERMISSIONS

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lumina_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lumina_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO lumina_user;

-- CONFIRMATION MESSAGES

DO $$
BEGIN
    RAISE NOTICE 'Lumina database initialized successfully!';
    RAISE NOTICE 'Tables created: users, conversations, messages';
    RAISE NOTICE 'Indexes created for performance optimization';
    RAISE NOTICE 'Triggers configured to update timestamp';
END $$;