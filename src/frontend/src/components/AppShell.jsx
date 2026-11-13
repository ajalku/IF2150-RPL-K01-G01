import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Plus, UserRound } from "lucide-react";
import logoRawat from "../assets/brand-icon.svg";
import "./AppShell.css";

// Halaman yang punya rute sendiri; selain ini jatuh ke Beranda (lihat App.jsx) dan memakai tata letak lebar.
const RUTE_LAIN = ["laporan", "buat", "peta", "profil", "periksa"];

const TAUTAN = [
  { nama: "beranda", href: "#/beranda", label: "Beranda" },
  { nama: "peta", href: "#/peta", label: "Peta interaktif" },
  { nama: "periksa", href: "#/periksa", label: "Periksa laporan", khususAdmin: true },
];

const inisial = (nama = "") =>
  nama.trim().split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase() ?? "").join("") || "?";

// Nama + singkatan nama belakang, mis. "Aditya Pratama" -> "Aditya P."
const namaSingkat = (nama = "") => {
  const [depan, ...sisa] = nama.trim().split(/\s+/);
  return sisa.length ? `${depan} ${sisa[0][0].toUpperCase()}.` : depan;
};

function MenuAkun({ sesi, aktif, onLogout }) {
  const [buka, setBuka] = useState(false);
  const wadah = useRef(null);

  useEffect(() => {
    if (!buka) return undefined;
    const klikLuar = (e) => { if (!wadah.current?.contains(e.target)) setBuka(false); };
    const tekanTombol = (e) => { if (e.key === "Escape") setBuka(false); };
    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", tekanTombol);
    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", tekanTombol);
    };
  }, [buka]);

  return (
    <div className="nv-akun" ref={wadah}>
      <button type="button" className={`nv-akun-tombol${aktif ? " aktif" : ""}`}
        aria-haspopup="menu" aria-expanded={buka} onClick={() => setBuka((b) => !b)}>
        <span className="nv-avatar" aria-hidden="true">{inisial(sesi.nama)}</span>
        <span className="nv-akun-nama">{namaSingkat(sesi.nama)}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {buka && (
        <div className="nv-menu" role="menu">
          <a role="menuitem" href="#/profil" onClick={() => setBuka(false)}>
            <UserRound size={15} aria-hidden="true" /> Profil saya
          </a>
          <button type="button" role="menuitem" onClick={() => { setBuka(false); onLogout(); }}>
            <LogOut size={15} aria-hidden="true" /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export default function AppShell({ sesi, rute, onLogout, logoutError = "", children }) {
  const aktif = rute.nama === "laporan" ? "beranda" : rute.nama;
  const lebar = !RUTE_LAIN.includes(rute.nama);
  const tautan = TAUTAN.filter((t) => !t.khususAdmin || sesi.role === "admin");

  return (
    <div className={`rw-app${lebar ? " rw-lebar" : ""}`}>
      <header className="nv-bar">
        <div className="nv-dalam">
          <a className="nv-brand" href="#/beranda">
            <img src={logoRawat} alt="" />
            <span>
              <strong>RAWAT</strong>
              <small>Ruang Aspirasi Warga dan Aduan Terpadu</small>
            </span>
          </a>

          <nav className="nv-tautan" aria-label="Navigasi utama">
            {tautan.map(({ nama, href, label }) => (
              <a key={nama} href={href} className={aktif === nama ? "aktif" : ""}
                aria-current={aktif === nama ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>

          <div className="nv-aksi">
            <a className="rw-btn rw-btn-utama nv-buat" href="#/buat">
              <Plus size={16} aria-hidden="true" /> Buat Laporan
            </a>
            <button type="button" className="nv-ikon" disabled aria-label="Notifikasi (belum tersedia)" title="Notifikasi belum tersedia">
              <Bell size={18} aria-hidden="true" />
            </button>
            <MenuAkun sesi={sesi} aktif={aktif === "profil"} onLogout={onLogout} />
          </div>
        </div>
      </header>

      <main className="rw-main">
        {logoutError && <p className="rw-profile-message error" role="alert">{logoutError}</p>}
        {children}
      </main>
      <footer className="rw-footer">© 2026 RAWAT • Ruang Aspirasi Warga dan Aduan Terpadu</footer>
    </div>
  );
}
