import { useRef, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { upvote } from "../services/upvoteService.js";
import "./UpvoteTutorial.css";

// C12 - UpvoteView: tombol dukungan + jumlahnya pada satu laporan.
// Tidak tahu cara menyimpan data; hanya memanggil service dan menampilkan hasilnya.
export default function UpvoteView({ idLaporan, jumlahUpvote, sudahUpvote, bisaUpvote, onBerhasil }) {
  const [jumlah, setJumlah] = useState(jumlahUpvote);
  const [sudah, setSudah] = useState(sudahUpvote);
  const [memproses, setMemproses] = useState(false);
  const [pesan, setPesan] = useState(null); // { teks, tipe }
  const timer = useRef(null);

  // tampilkanPesanError() pada DPPL
  const tampilkanPesan = (teks, tipe) => {
    clearTimeout(timer.current);
    setPesan({ teks, tipe });
    timer.current = setTimeout(() => setPesan(null), 5000);
  };

  // klikUpvote() pada DPPL
  const klikUpvote = async () => {
    if (!bisaUpvote || sudah || memproses) return;
    setMemproses(true);
    try {
      const hasil = await upvote(idLaporan);
      setSudah(true); // updateUpvoteButton()
      setJumlah(hasil.jumlahUpvote); // tampilkanJumlahUpvote()
      tampilkanPesan("Dukungan Anda tercatat.", "sukses");
      if (onBerhasil) onBerhasil(idLaporan, hasil.jumlahUpvote);
    } catch (err) {
      if (err.status === 409) {
        setSudah(true);
        tampilkanPesan("Anda sudah mendukung laporan ini.", "galat");
      } else if (err.status === undefined) {
        tampilkanPesan("Dukungan gagal: koneksi terputus atau jaringan tidak stabil. Muat ulang halaman lalu coba lagi.", "galat");
      } else {
        tampilkanPesan(err.message || "Dukungan gagal. Coba lagi.", "galat");
      }
    } finally {
      setMemproses(false);
    }
  };

  const alasan = sudah
    ? "Anda sudah mendukung laporan ini"
    : !bisaUpvote ? "Laporan milik sendiri atau akun admin tidak dapat mendukung" : "Dukung laporan ini";

  return (
    <div className="uv-wadah">
      <button
        type="button"
        className={`uv-tombol${sudah ? " uv-sudah" : ""}${!bisaUpvote ? " uv-terkunci" : ""}`}
        onClick={klikUpvote}
        disabled={!bisaUpvote || sudah || memproses}
        aria-pressed={sudah}
        aria-label={`${sudah ? "Sudah didukung" : "Dukung laporan"}. Total ${jumlah} dukungan`}
        title={alasan}
      >
        <ThumbsUp size={14} aria-hidden="true" />
        <span>{jumlah} dukungan</span>
      </button>
      {pesan && (
        <p className={`uv-pesan ${pesan.tipe}`} role={pesan.tipe === "galat" ? "alert" : "status"}>{pesan.teks}</p>
      )}
    </div>
  );
}
