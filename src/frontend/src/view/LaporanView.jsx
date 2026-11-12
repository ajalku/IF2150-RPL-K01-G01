import { useState } from "react";
import { ArrowLeft, ClipboardCheck, Map as IkonPeta, ThumbsUp, Trash2, User } from "lucide-react";
import DialogKonfirmasi from "../components/DialogKonfirmasi.jsx";
import { Galat, Memuat } from "../components/Keadaan.jsx";
import { LencanaStatus, LencanaTingkat, LencanaValidasi } from "../components/Lencana.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import { useData } from "../hooks/useData.js";
import { detailLaporan, hapusLaporan, konfirmasiUlang } from "../services/laporanService.js";
import { LABEL_STATUS, STATUS_LAPORAN, tanggal, waktuRelatif } from "../utils/format.js";

function PerjalananStatus({ status }) {
  const indeks = STATUS_LAPORAN.indexOf(status);
  return (
    <ol className="rw-langkah">
      {STATUS_LAPORAN.map((s, i) => (
        <li key={s} className={i < indeks ? "lewat" : i === indeks ? "sekarang" : ""}>
          <span className="rw-titik">{i + 1}</span>{LABEL_STATUS[s]}
        </li>
      ))}
    </ol>
  );
}

export default function LaporanView({ id, sesi }) {
  const { data, galat, memuat, muatUlang } = useData(() => detailLaporan(id), id);
  const [dialogHapus, setDialogHapus] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState({ jenis: "", teks: "" });
  const [error, setError] = useState(false);

  const laporan = data?.laporan;

  const kirimKonfirmasiUlang = async () => {
    setSibuk(true);
    try {
      const hasil = await konfirmasiUlang(id);
      setPesan({ jenis: "success", teks: hasil.message });
      muatUlang();
    } catch (err) {
      setPesan({ jenis: "error", teks: err.message });
      setError("konfirmasi")
    } finally {
      setSibuk(false);
    }
  };

  const hapus = async () => {
    setSibuk(true);
    try {
      await hapusLaporan(id);
      window.location.hash = "#/profil";
    } catch (err) {
      setPesan({ jenis: "error", teks: err.message });
      setError("hapus")
      setDialogHapus(false);
      setSibuk(false);
    }
  };

  if (memuat) return <Memuat teks="Memuat laporan..." />;
  if (galat) {
    return (
      <>
        <Galat pesan={galat} onUlang={muatUlang} />
        <p className="rw-tengah"><a href="#/beranda">← Kembali ke beranda</a></p>
      </>
    );
  }

  const bolehHapus = laporan.milikSaya || sesi.role === "admin";
  const { latitude, longitude, alamat } = laporan.lokasi;

  return (
    <>
      <a className="rw-kembali" href="#/beranda"><ArrowLeft size={15} /> Kembali</a>

      {laporan.statusValidasi === "TIDAK_VALID" && (
        <div className="rw-banner galat">
          <strong>Laporan ini dinyatakan tidak valid.</strong>
          {laporan.catatanPemeriksaan && <p>Catatan admin: {laporan.catatanPemeriksaan}</p>}
          {laporan.batasWaktu && (
            <p>Akan dihapus otomatis pada {tanggal(laporan.batasWaktu)} jika tidak dikonfirmasi ulang.</p>
          )}
          {laporan.milikSaya && (
            <button type="button" className="rw-btn rw-btn-utama" onClick={kirimKonfirmasiUlang} disabled={sibuk}>
              {sibuk ? "Mengirim..." : "Kirim konfirmasi ulang"}
            </button>
          )}
          {pesan.teks && error == "konfirmasi" && <p className={`form-message ${pesan.jenis}`} role="status">{pesan.teks}</p>}
        </div>
      )}

      <div className="rw-detail">
        <article className="rw-panel">
          <div className="rw-baris-lencana">
            <span className="rw-kategori">{laporan.kategori}</span>
            <LencanaStatus status={laporan.statusLaporan} />
            <LencanaTingkat tingkat={laporan.tingkatPermasalahan} />
            {laporan.statusValidasi !== "TIDAK_VALID" && <LencanaValidasi status={laporan.statusValidasi} />}
          </div>
          <h1>{laporan.namaMasalah}</h1>
          <p className="rw-deskripsi">{laporan.deskripsi || "Pelapor tidak menambahkan deskripsi."}</p>
          {laporan.tanggapanTeratas && (
            <section className="rw-tanggapan-teratas" aria-label="Tanggapan terbaru admin">
              <h2>Tanggapan admin</h2>
              <p>{laporan.tanggapanTeratas.deskripsiTanggapan || "Admin menyatakan laporan valid."}</p>
              <p className="rw-meta">
                Laporan {laporan.tanggapanTeratas.statusTanggapan ? "valid" : "tidak valid"}
                {" · "}{tanggal(laporan.tanggapanTeratas.waktuTanggapan)}
              </p>
              {sesi.role === "admin" && (
                <p className="rw-meta">
                  Ditanggapi oleh {laporan.tanggapanTeratas.namaAdmin || "Admin tidak tercatat"}
                </p>
              )}
            </section>
          )}
          <p className="rw-meta">
            <User size={13} aria-hidden="true" /> {laporan.pelapor ?? "Anonim"}
          </p>
          <div className="rw-meta-misc">
            {tanggal(laporan.waktuLapor)} ({waktuRelatif(laporan.waktuLapor)}) 
            <ThumbsUp size={13} aria-hidden="true" className="rw-ikon-geser" /> {laporan.jumlahUpvote} dukungan
            <p className="rw-meta-id">{laporan.idLaporan}</p>
          </div>
          {laporan.foto && <img className="rw-detail-foto" src={laporan.foto} alt={`Foto: ${laporan.namaMasalah}`} />}
          <p className="rw-meta-misc2">{alamat || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}</p>
          <div className="rw-aksi">
            {sesi.role === "admin" && (
              <a className="rw-btn rw-btn-garis" href={`#/periksa/${laporan.idLaporan}`}>
                <ClipboardCheck size={15} /> Periksa
              </a>
            )}
            {bolehHapus && (
              <button type="button" className="rw-btn rw-btn-bahaya-garis" onClick={() => setDialogHapus(true)}>
                <Trash2 size={15} /> Hapus
              </button>
            )}
          </div>
            {pesan.teks && error == "hapus" && <p className={`form-message ${pesan.jenis}`} role="status">{pesan.teks}</p>}
        </article>

        <aside className="rw-sisi">
          <section className="rw-panel">
            <h2>Status perjalanan laporan</h2>
            <PerjalananStatus status={laporan.statusLaporan} />
          </section>
          <section className="rw-panel">
            <h2>Titik Lokasi</h2>
            <PetaLaporan tengah={{ latitude, longitude }} zoom={16} laporan={[laporan]} tinggi={240} />
            <p className="rw-meta-misc">{alamat || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}</p>
            <a className="rw-btn rw-btn-garis rw-btn-peta"
              href={`#/peta?lat=${latitude}&lon=${longitude}&fokus=${laporan.idLaporan}`}>
              <IkonPeta size={15} /> Lihat di peta
            </a>
          </section>
        </aside>
      </div>

      {dialogHapus && (
        <DialogKonfirmasi judul="Hapus laporan ini?" bahaya labelYa="Hapus" sibuk={sibuk}
          pesan="Laporan beserta foto dan lokasinya akan dihapus permanen."
          onYa={hapus} onBatal={() => setDialogHapus(false)} />
      )}
    </>
  );
}
