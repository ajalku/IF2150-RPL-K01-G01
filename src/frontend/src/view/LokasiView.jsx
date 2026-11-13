import { useCallback, useEffect, useState } from "react";
import { LocateFixed, Search } from "lucide-react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Memuat } from "../components/Keadaan.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import { useData } from "../hooks/useData.js";
import { daftarLaporan } from "../services/laporanService.js";
import { geocode, laporanTerdekat } from "../services/lokasiService.js";
import { LABEL_STATUS, LABEL_TINGKAT, STATUS_LAPORAN, WARNA_STATUS } from "../utils/format.js";

const PILIHAN_RADIUS = [1, 2, 5, 10, 25];

// "Lihat di peta" dari halaman detail mengirim ?lat=..&lon=..&fokus=<idLaporan>
function bacaTengah(query) {
  if (!query.has("lat") || !query.has("lon")) return null;
  const latitude = Number(query.get("lat"));
  const longitude = Number(query.get("lon"));
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
}

export default function LokasiView({ query }) {
  const [tengahAwal] = useState(() => bacaTengah(query));
  const [fokus, setFokus] = useState(() => query.get("fokus"));
  const [izin, setIzin] = useState(() =>
    tengahAwal ? "lewati" : navigator.geolocation ? "meminta" : "tidak-didukung");
  const [pusat, setPusat] = useState(null);
  const [sumber, setSumber] = useState("");
  const [radius, setRadius] = useState(5);
  const [filter, setFilter] = useState({ kategori: "", tingkat: "", status: "" });
  const [teksCari, setTeksCari] = useState("");
  const [mencari, setMencari] = useState(false);
  const [galatCari, setGalatCari] = useState("");

  const ambilGPS = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPusat({ latitude: coords.latitude, longitude: coords.longitude });
        setSumber("gps");
        setIzin("diberikan");
        setFokus(null);
      },
      () => setIzin("ditolak"),
      { timeout: 10000 },
    );
  }, []);

  // Minta izin lokasi sekali saat halaman dibuka (UC03)
  useEffect(() => {
    if (tengahAwal || !navigator.geolocation) return;
    ambilGPS();
  }, [tengahAwal, ambilGPS]);

  const kunci = pusat ? `${pusat.latitude},${pusat.longitude},${radius}` : "semua";
  const { data, galat, memuat, muatUlang } = useData(
    () => (pusat
      ? laporanTerdekat(pusat.latitude, pusat.longitude, radius)
      : daftarLaporan({ limit: 100, sortBy: "waktu", sortType: "desc" })),
    kunci,
  );

  const cariLokasi = async (e) => {
    e.preventDefault();
    if (teksCari.trim() === "") return;
    setMencari(true);
    setGalatCari("");
    try {
      const hasil = await geocode(teksCari.trim());
      setPusat({ latitude: hasil.latitude, longitude: hasil.longitude });
      setSumber("cari");
      setIzin("diberikan");
      setFokus(null);
    } catch (err) {
      setGalatCari(err.status === 404 ? "Lokasi tidak ditemukan." : err.message);
    } finally {
      setMencari(false);
    }
  };

  const ubahFilter = (e) => setFilter((f) => ({ ...f, [e.target.name]: e.target.value }));

  const semua = data?.laporan ?? [];
  const daftarKategori = [...new Set(semua.map((l) => l.kategori))].sort();
  const laporan = semua.filter((l) =>
    (!filter.kategori || l.kategori === filter.kategori)
    && (!filter.tingkat || l.tingkatPermasalahan === filter.tingkat)
    && (!filter.status || l.statusLaporan === filter.status));

  const laporanFokus = laporan.find((l) => l.idLaporan === fokus);
  const tengah = laporanFokus ? laporanFokus.lokasi : (pusat ?? tengahAwal ?? undefined);
  const zoom = laporanFokus ? 16 : pusat ? 14 : 15;
  const menunggu = izin === "meminta" || memuat;

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Peta Interaktif</h1>
          <p>Lihat laporan di sekitar Anda. Warna penanda menunjukkan status, ukurannya menunjukkan urgensi.</p>
        </div>
      </section>

      {(izin === "ditolak" || izin === "tidak-didukung") && (
        <div className="rw-banner">
          <strong>Lokasi Anda belum tersedia.</strong>
          <p>Menampilkan semua laporan. Aktifkan izin lokasi di browser, atau cari lokasi secara manual.</p>
          {izin === "ditolak" && (
            <button type="button" className="rw-btn rw-btn-garis" onClick={() => { setIzin("meminta"); ambilGPS(); }}>
              Coba lagi
            </button>
          )}
        </div>
      )}

      <div className="rw-peta-layout">
        <div className="rw-peta-kolom">
          <PetaLaporan tengah={tengah} zoom={zoom} laporan={laporan} lokasiPengguna={sumber === "gps" ? pusat : undefined}
            fokusId={fokus} onPilih={setFokus} tinggi={560} />
          <ul className="rw-legenda" aria-label="Legenda status laporan">
            {STATUS_LAPORAN.map((s) => (
              <li key={s}><span className="rw-warna" style={{ background: WARNA_STATUS[s] }} />{LABEL_STATUS[s]}</li>
            ))}
          </ul>
        </div>

        <aside className="rw-peta-sisi">
          <form className="rw-gabung" onSubmit={cariLokasi}>
            <input value={teksCari} onChange={(e) => setTeksCari(e.target.value)}
              placeholder="Cari lokasi, mis. Alun-alun Bandung" aria-label="Cari lokasi" />
            <button type="submit" className="rw-btn rw-btn-garis" disabled={mencari} aria-label="Cari">
              <Search size={15} />
            </button>
            {navigator.geolocation && (
              <button type="button" className="rw-btn rw-btn-garis" aria-label="Gunakan lokasi saya" title="Lokasi saya"
                onClick={() => { setIzin("meminta"); ambilGPS(); }}>
                <LocateFixed size={15} />
              </button>
            )}
          </form>
          {galatCari && <p className="form-message error" role="alert">{galatCari}</p>}

          <div className="rw-filter rw-filter-rapat">
            {pusat && (
              <label>Radius
                <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                  {PILIHAN_RADIUS.map((r) => <option key={r} value={r}>{r} km</option>)}
                </select>
              </label>
            )}
            <label>Kategori
              <select name="kategori" value={filter.kategori} onChange={ubahFilter}>
                <option value="">Semua</option>
                {daftarKategori.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label>Urgensi
              <select name="tingkat" value={filter.tingkat} onChange={ubahFilter}>
                <option value="">Semua</option>
                {Object.entries(LABEL_TINGKAT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label>Status
              <select name="status" value={filter.status} onChange={ubahFilter}>
                <option value="">Semua</option>
                {STATUS_LAPORAN.map((s) => <option key={s} value={s}>{LABEL_STATUS[s]}</option>)}
              </select>
            </label>
          </div>

          <h2 className="rw-sub">
            {pusat ? (sumber === "gps" ? "Laporan di sekitar Anda" : "Laporan di sekitar lokasi pencarian") : "Semua laporan"}
            {!menunggu && !galat && <span> ({laporan.length})</span>}
          </h2>

          {menunggu && <Memuat teks={izin === "meminta" ? "Menunggu izin lokasi..." : "Memuat laporan..."} />}
          {!menunggu && galat && <Galat pesan={galat} onUlang={muatUlang} />}
          {!menunggu && !galat && laporan.length === 0 && (
            <p className="rw-keadaan">
              {pusat ? `Tidak ada laporan dalam radius ${radius} km. Coba perbesar radius.` : "Tidak ada laporan yang cocok."}
            </p>
          )}
          {!menunggu && !galat && (
            <div className="rw-daftar-peta">
              {laporan.map((l) => (
                <KartuLaporan key={l.idLaporan} laporan={l} aktif={l.idLaporan === fokus}
                  onKlik={(x) => setFokus(x.idLaporan)} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
