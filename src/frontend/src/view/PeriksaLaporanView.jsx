import { useState } from "react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Memuat } from "../components/Keadaan.jsx";
import { LencanaStatus, LencanaTingkat, LencanaValidasi } from "../components/Lencana.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import { useData } from "../hooks/useData.js";
import { daftarLaporan, periksaLaporan, ubahStatusLaporan } from "../services/laporanService.js";
import { LABEL_STATUS, STATUS_LAPORAN, tanggal } from "../utils/format.js";

const FILTER_VALIDASI = [
  ["BELUM_DIPERIKSA", "Belum diperiksa"], ["VALID", "Valid"], ["TIDAK_VALID", "Tidak valid"], ["", "Semua"],
];

function FormPemeriksaan({ laporan, onSelesai }) {
  const validAwal = laporan.statusValidasi === "VALID" ? "valid" : laporan.statusValidasi === "TIDAK_VALID" ? "tidak" : "";
  const [hasil, setHasil] = useState(validAwal);
  const [catatan, setCatatan] = useState(laporan.catatanPemeriksaan ?? "");
  const [status, setStatus] = useState(laporan.statusLaporan);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");

  const simpan = async () => {
    const validitasBerubah = hasil !== "" && (hasil !== validAwal || catatan.trim() !== (laporan.catatanPemeriksaan ?? ""));
    const statusBerubah = status !== laporan.statusLaporan;
    if (!validitasBerubah && !statusBerubah) {
      setGalat("Belum ada perubahan untuk disimpan.");
      return;
    }
    setSibuk(true);
    setGalat("");
    try {
      if (validitasBerubah) await periksaLaporan(laporan.idLaporan, hasil === "valid", catatan.trim());
      if (statusBerubah) await ubahStatusLaporan(laporan.idLaporan, status);
      onSelesai("Hasil pemeriksaan disimpan.");
    } catch (err) {
      setGalat(err.message);
    } finally {
      setSibuk(false);
    }
  };

  return (
    <div className="rw-form">
      <fieldset className="rw-pilihan">
        <legend>Hasil pemeriksaan</legend>
        <label className={hasil === "valid" ? "dipilih" : ""}>
          <input type="radio" name="hasil" checked={hasil === "valid"} onChange={() => setHasil("valid")} /> Laporan valid
        </label>
        <label className={hasil === "tidak" ? "dipilih" : ""}>
          <input type="radio" name="hasil" checked={hasil === "tidak"} onChange={() => setHasil("tidak")} /> Laporan tidak valid
        </label>
      </fieldset>
      {hasil === "tidak" && (
        <p className="rw-bantu">Pelapor punya waktu 2 minggu untuk konfirmasi ulang sebelum laporan dihapus otomatis.</p>
      )}
      <div className="rw-field">
        <label htmlFor="catatan">Catatan pemeriksaan</label>
        <textarea id="catatan" rows={3} maxLength={1000} value={catatan} onChange={(e) => setCatatan(e.target.value)}
          placeholder="Alasan atau temuan pemeriksaan (terlihat oleh pelapor)" />
      </div>
      <div className="rw-field">
        <label htmlFor="status">Status penanganan</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_LAPORAN.map((s) => <option key={s} value={s}>{LABEL_STATUS[s]}</option>)}
        </select>
      </div>
      {galat && <p className="form-message error" role="alert">{galat}</p>}
      <button type="button" className="rw-btn rw-btn-utama" onClick={simpan} disabled={sibuk}>
        {sibuk ? "Menyimpan..." : "Simpan hasil pemeriksaan"}
      </button>
    </div>
  );
}

export default function PeriksaLaporanView({ idAwal }) {
  const [filter, setFilter] = useState(idAwal ? "" : "BELUM_DIPERIKSA");
  const [cari, setCari] = useState("");
  const [terpilihId, setTerpilihId] = useState(idAwal);
  const [pesan, setPesan] = useState("");

  // Terlama di atas, agar antrean pemeriksaan diproses berurutan
  const { data, galat, memuat, muatUlang } = useData(
    () => daftarLaporan({ statusValidasi: filter, limit: 100, sortBy: "waktu", sortType: "asc" }),
    filter,
  );

  const kata = cari.trim().toLowerCase();
  const daftar = (data?.laporan ?? []).filter((l) =>
    !kata || l.namaMasalah.toLowerCase().includes(kata) || l.kategori.toLowerCase().includes(kata));
  const terpilih = daftar.find((l) => l.idLaporan === terpilihId) ?? null;

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Periksa Laporan</h1>
          <p>Nyatakan laporan valid atau tidak valid, lalu perbarui status penanganannya.</p>
        </div>
      </section>
      {pesan && <p className="form-message success" role="status">{pesan}</p>}

      <div className="rw-periksa">
        <section className="rw-periksa-daftar">
          <div className="rw-filter rw-filter-rapat">
            <label>Tampilkan
              <select value={filter} onChange={(e) => { setFilter(e.target.value); setTerpilihId(null); }}>
                {FILTER_VALIDASI.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label>Cari laporan
              <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Nama atau kategori" />
            </label>
          </div>
          {memuat && <Memuat teks="Memuat laporan..." />}
          {!memuat && galat && <Galat pesan={galat} onUlang={muatUlang} />}
          {!memuat && !galat && daftar.length === 0 && <p className="rw-keadaan">Tidak ada laporan.</p>}
          {!memuat && !galat && daftar.map((l) => (
            <KartuLaporan key={l.idLaporan} laporan={l} aktif={l.idLaporan === terpilihId}
              onKlik={(x) => { setTerpilihId(x.idLaporan); setPesan(""); }} />
          ))}
        </section>

        <section className="rw-panel rw-periksa-detail">
          {!terpilih && <p className="rw-keadaan">Pilih laporan di sebelah kiri untuk diperiksa.</p>}
          {terpilih && (
            <>
              {terpilih.foto && <img className="rw-detail-foto" src={terpilih.foto} alt={`Foto: ${terpilih.namaMasalah}`} />}
              <h2>{terpilih.namaMasalah}</h2>
              <div className="rw-baris-lencana">
                <span className="rw-kategori">{terpilih.kategori}</span>
                <LencanaStatus status={terpilih.statusLaporan} />
                <LencanaTingkat tingkat={terpilih.tingkatPermasalahan} />
                <LencanaValidasi status={terpilih.statusValidasi} />
              </div>
              <p className="rw-deskripsi">{terpilih.deskripsi || "Tanpa deskripsi."}</p>
              <p className="rw-meta">
                Pelapor: {terpilih.pelapor}{terpilih.statusPrivasi === "ANONIM" && " (memilih anonim)"} · {tanggal(terpilih.waktuLapor)}
              </p>
              {terpilih.batasWaktu && (
                <p className="rw-meta">Batas waktu konfirmasi ulang: {tanggal(terpilih.batasWaktu)}</p>
              )}
              <PetaLaporan tengah={terpilih.lokasi} zoom={16} laporan={[terpilih]} tinggi={200} />
              <hr />
              <FormPemeriksaan key={terpilih.idLaporan} laporan={terpilih}
                onSelesai={(teks) => { setPesan(teks); muatUlang(); }} />
            </>
          )}
        </section>
      </div>
    </>
  );
}
