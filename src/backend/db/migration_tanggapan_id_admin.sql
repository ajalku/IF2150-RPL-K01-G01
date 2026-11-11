-- C06 - Tanggapan: catat admin penanggap tanpa menghapus tanggapan lama.
ALTER TABLE tanggapan
    ADD COLUMN IF NOT EXISTS id_admin UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_tanggapan_id_admin'
          AND conrelid = 'tanggapan'::regclass
    ) THEN
        ALTER TABLE tanggapan
            ADD CONSTRAINT fk_tanggapan_id_admin
            FOREIGN KEY (id_admin)
            REFERENCES pengguna(id_pengguna)
            ON DELETE SET NULL;
    END IF;
END
$$;
