import { useState } from "react";
import { LogOut } from "lucide-react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Kosong, Memuat } from "../components/Keadaan.jsx";
import { useData } from "../hooks/useData.js";
import { konfirmasiUlang, laporanSaya } from "../services/laporanService.js";
import { tanggal } from "../utils/format.js";

export default function ProfilView({ sesi, onLogout }) {
  const { data, galat, memuat, muatUlang } = useData(laporanSaya, "saya");
  const [sibukId, setSibukId] = useState(null);
  const [pesan, setPesan] = useState({ jenis: "", teks: "" });

  const kirimKonfirmasiUlang = async (id) => {
    setSibukId(id);
    try {
      const hasil = await konfirmasiUlang(id);
      setPesan({ jenis: "success", teks: hasil.message });
      muatUlang();
    } catch (err) {
      setPesan({ jenis: "error", teks: err.message });
    } finally {
      setSibukId(null);
    }
  };

  const laporan = data?.laporan ?? [];

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Profil Saya</h1>
          <p>Informasi akun dan laporan yang pernah Anda kirim.</p>
        </div>
        <button type="button" className="rw-btn rw-btn-bahaya-garis" onClick={onLogout}>
          <LogOut size={15} /> Keluar akun
        </button>
      </section>

      <section className="rw-panel">
        <dl className="rw-info">
          <div><dt>Nama</dt><dd>{sesi.nama}</dd></div>
          <div><dt>Email</dt><dd>{sesi.email}</dd></div>
          <div><dt>Nomor telepon</dt><dd>{sesi.noTelp}</dd></div>
          <div><dt>Peran</dt><dd>{sesi.role === "admin" ? "Admin" : "Warga"}</dd></div>
        </dl>
      </section>

      <h2 className="rw-sub">Laporan saya</h2>
      {pesan.teks && <p className={`form-message ${pesan.jenis}`} role="status">{pesan.teks}</p>}
      {memuat && <Memuat teks="Memuat laporan Anda..." />}
      {!memuat && galat && <Galat pesan={galat} onUlang={muatUlang} />}
      {!memuat && !galat && laporan.length === 0 && (
        <Kosong>Anda belum membuat laporan. <a href="#/buat">Buat laporan pertama</a></Kosong>
      )}
      {!memuat && !galat && laporan.length > 0 && (
        <div className="rw-grid">
          {laporan.map((l) => (
            <KartuLaporan key={l.idLaporan} laporan={l}>
              {l.statusValidasi === "TIDAK_VALID" && (
                <div className="rw-peringatan">
                  <p>
                    Dinyatakan tidak valid{l.catatanPemeriksaan ? `: ${l.catatanPemeriksaan}` : "."}
                    {l.batasWaktu && <> Dihapus otomatis {tanggal(l.batasWaktu)}.</>}
                  </p>
                  <button type="button" className="rw-btn rw-btn-utama" disabled={sibukId === l.idLaporan}
                    onClick={() => kirimKonfirmasiUlang(l.idLaporan)}>
                    {sibukId === l.idLaporan ? "Mengirim..." : "Konfirmasi ulang"}
                  </button>
                </div>
              )}
            </KartuLaporan>
          ))}
        </div>
      )}
    </>
  );
}
