-- C06 - Tanggapan
-- Jalankan setelah skema laporan dibuat.
CREATE TABLE IF NOT EXISTS tanggapan (
    id_tanggapan        BIGSERIAL PRIMARY KEY,
    id_laporan          UUID NOT NULL
                            REFERENCES laporan(id_laporan) ON DELETE CASCADE,
    status_tanggapan    BOOLEAN NOT NULL,
    waktu_tanggapan     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deskripsi_tanggapan TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_tanggapan_laporan_waktu
    ON tanggapan (id_laporan, waktu_tanggapan DESC);
