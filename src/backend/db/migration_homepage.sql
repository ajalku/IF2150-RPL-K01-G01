-- Indeks untuk Beranda (UC04). Jalankan setelah tabel "laporan" (schema_laporan.sql) ada.
-- Efeknya diukur oleh scripts/profil_homepage.js.

-- Urutan "populer": ORDER BY skor_populer DESC, id_laporan.
-- Indeks lama idx_laporan_populer hanya mencakup skor_populer; indeks gabungan ini
-- memungkinkan urutan langsung dari indeks tanpa sort penuh.
CREATE INDEX IF NOT EXISTS idx_laporan_populer_id ON laporan (skor_populer DESC, id_laporan);

-- Urutan bawaan Beranda (urgensi): ORDER BY bobot_urgensi DESC, id_laporan.
CREATE INDEX IF NOT EXISTS idx_laporan_urgensi_id ON laporan (bobot_urgensi DESC, id_laporan);
