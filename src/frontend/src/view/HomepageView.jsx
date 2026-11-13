import { useState } from "react";
import {
  ArrowRight, BadgeCheck, Clock, Construction, HeartHandshake, Layers, MapPin, MapPinned, Sparkles,
} from "lucide-react";
import KartuBeranda from "../components/KartuBeranda.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import TutorialView from "./TutorialView.jsx";
import { Galat, Kosong, Memuat } from "../components/Keadaan.jsx";
import { useData } from "../hooks/useData.js";
import { daftarLaporan, ringkasanLaporan } from "../services/laporanService.js";
import { muatHomepage } from "../services/homepageService.js";
import { ambilTutorial, lewatiTutorial, selesaiTutorial } from "../services/tutorialService.js";
import { KATEGORI } from "../utils/format.js";
import { hitungJarakKm } from "../utils/jarak.js";
import "./Beranda.css";

const WILAYAH = "Bandung, Jawa Barat";
const LANGKAH_MUAT = 3; // jumlah kartu awal, dan tambahan tiap "Lihat laporan lainnya"
const RADIUS_SEKITAR_KM = 5;

// Urutan kunci = urutan tab di layar (Terbaru, Urgensi, Populer)
const URUTAN = {
  terbaru: { sortBy: "waktu", sortType: "desc" },
  urgensi: { sortBy: "urgensi", sortType: "desc" },
  populer: { sortBy: "populer", sortType: "desc" },
};
const LABEL_URUTAN = { terbaru: "Terbaru", urgensi: "Urgensi", populer: "Populer" };

const STATISTIK = [
  { kunci: "aktif", ikon: Layers, label: "Laporan aktif", ket: "di semua wilayah" },
  { kunci: "menungguVerifikasi", ikon: Clock, label: "Menunggu verifikasi", ket: "sedang ditinjau petugas" },
  { kunci: "terverifikasi", ikon: BadgeCheck, label: "Terverifikasi", ket: "siap ditindaklanjuti" },
  { kunci: "dalamPenanganan", ikon: Construction, label: "Dalam penanganan", ket: "perbaikan sedang berjalan" },
];

function sapaan() {
  const jam = new Date().getHours();
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function HomepageView({ sesi }) {
  const [salam] = useState(sapaan);
  const namaDepan = sesi?.nama?.trim().split(/\s+/)[0] ?? "";

  // ---- Lokasi pengguna (opsional, hanya setelah chip lokasi diklik) ----
  const [lokasiPengguna, setLokasiPengguna] = useState(null);
  const [statusLokasi, setStatusLokasi] = useState(""); // "" | "mencari" | "aktif" | "ditolak"

  const pakaiLokasi = () => {
    if (!navigator.geolocation) {
      setStatusLokasi("ditolak");
      return;
    }
    setStatusLokasi("mencari");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLokasiPengguna({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatusLokasi("aktif");
      },
      () => setStatusLokasi("ditolak"),
      { timeout: 10000 },
    );
  };

  const labelLokasi = {
    mencari: "Mencari lokasi...",
    ditolak: "Izin lokasi ditolak",
  }[statusLokasi] ?? WILAYAH;

  // ---- Ringkasan angka (gagal = tampil "-", tidak mengganggu halaman) ----
  const ringkasan = useData(ringkasanLaporan, "ringkasan");

  // ---- Kabar lingkungan ----
  const [filter, setFilter] = useState({ kategori: "", urut: "urgensi" });
  const [tampil, setTampil] = useState(LANGKAH_MUAT);

  const ubahFilter = (perubahan) => {
    setFilter((f) => ({ ...f, ...perubahan }));
    setTampil(LANGKAH_MUAT);
  };

  const { data, galat, memuat, muatUlang } = useData(
    () => muatHomepage({
      kategori: filter.kategori,
      ...URUTAN[filter.urut],
      limit: tampil,
    }),
    JSON.stringify({ filter, tampil }),
  );

  // Simpan hasil terakhir supaya daftar tidak hilang saat memuat tambahan / berganti filter.
  const [terakhir, setTerakhir] = useState(null);
  if (data && data !== terakhir) setTerakhir(data);
  // /api/homepage mengembalikan { daftarLaporan, adaLagi } dan menyertakan sudahUpvote/bisaUpvote
  const laporan = terakhir?.daftarLaporan ?? [];
  const adaLagi = terakhir?.adaLagi ?? false;

  // Urutan "populer" bergantung pada jumlah dukungan -> muat ulang agar urutannya langsung diperbarui
  const saatUpvoteBerhasil = () => {
    if (filter.urut === "populer") muatUlang();
  };

  // ---- Peta ringkas ----
  const peta = useData(() => daftarLaporan({ limit: 30 }), "peta");
  const semuaTitik = peta.data?.laporan ?? [];
  const titikPeta = lokasiPengguna
    ? semuaTitik.filter((l) => hitungJarakKm(lokasiPengguna, l.lokasi) <= RADIUS_SEKITAR_KM)
    : semuaTitik;

  // ---- Tutorial ---- (pelengkap: jika gagal dimuat, Beranda tetap berjalan tanpa kartu undangan)
  const tutorial = useData(ambilTutorial, "tutorial");
  const [tutorialTutup, setTutorialTutup] = useState(false);
  const [panelTerbuka, setPanelTerbuka] = useState(false);
  const [galatTutorial, setGalatTutorial] = useState("");
  const infoTutorial = tutorial.data;
  const tampilKartuTutorial = Boolean(infoTutorial) && !infoTutorial.sudahLihat && !tutorialTutup;

  const lewatiDariKartu = async () => {
    setGalatTutorial("");
    try {
      await lewatiTutorial();
      setTutorialTutup(true);
    } catch (err) {
      setGalatTutorial(err.message || "Tutorial gagal ditutup. Coba lagi.");
    }
  };

  const tutupPanel = () => {
    setPanelTerbuka(false);
    setTutorialTutup(true);
  };

  return (
    <>
      {/* ---------- Sapaan ---------- */}
      <section className="br-sapaan">
        <div>
          <h1>{salam}, {namaDepan}.</h1>
          <p>Mari rawat ruang bersama, mulai dari lingkungan terdekat.</p>
        </div>
        <button
          type="button"
          className={`br-lokasi${statusLokasi === "aktif" ? " aktif" : ""}`}
          onClick={pakaiLokasi}
          disabled={statusLokasi === "mencari"}
          title="Gunakan lokasi saya untuk menghitung jarak laporan"
        >
          <MapPin size={16} aria-hidden="true" /> {labelLokasi}
        </button>
      </section>

      {/* ---------- Banner ---------- */}
      <section className="br-hero">
        <div>
          <span className="br-hero-eyebrow">Suara kecil, dampak nyata</span>
          <h2>Lihat masalahnya. Sampaikan. Kawal bersama.</h2>
          <p>Laporan Anda membantu fasilitas publik kembali aman dan nyaman.</p>
        </div>
        <div className="br-hero-ikon" aria-hidden="true">
          <MapPinned size={46} strokeWidth={1.4} />
        </div>
      </section>

      {/* ---------- Ringkasan ---------- */}
      <section className="br-statistik" aria-label="Ringkasan laporan">
        {STATISTIK.map(({ kunci, ikon: Ikon, label, ket }) => (
          <div className="br-stat" key={kunci}>
            <Ikon size={22} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <p className="br-stat-baris">
                <strong>{ringkasan.data ? ringkasan.data[kunci] : "-"}</strong>
                <span>{label}</span>
              </p>
              <p className="br-stat-ket">{ket}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="br-grid">
        {/* ---------- Kolom kiri: Kabar lingkungan ---------- */}
        <section aria-labelledby="br-judul-kabar">
          <div className="br-kabar-kepala">
            <h2 id="br-judul-kabar">Kabar lingkungan</h2>
            <div className="br-tab" role="group" aria-label="Urutkan laporan">
              {Object.keys(URUTAN).map((u) => (
                <button key={u} type="button" aria-pressed={filter.urut === u}
                  className={filter.urut === u ? "aktif" : ""} onClick={() => ubahFilter({ urut: u })}>
                  {LABEL_URUTAN[u]}
                </button>
              ))}
            </div>
          </div>

          <div className="br-chip-baris" role="group" aria-label="Filter kategori">
            {["", ...KATEGORI].map((k) => (
              <button key={k || "semua"} type="button" aria-pressed={filter.kategori === k}
                className={filter.kategori === k ? "aktif" : ""} onClick={() => ubahFilter({ kategori: k })}>
                {k || "Semua kategori"}
              </button>
            ))}
          </div>

          {!terakhir && memuat && <Memuat teks="Memuat laporan..." />}
          {!memuat && galat && <Galat pesan={galat} onUlang={muatUlang} />}
          {!memuat && !galat && terakhir && laporan.length === 0 && (
            <Kosong>Belum ada laporan{filter.kategori ? ` untuk kategori ${filter.kategori}` : ""}.</Kosong>
          )}

          {!galat && laporan.length > 0 && (
            <div className={`br-daftar${memuat ? " memuat" : ""}`} aria-busy={memuat}>
              {laporan.map((l) => (
                <KartuBeranda
                  key={l.idLaporan}
                  laporan={l}
                  jarakKm={lokasiPengguna ? hitungJarakKm(lokasiPengguna, l.lokasi) : undefined}
                  onUpvoteBerhasil={saatUpvoteBerhasil}
                />
              ))}
            </div>
          )}

          {!galat && laporan.length > 0 && adaLagi && (
            <div className="br-lebih-wadah">
              <button type="button" className="br-lebih" disabled={memuat}
                onClick={() => setTampil((t) => t + LANGKAH_MUAT)}>
                {memuat ? "Memuat..." : "Lihat laporan lainnya"}
              </button>
            </div>
          )}
        </section>

        {/* ---------- Kolom kanan ---------- */}
        <aside className="br-sisi">
          <section className="br-panel">
            <h2>Ada apa di sekitar Anda?</h2>
            <p className="br-panel-sub">Temukan laporan terdekat di peta.</p>
            <div className="br-peta">
              <PetaLaporan
                tengah={lokasiPengguna ?? undefined}
                zoom={14}
                laporan={titikPeta}
                lokasiPengguna={lokasiPengguna}
                tinggi={225}
              />
              <a className="br-peta-tautan" href="#/peta" aria-label="Buka peta interaktif" />
            </div>
            <div className="br-peta-kaki">
              <span>
                {lokasiPengguna
                  ? `${titikPeta.length} laporan dalam ${RADIUS_SEKITAR_KM} km`
                  : `${titikPeta.length} laporan terbaru`}
              </span>
              <a href="#/peta">Buka peta <ArrowRight size={14} aria-hidden="true" /></a>
            </div>
          </section>

          {tampilKartuTutorial && (
            <section className="br-tutorial" aria-labelledby="br-judul-tutorial">
              <Sparkles size={26} strokeWidth={1.5} aria-hidden="true" />
              <h2 id="br-judul-tutorial">Baru di RAWAT?</h2>
              <p>Kenali cara melapor dan pantau tindak lanjutnya dalam {infoTutorial.totalLangkah} langkah sederhana.</p>
              {galatTutorial && <p className="br-tutorial-galat" role="alert">{galatTutorial}</p>}
              <div className="br-tutorial-aksi">
                <button type="button" className="rw-btn rw-btn-utama" onClick={() => setPanelTerbuka(true)}>Mulai tutorial</button>
                <button type="button" className="br-teks-btn" onClick={lewatiDariKartu}>Lewati</button>
              </div>
            </section>
          )}

          <p className="br-catatan">
            <HeartHandshake size={20} strokeWidth={1.5} aria-hidden="true" />
            <span>Sampaikan fakta, jaga tutur kata. Setiap dukungan membantu masalah lebih terlihat.</span>
          </p>
        </aside>
      </div>

      {panelTerbuka && infoTutorial && (
        <TutorialView
          langkah={infoTutorial.langkah}
          onSkip={lewatiTutorial}
          onSelesai={selesaiTutorial}
          onTutup={tutupPanel}
        />
      )}

    </>
  );
}
