-- Tabel session untuk connect-pg-simple (tableName: user_sessions).
-- Jalankan sebelum backend; akun aplikasi hanya memerlukan hak DML pada tabel ini.
CREATE TABLE IF NOT EXISTS user_sessions (
    sid VARCHAR NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_sessions_pkey PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_expire
    ON user_sessions (expire);
