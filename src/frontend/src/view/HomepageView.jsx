import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import UpvoteView from "../components/UpvoteView.jsx";
import TutorialView from "../components/TutorialView.jsx";
import { Galat, Kosong, Memuat } from "../components/Keadaan.jsx";
import { useData } from "../hooks/useData.js";
import { muatHomepage } from "../services/homepageService.js";
import { ambilTutorial, lewatiTutorial, selesaiTutorial } from "../services/tutorialService.js";
import { KATEGORI, LABEL_STATUS, STATUS_LAPORAN } from "../utils/format.js";

const PER_HALAMAN = 12;
const URUTAN = {
  urgensi: { sortBy: "urgensi", sortType: "desc" },
  populer: { sortBy: "populer", sortType: "desc" },
  terbaru: { sortBy: "waktu", sortType: "desc" },
  terlama: { sortBy: "waktu", sortType: "asc" },
};

// C09 - HomepageView: daftar laporan, urutan, filter, tombol dukungan, dan ajakan tutorial.
export default function HomepageView() {
  const [filter, setFilter] = useState({ kategori: "", statusLaporan: "", urut: "urgensi" });
  const [halaman, setHalaman] = useState(1);
  const [tutorialBuka, setTutorialBuka] = useState(false);
  const [undanganTutup, setUndanganTutup] = useState(false);

  // pilihFilter() pada DPPL
  const ubahFilter = (e) => {
    setFilter((f) => ({ ...f, [e.target.name]: e.target.value }));
    setHalaman(1);
  };

  const { data, galat, memuat, muatUlang } = useData(
    () => muatHomepage({
      kategori: filter.kategori,
      statusLaporan: filter.statusLaporan,
      ...URUTAN[filter.urut],
      limit: PER_HALAMAN,
      offset: (halaman - 1) * PER_HALAMAN,
    }),
    JSON.stringify({ filter, halaman }),
  );
  // Tutorial hanyalah pelengkap: jika gagal dimuat, Beranda tetap berjalan tanpa kartu undangan.
  const { data: tutorial } = useData(ambilTutorial, "tutorial");

  const laporan = data?.daftarLaporan ?? [];
  const tampilUndangan = tutorial && !tutorial.sudahLihat && !undanganTutup;

  // Urutan "populer" bergantung pada jumlah dukungan -> muat ulang agar urutannya langsung diperbarui
  const saatUpvoteBerhasil = () => {
    if (filter.urut === "populer") muatUlang();
  };

  const akhiriTutorial = () => {
    setTutorialBuka(false);
    setUndanganTutup(true);
  };
  const lewatiUndangan = async () => {
    try { await lewatiTutorial(); } catch { /* status akan disimpan lagi saat tutorial dibuka berikutnya */ }
    setUndanganTutup(true);
  };

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Laporan Warga</h1>
          <p>Pantau masalah fasilitas dan ruang publik di sekitar Anda, dan kawal sampai tuntas.</p>
        </div>
        <div className="rw-undangan-aksi">
          {tutorial && (tutorial.sudahLihat || undanganTutup) && (
            <button type="button" className="rw-btn rw-btn-garis" onClick={() => setTutorialBuka(true)}>Lihat tutorial</button>
          )}
          <a className="rw-btn rw-btn-utama" href="#/buat"><Plus size={15} aria-hidden="true" /> Buat Laporan</a>
        </div>
      </section>

      {tampilUndangan && (
        <section className="rw-undangan" aria-label="Ajakan tutorial">
          <div>
            <h2><Sparkles size={16} aria-hidden="true" /> Baru di RAWAT?</h2>
            <p>Kenali cara melapor dan memantau tindak lanjutnya dalam {tutorial.totalLangkah} langkah sederhana.</p>
          </div>
          <div className="rw-undangan-aksi">
            <button type="button" className="rw-btn rw-btn-utama" onClick={() => setTutorialBuka(true)}>Mulai tutorial</button>
            <button type="button" className="rw-btn rw-btn-garis" onClick={lewatiUndangan}>Lewati</button>
          </div>
        </section>
      )}

      <section className="rw-filter" aria-label="Filter laporan">
        <label>Urutkan
          <select name="urut" value={filter.urut} onChange={ubahFilter}>
            <option value="urgensi">Urgensi tertinggi</option>
            <option value="populer">Terpopuler</option>
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
          </select>
        </label>
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
      </section>

      {memuat && <Memuat teks="Memuat laporan..." />}
      {!memuat && galat && <Galat pesan={galat} onUlang={muatUlang} />}
      {!memuat && !galat && laporan.length === 0 && (
        <Kosong>Belum ada laporan{filter.kategori || filter.statusLaporan ? " dengan filter ini" : ""}.</Kosong>
      )}

      {!memuat && !galat && laporan.length > 0 && (
        <>
          <div className="rw-grid">
            {laporan.map((l) => (
              <KartuLaporan key={l.idLaporan} laporan={l}>
                <UpvoteView
                  key={`${l.jumlahUpvote}-${l.sudahUpvote}`}
                  idLaporan={l.idLaporan}
                  jumlahUpvote={l.jumlahUpvote}
                  sudahUpvote={l.sudahUpvote}
                  bisaUpvote={l.bisaUpvote}
                  onBerhasil={saatUpvoteBerhasil}
                />
              </KartuLaporan>
            ))}
          </div>
          <div className="rw-pager">
            <button type="button" className="rw-btn rw-btn-garis" disabled={halaman === 1}
              onClick={() => setHalaman((h) => h - 1)}><ChevronLeft size={15} /> Sebelumnya</button>
            <span>Halaman {halaman}</span>
            <button type="button" className="rw-btn rw-btn-garis" disabled={!data?.adaLagi}
              onClick={() => setHalaman((h) => h + 1)}>Berikutnya <ChevronRight size={15} /></button>
          </div>
        </>
      )}

      {tutorialBuka && tutorial && (
        <TutorialView
          langkah={tutorial.langkah}
          onSkip={lewatiTutorial}
          onSelesai={selesaiTutorial}
          onTutup={akhiriTutorial}
        />
      )}
    </>
  );
}
