import { ClipboardCheck, Home, LogOut, Map as IkonPeta, Plus, UserRound } from "lucide-react";
import logoRawat from "../assets/brand-icon.svg";

const TAUTAN = [
  { nama: "beranda", href: "#/beranda", label: "Beranda", ikon: Home },
  { nama: "peta", href: "#/peta", label: "Peta Interaktif", ikon: IkonPeta },
  { nama: "periksa", href: "#/periksa", label: "Periksa Laporan", ikon: ClipboardCheck, khususAdmin: true },
];

export default function AppShell({ sesi, rute, onLogout, logoutError = "", children }) {
  const aktif = rute.nama === "laporan" ? "beranda" : rute.nama;
  const tautan = TAUTAN.filter((t) => !t.khususAdmin || sesi.role === "admin");

  return (
    <div className="rw-app">
      <header className="rw-nav">
        <div className="rw-nav-inner">
          <a className="rw-brand" href="#/beranda">
            <img src={logoRawat} alt="" />
            <strong>RAWAT</strong>
          </a>
          <nav className="rw-links" aria-label="Navigasi utama">
            {tautan.map(({ nama, href, label, ikon: Ikon }) => (
              <a key={nama} href={href} className={aktif === nama ? "aktif" : ""}
                aria-current={aktif === nama ? "page" : undefined}>
                <Ikon size={15} aria-hidden="true" /> {label}
              </a>
            ))}
          </nav>
          <a className="rw-btn rw-btn-kuning" href="#/buat"><Plus size={15} aria-hidden="true" /> Buat Laporan</a>
          <a className={`rw-akun${aktif === "profil" ? " aktif" : ""}`} href="#/profil" title="Profil saya">
            <UserRound size={15} aria-hidden="true" /> {sesi.nama}
          </a>
          <button type="button" className="rw-ikon-btn" onClick={onLogout} aria-label="Keluar akun" title="Keluar akun">
            <LogOut size={16} />
          </button>
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
