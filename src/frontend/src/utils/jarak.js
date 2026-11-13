const keRadian = (derajat) => (derajat * Math.PI) / 180;

// Jarak dua koordinat (Haversine), hasil dalam kilometer.
export function hitungJarakKm(a, b) {
  const dLat = keRadian(b.latitude - a.latitude);
  const dLon = keRadian(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(keRadian(a.latitude)) * Math.cos(keRadian(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
