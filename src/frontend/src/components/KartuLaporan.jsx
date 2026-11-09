import { Clock, ImageOff, MapPin, ThumbsUp } from "lucide-react";
import { LencanaStatus, LencanaTingkat, LencanaValidasi } from "./Lencana.jsx";
import { formatJarak, waktuRelatif } from "../utils/format.js";

// onKlik opsional: jika diberikan, kartu memilih laporan (daftar di peta / halaman periksa)
// alih-alih membuka halaman detail. `children` = area tombol aksi tambahan.
export default function KartuLaporan({ laporan, aktif = false, onKlik, children }) {
  const { idLaporan, namaMasalah, kategori, foto, lokasi, statusLaporan, statusValidasi } = laporan;

  const saatKlik = onKlik ? (e) => { e.preventDefault(); onKlik(laporan); } : undefined;

  return (
    <article className={`rw-kartu${aktif ? " aktif" : ""}`}>
      <div className="rw-kartu-foto">
        {foto ? <img src={foto} alt="" loading="lazy" /> : <ImageOff size={22} aria-hidden="true" />}
      </div>
      <div className="rw-kartu-isi">
        <h3>
          <a href={`#/laporan/${idLaporan}`} onClick={saatKlik}>{namaMasalah}</a>
        </h3>
        <div className="rw-baris-lencana">
          <span className="rw-kategori">{kategori}</span>
          <LencanaStatus status={statusLaporan} />
          <LencanaTingkat tingkat={laporan.tingkatPermasalahan} />
          {statusValidasi === "TIDAK_VALID" && <LencanaValidasi status={statusValidasi} />}
        </div>
        <p className="rw-meta">
          <MapPin size={13} aria-hidden="true" />
          <span>{lokasi.alamat || `${lokasi.latitude.toFixed(4)}, ${lokasi.longitude.toFixed(4)}`}</span>
        </p>
        <p className="rw-meta">
          <Clock size={13} aria-hidden="true" /> {waktuRelatif(laporan.waktuLapor)}
          <ThumbsUp size={13} aria-hidden="true" className="rw-ikon-geser" /> {laporan.jumlahUpvote}
          {laporan.jarakKm !== undefined && <strong className="rw-jarak">{formatJarak(laporan.jarakKm)}</strong>}
        </p>
        {children}
      </div>
    </article>
  );
}
