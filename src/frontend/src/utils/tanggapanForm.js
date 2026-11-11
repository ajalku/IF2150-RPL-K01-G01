// C13 - Aksi hanya boleh menyimpan setelah admin mengonfirmasi.
export function simpanJikaTerkonfirmasi(dikonfirmasi, simpan) {
  if (!dikonfirmasi) return false;
  return simpan();
}
