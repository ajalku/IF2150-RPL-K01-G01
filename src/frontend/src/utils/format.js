export const STATUS_LAPORAN = ["DITERIMA", "TERVERIFIKASI", "DIPROSES", "SELESAI"];

export const LABEL_STATUS = {
  BELUM_DILIHAT: "Belum dilihat",
  DILIHAT: "Sedang ditinjau",
  DIPERBAIKI: "Sedang diperbaiki",
  SELESAI: "Selesai",
};
export const WARNA_STATUS = {
  DITERIMA: "#6b7f89",
  TERVERIFIKASI: "#1d6fa5",
  DIPROSES: "#d99a1b",
  SELESAI: "#1f9d63",
};
export const LABEL_TINGKAT = { RENDAH: "Urgensi rendah", SEDANG: "Urgensi sedang", TINGGI: "Urgensi tinggi" };
export const LABEL_VALIDASI = {
  BELUM_DIPERIKSA: "Menunggu pemeriksaan",
  VALID: "Valid",
  TIDAK_VALID: "Tidak valid",
};

// Kategori adalah teks bebas di backend; "Lainnya" membuka kolom isian sendiri
export const KATEGORI = ["Jalan", "Penerangan", "Sampah", "Drainase", "Fasilitas Umum", "Taman"];

const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
const SATUAN = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];

export function waktuRelatif(iso) {
  const selisih = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  for (const [nama, detik] of SATUAN) {
    if (Math.abs(selisih) >= detik) return rtf.format(Math.round(selisih / detik), nama);
  }
  return "baru saja";
}

export const tanggal = (iso) =>
  new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

export const formatJarak = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;
