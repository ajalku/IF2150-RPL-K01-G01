export default function DialogKonfirmasi({ judul, pesan, labelYa = "Ya", bahaya = false, sibuk = false, onYa, onBatal }) {
  return (
    <div className="rw-overlay" role="presentation" onClick={sibuk ? undefined : onBatal}>
      <div className="rw-dialog" role="alertdialog" aria-modal="true" aria-labelledby="rw-dialog-judul"
        onClick={(e) => e.stopPropagation()}>
        <h3 id="rw-dialog-judul">{judul}</h3>
        <p>{pesan}</p>
        <div className="rw-dialog-aksi">
          <button type="button" className="rw-btn rw-btn-garis" onClick={onBatal} disabled={sibuk}>Batal</button>
          <button type="button" className={`rw-btn ${bahaya ? "rw-btn-bahaya" : "rw-btn-utama"}`}
            onClick={onYa} disabled={sibuk}>
            {sibuk ? "Memproses..." : labelYa}
          </button>
        </div>
      </div>
    </div>
  );
}
