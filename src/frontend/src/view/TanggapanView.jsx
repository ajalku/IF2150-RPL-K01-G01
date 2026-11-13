import { useState } from "react";
import DialogKonfirmasi from "../components/DialogKonfirmasi.jsx";
import { simpanHasilTanggapan } from "../services/tanggapanService.js";
import { LABEL_STATUS, STATUS_LAPORAN } from "../utils/format.js";
import { simpanJikaTerkonfirmasi } from "../utils/tanggapanForm.js";

// C13 - TanggapanView
export default function TanggapanView({ laporan, onSelesai }) {
  const validAwal = laporan.statusValidasi === "VALID"
    ? true
    : laporan.statusValidasi === "TIDAK_VALID"
      ? false
      : null;
  const [popupTerbuka, setPopupTerbuka] = useState(false);
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const [dataPopupForm, setDataPopupForm] = useState({
    statusTanggapan: validAwal,
    deskripsiTanggapan: "",
  });
  const [catatanPemeriksaan, setCatatanPemeriksaan] = useState(laporan.catatanPemeriksaan ?? "");
  const [statusLaporan, setStatusLaporan] = useState(laporan.statusLaporan);
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);

  // C13 - tampilkanPopup(idLaporan)
  const tampilkanPopup = (idLaporan) => {
    if (!idLaporan) return;
    setGalat("");
    setPopupTerbuka(true);
  };

  // C13 - tampilkanKonfirmasi(dataPopupForm)
  const tampilkanKonfirmasi = (form) => {
    setDataPopupForm(form);
    setKonfirmasiTerbuka(true);
  };

  // C13 - submitPopupForm(dataPopupForm)
  const submitPopupForm = (event) => {
    event.preventDefault();
    const deskripsi = dataPopupForm.deskripsiTanggapan.trim();
    if (typeof dataPopupForm.statusTanggapan !== "boolean") {
      setGalat("Pilih hasil pemeriksaan laporan.");
      return false;
    }
    if (!dataPopupForm.statusTanggapan && !deskripsi) {
      setGalat("Alasan tanggapan wajib diisi untuk laporan tidak valid.");
      return false;
    }
    if (deskripsi.length > 2000 || catatanPemeriksaan.trim().length > 1000) {
      setGalat("Tanggapan maksimal 2000 karakter dan catatan pemeriksaan maksimal 1000 karakter.");
      return false;
    }

    setGalat("");
    tampilkanKonfirmasi({ ...dataPopupForm, deskripsiTanggapan: deskripsi });
    return true;
  };

  // C13 - Konfirmasi menyimpan; membatalkan hanya menutup konfirmasi tanpa mengirim request.
  const konfirmasiSimpan = async () => {
    setSibuk(true);
    setGalat("");
    try {
      const hasil = await simpanHasilTanggapan(laporan.idLaporan, {
        ...dataPopupForm,
        catatanPemeriksaan: catatanPemeriksaan.trim(),
        statusLaporan,
      });
      setKonfirmasiTerbuka(false);
      setPopupTerbuka(false);
      onSelesai(hasil.message);
    } catch (err) {
      setKonfirmasiTerbuka(false);
      setGalat(err.message);
    } finally {
      setSibuk(false);
    }
  };

  return (
    <>
      <button type="button" className="rw-btn rw-btn-utama" onClick={() => tampilkanPopup(laporan.idLaporan)}>
        Isi hasil pemeriksaan dan tanggapan
      </button>

      {popupTerbuka && (
        <div className="rw-overlay" role="presentation" onClick={() => setPopupTerbuka(false)}>
          <section className="rw-dialog rw-dialog-form" role="dialog" aria-modal="true" aria-labelledby="rw-tanggapan-judul"
            onClick={(event) => event.stopPropagation()}>
            <h2 id="rw-tanggapan-judul">Hasil pemeriksaan laporan</h2>
            <p>{laporan.namaMasalah}</p>
            <form className="rw-form" onSubmit={submitPopupForm}>
              <fieldset className="rw-pilihan">
                <legend>Hasil pemeriksaan</legend>
                <label className={dataPopupForm.statusTanggapan === true ? "dipilih" : ""}>
                  <input type="radio" name="statusTanggapan" checked={dataPopupForm.statusTanggapan === true}
                    onChange={() => setDataPopupForm((data) => ({ ...data, statusTanggapan: true }))} />
                  Laporan valid
                </label>
                <label className={dataPopupForm.statusTanggapan === false ? "dipilih" : ""}>
                  <input type="radio" name="statusTanggapan" checked={dataPopupForm.statusTanggapan === false}
                    onChange={() => setDataPopupForm((data) => ({ ...data, statusTanggapan: false }))} />
                  Laporan tidak valid
                </label>
              </fieldset>
              {dataPopupForm.statusTanggapan === false && (
                <p className="rw-bantu">Pelapor punya waktu 2 minggu untuk konfirmasi ulang sebelum laporan dihapus otomatis.</p>
              )}
              <div className="rw-field">
                <label htmlFor="catatanPemeriksaan">Catatan pemeriksaan</label>
                <textarea id="catatanPemeriksaan" rows={3} maxLength={1000} value={catatanPemeriksaan}
                  onChange={(event) => setCatatanPemeriksaan(event.target.value)}
                  placeholder="Catatan pemeriksaan untuk pelapor" />
              </div>
              <div className="rw-field">
                <label htmlFor="deskripsiTanggapan">
                  Tanggapan {dataPopupForm.statusTanggapan === false ? "(wajib untuk laporan tidak valid)" : ""}
                </label>
                <textarea id="deskripsiTanggapan" rows={4} maxLength={2000}
                  value={dataPopupForm.deskripsiTanggapan}
                  onChange={(event) => setDataPopupForm((data) => ({
                    ...data,
                    deskripsiTanggapan: event.target.value,
                  }))}
                  placeholder="Tulis tanggapan admin terhadap laporan" />
              </div>
              <div className="rw-field">
                <label htmlFor="statusLaporan">Status penanganan</label>
                <select id="statusLaporan" value={statusLaporan} onChange={(event) => setStatusLaporan(event.target.value)}>
                  {STATUS_LAPORAN.map((status) => (
                    <option key={status} value={status}>{LABEL_STATUS[status]}</option>
                  ))}
                </select>
              </div>
              {galat && <p className="form-message error" role="alert">{galat}</p>}
              <div className="rw-dialog-aksi">
                <button type="button" className="rw-btn rw-btn-garis" onClick={() => setPopupTerbuka(false)}>
                  Batal
                </button>
                <button type="submit" className="rw-btn rw-btn-utama">Tinjau dan simpan</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {konfirmasiTerbuka && (
        <DialogKonfirmasi
          judul="Simpan hasil pemeriksaan?"
          pesan={[
            `Laporan ${dataPopupForm.statusTanggapan ? "dinyatakan valid" : "dinyatakan tidak valid"}.`,
            `Status penanganan: ${LABEL_STATUS[statusLaporan]}.`,
            `Tanggapan: ${dataPopupForm.deskripsiTanggapan || "Tidak ada tanggapan tambahan."}`,
          ].join("\n")}
          labelYa="Simpan hasil"
          sibuk={sibuk}
          onYa={() => simpanJikaTerkonfirmasi(true, konfirmasiSimpan)}
          onBatal={() => {
            simpanJikaTerkonfirmasi(false, konfirmasiSimpan);
            setKonfirmasiTerbuka(false);
          }}
        />
      )}
    </>
  );
}
