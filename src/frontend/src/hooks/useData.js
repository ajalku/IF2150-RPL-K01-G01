import { useCallback, useEffect, useRef, useState } from "react";

// Mengambil data dari API setiap kali `kunci` berubah.
// `memuat` diturunkan dari perbandingan kunci, jadi tidak ada setState sinkron di dalam effect.
export function useData(ambil, kunci) {
  const [versi, setVersi] = useState(0);
  const [hasil, setHasil] = useState({ kunci: null, data: null, galat: "" });
  const kunciLengkap = `${kunci}#${versi}`;

  const ambilRef = useRef(ambil);
  useEffect(() => {
    ambilRef.current = ambil;
  });

  useEffect(() => {
    let batal = false;
    ambilRef.current()
      .then((data) => { if (!batal) setHasil({ kunci: kunciLengkap, data, galat: "" }); })
      .catch((err) => { if (!batal) setHasil({ kunci: kunciLengkap, data: null, galat: err.message }); });
    return () => { batal = true; };
  }, [kunciLengkap]);

  const muatUlang = useCallback(() => setVersi((v) => v + 1), []);
  return { data: hasil.data, galat: hasil.galat, memuat: hasil.kunci !== kunciLengkap, muatUlang };
}
