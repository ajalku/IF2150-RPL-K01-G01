export function Memuat({ teks = "Memuat..." }) {
  return <p className="rw-keadaan" role="status">{teks}</p>;
}

export function Galat({ pesan, onUlang }) {
  return (
    <div className="rw-keadaan galat" role="alert">
      <p>{pesan}</p>
      {onUlang && <button type="button" className="rw-btn rw-btn-garis" onClick={onUlang}>Coba lagi</button>}
    </div>
  );
}

export function Kosong({ children }) {
  return <div className="rw-keadaan">{children}</div>;
}
