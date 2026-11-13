CREATE TABLE IF NOT EXISTS pengguna (
    id_pengguna UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hash_password VARCHAR(255) NOT NULL,
    no_telp VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'warga',
    status_izin VARCHAR(20) NOT NULL DEFAULT 'BELUM_DIMINTA',
    status_tutorial BOOLEAN NOT NULL DEFAULT FALSE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    CONSTRAINT chk_pengguna_nik
        CHECK (nik ~ '^[0-9]{16}$'),

    CONSTRAINT chk_pengguna_role
        CHECK (role IN ('warga', 'admin')),

    CONSTRAINT chk_pengguna_status_izin
        CHECK (status_izin IN ('DITERIMA', 'DITOLAK', 'BELUM_DIMINTA'))
);