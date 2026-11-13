-- Optimasi pengambilan dan pengurutan laporan berdasarkan urgensi
-- Hasil profiling: Execution Time 7,318 ms -> 5,265 ms
-- Pengujian awal menggunakan 5.000 laporan dummy

CREATE INDEX IF NOT EXISTS idx_laporan_urgensi_waktu
ON laporan (
    bobot_urgensi DESC,
    waktu_lapor DESC,
    id_laporan
);