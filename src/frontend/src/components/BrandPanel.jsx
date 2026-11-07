import { Eye, Users, MapPin } from 'lucide-react';
import brandIcon from '../assets/brand-icon.svg';
import townPreview from '../assets/kota-preview.jpg';
export default function BrandPanel() {
  return <aside className="brand-panel">
    <div className="brand-logo"><img src={brandIcon} alt=""/><div><strong>RAWAT</strong><span>Ruang Aspirasi Warga dan Aduan Terpadu</span></div></div>
    <div className="brand-content">
      <p className="eyebrow">DARI WARGA, UNTUK KOTA.</p>
      <h1>Kota yang nyaman,<br/>dimulai dari kita.</h1>
      <p className="brand-desc">Ada trotoar rusak atau fasilitas yang perlu perhatian? Sampaikan di RAWAT. Kita kawal perbaikannya bersama.</p>
      <div className="town-image"><img src={townPreview} alt="Suasana jalan kota dengan pepohonan dan pejalan kaki"/><div className="town-sticker"><MapPin size={13}/> Ruang bersama, tanggung jawab bersama.</div></div>
      <div className="brand-highlights"><span><Eye size={14}/> Terbuka & terlacak</span><span><Users size={14}/> Suara warga berarti</span></div>
      <small className="brand-foot">RAWAT • Ruang Aspirasi Warga dan Aduan Terpadu</small>
    </div>
  </aside>;
}
