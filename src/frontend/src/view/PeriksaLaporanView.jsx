import { useState } from "react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Memuat } from "../components/Keadaan.jsx";
import { LencanaStatus, LencanaTingkat, LencanaValidasi } from "../components/Lencana.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import { useData } from "../hooks/useData.js";
import { daftarLaporan } from "../services/laporanService.js";
import TanggapanView from "./TanggapanView.jsx";
import { tanggal } from "../utils/format.js";

const FILTER_VALIDASI = [
  ["BELUM_DIPERIKSA", "Belum diperiksa"], ["VALID", "Valid"], ["TIDAK_VALID", "Tidak valid"], ["", "Semua"],
];

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
              <TanggapanView key={terpilih.idLaporan} laporan={terpilih}
                onSelesai={(teks) => { setPesan(teks); muatUlang(); }} />
            </>
          )}
        </section>
      </div>
    </>
  );
}
