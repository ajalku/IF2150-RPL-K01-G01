-- Skema untuk fitur Laporan & Lokasi (RAWAT)
-- Jalankan SETELAH tabel "pengguna" sudah ada.
--
-- PENTING: tipe kolom id_pengguna di bawah (INTEGER) harus SAMA dengan tipe
-- pengguna.id_pengguna di database Anda. Cek dengan:
--   SELECT data_type FROM information_schema.columns
--   WHERE table_name = 'pengguna' AND column_name = 'id_pengguna';
-- Jika hasilnya "uuid", ganti INTEGER menjadi UUID. Jika "bigint", ganti BIGINT.

CREATE TABLE IF NOT EXISTS laporan (
    id_laporan            UUID PRIMARY KEY,
    id_pengguna           INTEGER NOT NULL
                              REFERENCES pengguna(id_pengguna) ON DELETE CASCADE,
    nama_masalah          VARCHAR(150) NOT NULL,
    kategori              VARCHAR(50)  NOT NULL,
    tingkat_permasalahan  VARCHAR(10)  NOT NULL
                              CHECK (tingkat_permasalahan IN ('RENDAH', 'SEDANG', 'TINGGI')),
    status_privasi        VARCHAR(10)  NOT NULL
                              CHECK (status_privasi IN ('PUBLIK', 'ANONIM')),
    foto                  VARCHAR(100),               -- nama file di uploads/laporan/
    deskripsi             TEXT,
    status_laporan        VARCHAR(15)  NOT NULL DEFAULT 'BELUM_DILIHAT'
                              CHECK (status_laporan IN ('BELUM_DILIHAT', 'DILIHAT', 'DIPERBAIKI', 'SELESAI')),
    status_validasi       VARCHAR(15)  NOT NULL DEFAULT 'BELUM_DIPERIKSA'
                              CHECK (status_validasi IN ('BELUM_DIPERIKSA', 'VALID', 'TIDAK_VALID')),
    catatan_pemeriksaan   TEXT,
    bobot_urgensi         REAL         NOT NULL,
    jumlah_upvote         INTEGER      NOT NULL DEFAULT 0 CHECK (jumlah_upvote >= 0),
    skor_populer          REAL         NOT NULL DEFAULT 0,
    batas_waktu           TIMESTAMPTZ,                -- diisi saat laporan dinyatakan TIDAK_VALID
    waktu_lapor           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    waktu_diperbarui      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Satu laporan punya satu lokasi. Jika laporan dihapus, lokasinya ikut terhapus.
CREATE TABLE IF NOT EXISTS lokasi (
    id_lokasi   SERIAL PRIMARY KEY,
    id_laporan  UUID NOT NULL UNIQUE REFERENCES laporan(id_laporan) ON DELETE CASCADE,
    latitude    DOUBLE PRECISION NOT NULL CHECK (latitude  BETWEEN  -90 AND  90),
    longitude   DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    alamat      TEXT
);

CREATE INDEX IF NOT EXISTS idx_laporan_pengguna     ON laporan (id_pengguna);
CREATE INDEX IF NOT EXISTS idx_laporan_waktu        ON laporan (waktu_lapor DESC);
CREATE INDEX IF NOT EXISTS idx_laporan_populer      ON laporan (skor_populer DESC);
CREATE INDEX IF NOT EXISTS idx_laporan_kadaluarsa   ON laporan (batas_waktu)
    WHERE status_validasi = 'TIDAK_VALID';
CREATE INDEX IF NOT EXISTS idx_lokasi_koordinat     ON lokasi (latitude, longitude);
