import { useEffect, useState } from "react";
import PenggunaView from "./view/PenggunaView";
import HomepageView from "./view/HomepageView.jsx";
import LaporanView from "./view/LaporanView.jsx";
import BuatLaporanView from "./view/BuatLaporanView.jsx";
import LokasiView from "./view/LokasiView.jsx";
import ProfilView from "./view/ProfilView.jsx";
import PeriksaLaporanView from "./view/PeriksaLaporanView.jsx";
import AppShell from "./components/AppShell.jsx";
import { Galat, Kosong, Memuat } from "./components/Keadaan.jsx";
import { getSesi, logout } from "./services/authService.js";
import { useRute } from "./hooks/useRute.js";
import "./view/RawatApp.css";

function Halaman({ rute, sesi, onLogout }) {
  switch (rute.nama) {
    case "laporan":
      return <LaporanView key={rute.id} id={rute.id} sesi={sesi} />;
    case "buat":
      return <BuatLaporanView />;
    case "peta":
      return <LokasiView key={rute.query.toString()} query={rute.query} />;
    case "profil":
      return <ProfilView sesi={sesi} onLogout={onLogout} />;
    case "periksa":
      return sesi.role === "admin"
        ? <PeriksaLaporanView key={rute.id ?? "daftar"} idAwal={rute.id} />
        : <Kosong>Halaman ini hanya untuk admin.</Kosong>;
    default:
      return <HomepageView />;
  }
}

function App() {
  // undefined = sedang memeriksa sesi, null = belum login, objek = sudah login
  const [sesi, setSesi] = useState(undefined);
  const [galat, setGalat] = useState("");
  const rute = useRute();

  useEffect(() => {
    let batal = false;
    getSesi()
      .then((s) => { if (!batal) setSesi(s); })
      .catch((err) => { if (!batal) setGalat(err.message); });

    const sesiHabis = () => setSesi(null);
    window.addEventListener("rawat:sesi-habis", sesiHabis);
    return () => {
      batal = true;
      window.removeEventListener("rawat:sesi-habis", sesiHabis);
    };
  }, []);

  const saatLoginBerhasil = async () => {
    try {
      setSesi(await getSesi());
      if (!window.location.hash) window.location.hash = "#/beranda";
    } catch {
      /* PenggunaView sudah menampilkan pesan login */
    }
  };

  const keluar = async () => {
    try {
      await logout();
    } catch {
      /* sesi tetap dibersihkan di sisi tampilan */
    }
    setSesi(null);
    window.location.hash = "";
  };

  if (galat) {
    return <div className="rw-layar-tengah"><Galat pesan={galat} onUlang={() => window.location.reload()} /></div>;
  }
  if (sesi === undefined) return <div className="rw-layar-tengah"><Memuat teks="Memuat RAWAT..." /></div>;
  if (sesi === null) return <PenggunaView onLoginSuccess={saatLoginBerhasil} />;

  return (
    <AppShell sesi={sesi} rute={rute} onLogout={keluar}>
      <Halaman rute={rute} sesi={sesi} onLogout={keluar} />
    </AppShell>
  );
}

export default App;
