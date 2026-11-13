import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "./UpvoteTutorial.css";

// C14 - TutorialView: panel tutorial navigasi (UC05) dengan tombol Lanjut, Lewati, dan Selesai.
// Langkah saat ini dipegang di sini (client): "Lanjut" (nextTutorial pada DPPL) tidak perlu ke server.
export default function TutorialView({ langkah, onSkip, onSelesai, onTutup }) {
  const [langkahSaatIni, setLangkahSaatIni] = useState(1);
  const [memproses, setMemproses] = useState(false);
  const [pesan, setPesan] = useState("");
  const panel = useRef(null);

  useEffect(() => {
    panel.current?.focus();
  }, []);

  const total = langkah.length;
  const terakhir = langkahSaatIni === total;
  const isi = langkah[langkahSaatIni - 1]; // tampilkanLangkah()

  const lanjut = () => setLangkahSaatIni((n) => Math.min(n + 1, total));

  // Aksi yang menyimpan ke server. Jika gagal, panel tetap terbuka dan memberi tahu (tampilkanPesanError).
  const jalankan = async (aksi, pesanGagal) => {
    if (memproses) return;
    setMemproses(true);
    setPesan("");
    try {
      await aksi();
      onTutup(); // tutupTutorial()
    } catch (err) {
      setPesan(err.message || pesanGagal);
      setMemproses(false);
    }
  };

  const lewati = () => jalankan(onSkip, "Tutorial gagal ditutup. Coba lagi.");
  const selesai = () => jalankan(() => onSelesai(langkahSaatIni), "Status tutorial gagal disimpan. Coba lagi.");

  return (
    <section
      ref={panel}
      className="tt-panel"
      role="dialog"
      aria-labelledby="tt-judul"
      tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") lewati(); }}
    >
      <div className="tt-kepala">
        <span>Langkah {langkahSaatIni} dari {total}</span>
        <button type="button" className="tt-tutup" onClick={lewati} disabled={memproses} aria-label="Lewati tutorial">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="tt-progres" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={langkahSaatIni}>
        {langkah.map((_, i) => <span key={i} className={i < langkahSaatIni ? "terisi" : ""} />)}
      </div>
      <h2 id="tt-judul">{isi.judul}</h2>
      <p>{isi.isi}</p>
      {pesan && <p className="tt-galat" role="alert">{pesan}</p>}
      <div className="tt-aksi">
        {!terakhir && <button type="button" className="rw-btn rw-btn-garis" onClick={lewati} disabled={memproses}>Lewati</button>}
        {terakhir
          ? <button type="button" className="rw-btn rw-btn-utama" onClick={selesai} disabled={memproses}>{memproses ? "Menyimpan..." : "Selesai"}</button>
          : <button type="button" className="rw-btn rw-btn-utama" onClick={lanjut} disabled={memproses}>Lanjut</button>}
      </div>
    </section>
  );
}
