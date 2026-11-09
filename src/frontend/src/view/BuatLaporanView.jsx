import { useEffect, useState } from "react";
import { ImagePlus, LocateFixed, Search, Send } from "lucide-react";
import DialogKonfirmasi from "../components/DialogKonfirmasi.jsx";
import PetaLaporan from "../components/PetaLaporan.jsx";
import { buatLaporan } from "../services/laporanService.js";
import { geocode } from "../services/lokasiService.js";
import { KATEGORI, LABEL_TINGKAT } from "../utils/format.js";

const AWAL = {
  namaMasalah: "", kategori: "", kategoriLain: "", tingkat: "SEDANG",
  privasi: "PUBLIK", alamat: "", deskripsi: "",
};
const FORMAT_FOTO = ["image/jpeg", "image/png"];
const MAKS_FOTO_MB = 5;

export default function BuatLaporanView() {
  const [form, setForm] = useState(AWAL);
  const [titik, setTitik] = useState(null);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [pesan, setPesan] = useState("");
  const [mencari, setMencari] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const ubah = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const pilihFoto = (e) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    if (!FORMAT_FOTO.includes(berkas.type)) {
      setPesan("Format foto harus JPG, JPEG, atau PNG.");
      e.target.value = "";
      return;
    }
    if (berkas.size > MAKS_FOTO_MB * 1024 * 1024) {
      setPesan(`Ukuran foto maksimal ${MAKS_FOTO_MB} MB.`);
      e.target.value = "";
      return;
    }
    setPesan("");
    setFoto(berkas);
    setPreview(URL.createObjectURL(berkas));
  };

  const cariAlamat = async () => {
    if (form.alamat.trim() === "") {
      setPesan("Isi alamat terlebih dahulu.");
      return;
    }
    setMencari(true);
    setPesan("");
    try {
      const hasil = await geocode(form.alamat.trim());
      setTitik({ latitude: hasil.latitude, longitude: hasil.longitude });
      setForm((f) => ({ ...f, alamat: hasil.alamat }));
    } catch (err) {
      setPesan(err.status === 404
        ? "Alamat tidak ditemukan. Klik langsung pada peta untuk menandai lokasi."
        : err.message);
    } finally {
      setMencari(false);
    }
  };

  const pakaiLokasiSaya = () => {
    if (!navigator.geolocation) {
      setPesan("Browser ini tidak mendukung lokasi. Klik pada peta untuk menandai lokasi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setTitik({ latitude: coords.latitude, longitude: coords.longitude }); setPesan(""); },
      () => setPesan("Izin lokasi ditolak. Klik pada peta untuk menandai lokasi."),
    );
  };

  const kategoriAkhir = form.kategori === "Lainnya" ? form.kategoriLain.trim() : form.kategori;

  const mintaKonfirmasi = (e) => {
    e.preventDefault();
    if (form.namaMasalah.trim() === "" || kategoriAkhir === "") {
      setPesan("Nama masalah dan kategori wajib diisi.");
    } else if (!titik && form.alamat.trim() === "") {
      setPesan("Tandai lokasi di peta atau isi alamat.");
    } else {
      setPesan("");
      setKonfirmasi(true);
    }
  };

  const kirim = async () => {
    setMengirim(true);
    const data = new FormData();
    data.append("namaMasalah", form.namaMasalah.trim());
    data.append("kategori", kategoriAkhir);
    data.append("tingkatPermasalahan", form.tingkat);
    data.append("statusPrivasi", form.privasi);
    data.append("deskripsi", form.deskripsi.trim());
    if (form.alamat.trim()) data.append("alamat", form.alamat.trim());
    if (titik) {
      data.append("latitude", titik.latitude);
      data.append("longitude", titik.longitude);
    }
    if (foto) data.append("foto", foto);

    try {
      const hasil = await buatLaporan(data);
      window.location.hash = `#/laporan/${hasil.idLaporan}`;
    } catch (err) {
      setPesan(err.message);
      setKonfirmasi(false);
      setMengirim(false);
    }
  };

  return (
    <>
      <section className="rw-judul">
        <div>
          <h1>Buat Laporan</h1>
          <p>Ceritakan masalah yang Anda temui. Laporan akan diperiksa admin sebelum diproses.</p>
        </div>
      </section>

      <form className="rw-panel rw-form" onSubmit={mintaKonfirmasi} noValidate>
        <div className="rw-field">
          <label htmlFor="namaMasalah">Nama masalah</label>
          <input id="namaMasalah" name="namaMasalah" maxLength={150} placeholder="Contoh: Lubang besar di tengah jalan"
            value={form.namaMasalah} onChange={ubah} required />
        </div>

        <div className="rw-dua-kolom">
          <div className="rw-field">
            <label htmlFor="kategori">Kategori</label>
            <select id="kategori" name="kategori" value={form.kategori} onChange={ubah} required>
              <option value="">Pilih kategori</option>
              {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
              <option value="Lainnya">Lainnya...</option>
            </select>
          </div>
          {form.kategori === "Lainnya" && (
            <div className="rw-field">
              <label htmlFor="kategoriLain">Kategori lain</label>
              <input id="kategoriLain" name="kategoriLain" maxLength={50} placeholder="Tulis kategori"
                value={form.kategoriLain} onChange={ubah} />
            </div>
          )}
        </div>

        <fieldset className="rw-pilihan">
          <legend>Tingkat urgensi</legend>
          {Object.entries(LABEL_TINGKAT).map(([nilai, label]) => (
            <label key={nilai} className={form.tingkat === nilai ? "dipilih" : ""}>
              <input type="radio" name="tingkat" value={nilai} checked={form.tingkat === nilai} onChange={ubah} />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="rw-pilihan">
          <legend>Visibilitas pelapor</legend>
          <label className={form.privasi === "PUBLIK" ? "dipilih" : ""}>
            <input type="radio" name="privasi" value="PUBLIK" checked={form.privasi === "PUBLIK"} onChange={ubah} />
            Tampilkan nama saya
          </label>
          <label className={form.privasi === "ANONIM" ? "dipilih" : ""}>
            <input type="radio" name="privasi" value="ANONIM" checked={form.privasi === "ANONIM"} onChange={ubah} />
            Anonim (hanya admin yang tahu)
          </label>
        </fieldset>

        <div className="rw-field">
          <label htmlFor="alamat">Lokasi</label>
          <div className="rw-gabung">
            <input id="alamat" name="alamat" placeholder="Ketik alamat, lalu tekan Cari" value={form.alamat}
              onChange={ubah} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); cariAlamat(); } }} />
            <button type="button" className="rw-btn rw-btn-garis" onClick={cariAlamat} disabled={mencari}>
              <Search size={15} /> {mencari ? "Mencari..." : "Cari"}
            </button>
            <button type="button" className="rw-btn rw-btn-garis" onClick={pakaiLokasiSaya}>
              <LocateFixed size={15} /> Lokasi saya
            </button>
          </div>
          <small className="rw-bantu">Klik pada peta untuk menandai titik yang tepat.</small>
          <PetaLaporan tengah={titik ?? undefined} titik={titik} onKlik={setTitik} tinggi={320} />
        </div>

        <div className="rw-field">
          <label htmlFor="foto">Foto (opsional)</label>
          <label className="rw-unggah" htmlFor="foto">
            {preview ? <img src={preview} alt="Pratinjau foto laporan" />
              : <span><ImagePlus size={20} /> Pilih foto JPG/PNG, maks. {MAKS_FOTO_MB} MB</span>}
          </label>
          <input id="foto" className="rw-sembunyi" type="file" accept="image/jpeg,image/png" onChange={pilihFoto} />
        </div>

        <div className="rw-field">
          <label htmlFor="deskripsi">Deskripsi (opsional)</label>
          <textarea id="deskripsi" name="deskripsi" rows={4} maxLength={2000}
            placeholder="Jelaskan kondisi, sejak kapan, dan dampaknya" value={form.deskripsi} onChange={ubah} />
        </div>

        {pesan && <p className="form-message error" role="alert">{pesan}</p>}

        <div className="rw-aksi rw-aksi-kanan">
          <a className="rw-btn rw-btn-garis" href="#/beranda">Batal</a>
          <button type="submit" className="rw-btn rw-btn-utama"><Send size={15} /> Kirim laporan</button>
        </div>
      </form>

      {konfirmasi && (
        <DialogKonfirmasi judul="Kirim laporan?" labelYa="Kirim" sibuk={mengirim}
          pesan="Pastikan data dan lokasi sudah benar. Laporan akan diperiksa admin."
          onYa={kirim} onBatal={() => setKonfirmasi(false)} />
      )}
    </>
  );
}
