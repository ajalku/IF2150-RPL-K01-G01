import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Kosong, Memuat } from "../components/Keadaan.jsx";
import { useData } from "../hooks/useData.js";
import { daftarLaporan } from "../services/laporanService.js";
import { KATEGORI, LABEL_STATUS, STATUS_LAPORAN } from "../utils/format.js";

const PER_HALAMAN = 12;
const URUTAN = {
  terbaru: { sortBy: "waktu", sortType: "desc" },
  terlama: { sortBy: "waktu", sortType: "asc" },
  populer: { sortBy: "populer", sortType: "desc" },
};

export default function HomepageView() {
  const [filter, setFilter] = useState({ kategori: "", statusLaporan: "", urut: "terbaru" });
  const [halaman, setHalaman] = useState(1);

  const ubahFilter = (e) => {
    setFilter((f) => ({ ...f, [e.target.name]: e.target.value }));
    setHalaman(1);
  };

  const { data, galat, memuat, muatUlang } = useData(
    () => daftarLaporan({
      kategori: filter.kategori,
      statusLaporan: filter.statusLaporan,
      ...URUTAN[filter.urut],
      page: halaman,
      limit: PER_HALAMAN,
    }),
    JSON.stringify({ filter, halaman }),
  );

  const laporan = data?.laporan ?? [];

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Laporan Warga</h1>
          <p>Pantau masalah fasilitas dan ruang publik di sekitar Anda, dan kawal sampai tuntas.</p>
        </div>
        <a className="rw-btn rw-btn-utama" href="#/buat"><Plus size={15} aria-hidden="true" /> Buat Laporan</a>
      </section>

      <section className="rw-filter" aria-label="Filter laporan">
        <label>Kategori
          <select name="kategori" value={filter.kategori} onChange={ubahFilter}>
            <option value="">Semua kategori</option>
            {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <label>Status
          <select name="statusLaporan" value={filter.statusLaporan} onChange={ubahFilter}>
            <option value="">Semua status</option>
            {STATUS_LAPORAN.map((s) => <option key={s} value={s}>{LABEL_STATUS[s]}</option>)}
          </select>
        </label>
        <label>Urutkan
          <select name="urut" value={filter.urut} onChange={ubahFilter}>
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
            <option value="populer">Terpopuler</option>
          </select>
        </label>
      </section>

      {memuat && <Memuat teks="Memuat laporan..." />}
      {!memuat && galat && <Galat pesan={galat} onUlang={muatUlang} />}
      {!memuat && !galat && laporan.length === 0 && (
        <Kosong>Belum ada laporan{filter.kategori || filter.statusLaporan ? " dengan filter ini" : ""}.</Kosong>
      )}

      {!memuat && !galat && laporan.length > 0 && (
        <>
          <div className="rw-grid">
            {laporan.map((l) => <KartuLaporan key={l.idLaporan} laporan={l} />)}
          </div>
          <div className="rw-pager">
            <button type="button" className="rw-btn rw-btn-garis" disabled={halaman === 1}
              onClick={() => setHalaman((h) => h - 1)}><ChevronLeft size={15} /> Sebelumnya</button>
            <span>Halaman {halaman}</span>
            <button type="button" className="rw-btn rw-btn-garis" disabled={laporan.length < PER_HALAMAN}
              onClick={() => setHalaman((h) => h + 1)}>Berikutnya <ChevronRight size={15} /></button>
          </div>
        </>
      )}
    </>
  );
}
