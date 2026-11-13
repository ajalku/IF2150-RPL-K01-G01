import { ArrowRight, ArrowUp, ImageOff, MapPin } from "lucide-react";
import { LencanaTingkat } from "./Lencana.jsx";
import { formatJarak } from "../utils/format.js";

// Label progres untuk lencana kedua pada kartu: gabungan status penanganan dan status validasi.
function labelProgres({ statusLaporan, statusValidasi }) {
  if (statusLaporan === "SELESAI") return "Selesai";
  if (statusLaporan === "DIPERBAIKI") return "Diproses";
  if (statusValidasi === "VALID") return "Terverifikasi";
  if (statusValidasi === "TIDAK_VALID") return "Tidak valid";
  return "Menunggu verifikasi";
}

const formatTanggal = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

// Kartu "Kabar lingkungan" di beranda. Kartu ringkas untuk daftar peta / halaman periksa
// tetap memakai KartuLaporan.jsx.
export default function KartuBeranda({ laporan, jarakKm }) {
  const { idLaporan, namaMasalah, kategori, foto, lokasi, deskripsi, jumlahUpvote, pelapor, waktuLapor } = laporan;

  return (
    <article className="br-kartu">
      <div className="br-kartu-foto">
        {foto ? <img src={foto} alt="" loading="lazy" /> : <ImageOff size={28} aria-hidden="true" />}
      </div>

      <div className="br-kartu-isi">
        <div className="br-kartu-atas">
          <span className="br-kartu-penulis">{pelapor ?? "Anonim"} · {formatTanggal(waktuLapor)}</span>
          <span className="br-kartu-kategori">{kategori}</span>
        </div>

        <h3><a href={`#/laporan/${idLaporan}`}>{namaMasalah}</a></h3>

        <p className="br-kartu-lokasi">
          <MapPin size={14} aria-hidden="true" />
          <span>
            {lokasi.alamat || `${lokasi.latitude.toFixed(4)}, ${lokasi.longitude.toFixed(4)}`}
            {jarakKm !== undefined && <> • {formatJarak(jarakKm)} dari Anda</>}
          </span>
        </p>

        <div className="br-kartu-lencana">
          <LencanaTingkat tingkat={laporan.tingkatPermasalahan} />
          <span className="br-lencana-netral">{labelProgres(laporan)}</span>
        </div>

        {deskripsi && <p className="br-kartu-deskripsi">{deskripsi}</p>}

        <div className="br-kartu-bawah">
          <span className="br-kartu-dukungan"><ArrowUp size={14} aria-hidden="true" /> {jumlahUpvote} dukungan</span>
          <a className="br-kartu-lihat" href={`#/laporan/${idLaporan}`}>Lihat laporan <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  );
}
