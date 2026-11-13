-- Migrasi fitur Upvote (UC06). Jalankan setelah tabel "pengguna" dan "laporan" (schema_laporan.sql) ada.
-- Aman dijalankan berulang (IF NOT EXISTS).

-- Satu pengguna hanya boleh mendukung satu laporan satu kali.
CREATE TABLE IF NOT EXISTS upvote (
    id_pengguna   UUID        NOT NULL REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    id_laporan    UUID        NOT NULL REFERENCES laporan(id_laporan)   ON DELETE CASCADE,
    waktu_upvote  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status_upvote BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_pengguna, id_laporan)
);

-- Mencari upvote per laporan (mis. menghitung ulang jumlah_upvote)
CREATE INDEX IF NOT EXISTS idx_upvote_laporan ON upvote (id_laporan);
