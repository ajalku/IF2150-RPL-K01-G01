import { useEffect, useMemo, useState } from "react";

// Router sederhana berbasis hash: #/laporan/<id>?x=1  ->  { nama: "laporan", id, query }
// Hash dipilih agar refresh & tombol Back browser tetap bekerja tanpa pengaturan server.
function urai(hash) {
  const [path, query = ""] = hash.replace(/^#/, "").split("?");
  const bagian = path.split("/").filter(Boolean);
  return { nama: bagian[0] ?? "beranda", id: bagian[1] ?? null, query: new URLSearchParams(query) };
}

export function useRute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const saatBerubah = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", saatBerubah);
    return () => window.removeEventListener("hashchange", saatBerubah);
  }, []);

  return useMemo(() => urai(hash), [hash]);
}
