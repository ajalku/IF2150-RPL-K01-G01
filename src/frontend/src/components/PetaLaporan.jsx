import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LABEL_STATUS, WARNA_STATUS } from "../utils/format.js";

const DEFAULT_PUSAT = [-6.9175, 107.6191]; // Bandung; dipakai bila belum ada titik apa pun
const RADIUS_MARKER = { RENDAH: 8, SEDANG: 10, TINGGI: 13 };

function PindahKe({ latitude, longitude, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (latitude === undefined) return;
    map.setView([latitude, longitude], zoom ?? map.getZoom());
  }, [map, latitude, longitude, zoom]);
  return null;
}

function TangkapKlik({ onKlik }) {
  useMapEvents({
    click: (e) => onKlik?.({ latitude: e.latlng.lat, longitude: e.latlng.lng }),
  });
  return null;
}

// Marker memakai CircleMarker (bukan ikon gambar) sehingga bebas dari masalah ikon Leaflet di Vite.
export default function PetaLaporan({
  tengah, zoom, laporan = [], lokasiPengguna, titik, fokusId, onKlik, onPilih, tinggi = 420,
}) {
  return (
    <div className="rw-peta" style={{ height: tinggi }}>
      <MapContainer center={tengah ? [tengah.latitude, tengah.longitude] : DEFAULT_PUSAT}
        zoom={tengah ? (zoom ?? 15) : 12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        <PindahKe latitude={tengah?.latitude} longitude={tengah?.longitude} zoom={zoom} />
        {onKlik && <TangkapKlik onKlik={onKlik} />}

        {laporan.map((l) => {
          const dipilih = l.idLaporan === fokusId;
          return (
            <CircleMarker key={l.idLaporan} center={[l.lokasi.latitude, l.lokasi.longitude]}
              radius={RADIUS_MARKER[l.tingkatPermasalahan] ?? 10}
              pathOptions={{
                color: dipilih ? "#113f49" : "#ffffff", weight: dipilih ? 4 : 2,
                fillColor: WARNA_STATUS[l.statusLaporan], fillOpacity: 0.95,
              }}
              eventHandlers={{ click: () => onPilih?.(l.idLaporan) }}>
              <Popup>
                <strong>{l.namaMasalah}</strong><br />
                {l.kategori} · {LABEL_STATUS[l.statusLaporan]}<br />
                <a href={`#/laporan/${l.idLaporan}`}>Lihat laporan</a>
              </Popup>
            </CircleMarker>
          );
        })}

        {lokasiPengguna && (
          <CircleMarker center={[lokasiPengguna.latitude, lokasiPengguna.longitude]} radius={7}
            pathOptions={{ color: "#fff", weight: 3, fillColor: "#2563eb", fillOpacity: 1 }}>
            <Tooltip direction="top">Lokasi Anda</Tooltip>
          </CircleMarker>
        )}

        {titik && (
          <CircleMarker center={[titik.latitude, titik.longitude]} radius={11}
            pathOptions={{ color: "#fff", weight: 3, fillColor: "#d6336c", fillOpacity: 1 }}>
            <Tooltip direction="top" permanent>Titik laporan</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
