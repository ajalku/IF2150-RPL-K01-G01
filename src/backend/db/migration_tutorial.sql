-- Migrasi fitur Tutorial (UC05). Jalankan setelah tabel "pengguna" ada.
-- Aman dijalankan berulang.

-- Menyimpan apakah pengguna sudah melihat atau melewati tutorial.
ALTER TABLE pengguna
    ADD COLUMN IF NOT EXISTS status_tutorial BOOLEAN NOT NULL DEFAULT FALSE;
