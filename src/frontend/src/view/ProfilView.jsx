import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  Check,
  CircleUserRound,
  ClipboardList,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import KartuLaporan from "../components/KartuLaporan.jsx";
import { Galat, Kosong, Memuat } from "../components/Keadaan.jsx";
import { useData } from "../hooks/useData.js";
import { laporanDitangani, laporanSaya } from "../services/laporanService.js";
import { getProfil, perbaruiProfil, ubahKataSandi } from "../services/profileService.js";
import "./ProfilView.css";

const FORMAT_TELP = /^08\d{8,13}$/;
const LAPORAN_KOSONG = [];

function inisial(nama = "") {
  return nama.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((bagian) => bagian[0].toLocaleUpperCase("id-ID")).join("") || "W";
}

function namaPeran(role) {
  if (role === "admin") return "Admin";
  return "Warga";
}

function pesanKesalahan(err) {
  if (err.message === "Current password is incorrect.") {
    return "Kata sandi saat ini tidak sesuai.";
  }
  if (err.message === "Password confirmation does not match.") {
    return "Konfirmasi kata sandi baru tidak cocok.";
  }
  if (err.status === 500) {
    return "Terjadi kesalahan pada server. Silakan coba lagi.";
  }
  return err.message;
}

function PesanForm({ pesan }) {
  if (!pesan.teks) return null;
  return (
    <p className={`rw-profile-message ${pesan.jenis}`} role={pesan.jenis === "error" ? "alert" : "status"}>
      {pesan.teks}
    </p>
  );
}

function FieldKataSandi({ id, label, value, onChange, terlihat, onToggle, autoComplete }) {
  const IkonVisibilitas = terlihat ? EyeOff : Eye;
  return (
    <div className="rw-profile-field">
      <label htmlFor={id}>{label}</label>
      <div className="rw-profile-password-input">
        <input
          id={id}
          name={id}
          type={terlihat ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="rw-profile-toggle-password"
          onClick={onToggle}
          aria-label={`${terlihat ? "Sembunyikan" : "Tampilkan"} ${label.toLocaleLowerCase("id-ID")}`}
        >
          <IkonVisibilitas size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function ProfilView({
  sesi,
  onLogout,
  onProfileUpdated,
  modeProfil = "profil",
  onUbahProfil,
  onBatalUbahProfil,
  onHapusAkun,
}) {
  const [profil, setProfil] = useState(null);
  const [memuatProfil, setMemuatProfil] = useState(true);
  const [galatProfil, setGalatProfil] = useState("");
  const [nama, setNama] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [menyimpanProfil, setMenyimpanProfil] = useState(false);
  const [pesanProfil, setPesanProfil] = useState({ jenis: "", teks: "" });
  const [passwordTerbuka, setPasswordTerbuka] = useState(false);
  const [menyimpanPassword, setMenyimpanPassword] = useState(false);
  const [pesanPassword, setPesanPassword] = useState({ jenis: "", teks: "" });
  const [kataSandi, setKataSandi] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordTerlihat, setPasswordTerlihat] = useState({});
  const [tampilkanSemuaLaporan, setTampilkanSemuaLaporan] = useState(false);
  const [bagianAktif, setBagianAktif] = useState("informasi");
  const isAdmin = (profil?.role ?? sesi?.role) === "admin";
  const isWarga = (profil?.role ?? sesi?.role) === "warga";
  const { data: dataLaporan, galat: galatLaporan, memuat: memuatLaporan, muatUlang } =
    useData(
      isAdmin ? laporanDitangani : laporanSaya,
      isAdmin ? "laporan-ditangani" : "laporan-saya",
    );

  useEffect(() => {
    let batal = false;
    getProfil()
      .then(({ pengguna }) => {
        if (batal) return;
        if (!pengguna) throw new Error("Data profil tidak ditemukan.");
        setProfil(pengguna);
        setNama(pengguna.nama ?? "");
        setNoTelp(pengguna.noTelp ?? "");
      })
      .catch((err) => {
        if (!batal) setGalatProfil(err.message);
      })
      .finally(() => {
        if (!batal) setMemuatProfil(false);
      });

    return () => { batal = true; };
  }, []);

  const laporan = dataLaporan?.laporan ?? LAPORAN_KOSONG;
  const statistik = useMemo(() => ({
    total: laporan.length,
    aktif: laporan.filter((item) => item.statusLaporan !== "SELESAI").length,
    selesai: laporan.filter((item) => item.statusLaporan === "SELESAI").length,
    dukungan: laporan.reduce((total, item) => total + (Number(item.jumlahUpvote) || 0), 0),
  }), [laporan]);

  const profilBerubah = profil !== null && (
    nama !== (profil.nama ?? "") || noTelp !== (profil.noTelp ?? "")
  );
  const sedangMengubahProfil = modeProfil === "ubah";

  const bukaBagian = (id) => {
    setBagianAktif(id);
    document.getElementById(`profil-${id}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const batalPerubahan = () => {
    if (!profil) return;
    setNama(profil.nama ?? "");
    setNoTelp(profil.noTelp ?? "");
    setPesanProfil({ jenis: "", teks: "" });
  };

  const simpanProfil = async (event) => {
    event.preventDefault();
    if (menyimpanProfil || !profil) return;

    const namaBersih = nama.trim();
    if (!namaBersih) {
      setPesanProfil({ jenis: "error", teks: "Nama lengkap wajib diisi." });
      return;
    }
    if ([...namaBersih].length > 100) {
      setPesanProfil({ jenis: "error", teks: "Nama maksimal 100 karakter." });
      return;
    }
    if (!FORMAT_TELP.test(noTelp)) {
      setPesanProfil({ jenis: "error", teks: "Nomor telepon harus berformat 08 diikuti 8–13 digit." });
      return;
    }

    const perubahan = {};
    if (namaBersih !== profil.nama) perubahan.nama = namaBersih;
    if (noTelp !== profil.noTelp) perubahan.noTelp = noTelp;
    if (Object.keys(perubahan).length === 0) {
      setPesanProfil({ jenis: "success", teks: "Tidak ada perubahan untuk disimpan." });
      return;
    }

    setMenyimpanProfil(true);
    setPesanProfil({ jenis: "", teks: "" });
    try {
      const hasil = await perbaruiProfil(perubahan);
      if (!hasil.pengguna) throw new Error("Server tidak mengembalikan profil terbaru.");
      setProfil(hasil.pengguna);
      setNama(hasil.pengguna.nama ?? "");
      setNoTelp(hasil.pengguna.noTelp ?? "");
      onProfileUpdated?.(hasil.pengguna);
      setPesanProfil({ jenis: "success", teks: hasil.message || "Perubahan profil berhasil disimpan." });
    } catch (err) {
      setPesanProfil({ jenis: "error", teks: pesanKesalahan(err) });
    } finally {
      setMenyimpanProfil(false);
    }
  };

  const ubahNilaiPassword = (field) => (event) => {
    setKataSandi((nilai) => ({ ...nilai, [field]: event.target.value }));
  };

  const simpanPassword = async (event) => {
    event.preventDefault();
    if (menyimpanPassword) return;

    if (
      !kataSandi.currentPassword.trim() ||
      !kataSandi.newPassword ||
      !kataSandi.confirmPassword
    ) {
      setPesanPassword({ jenis: "error", teks: "Semua kolom kata sandi wajib diisi." });
      return;
    }
    if (kataSandi.newPassword.length < 8) {
      setPesanPassword({ jenis: "error", teks: "Kata sandi baru minimal 8 karakter." });
      return;
    }
    if (new TextEncoder().encode(kataSandi.newPassword).length > 72) {
      setPesanPassword({ jenis: "error", teks: "Kata sandi terlalu panjang. Gunakan kata sandi yang lebih pendek." });
      return;
    }
    if (
        !/[A-Z]/.test(kataSandi.newPassword) ||
        !/[0-9]/.test(kataSandi.newPassword) ||
        !/[^A-Za-z0-9]/.test(kataSandi.newPassword)
    ) {
        setPesanPassword({
            jenis: "error",
            teks: "Kata sandi harus mengandung huruf kapital, angka, dan simbol."
        });
        return;
    }
    if (kataSandi.newPassword !== kataSandi.confirmPassword) {
      setPesanPassword({ jenis: "error", teks: "Konfirmasi kata sandi baru tidak cocok." });
      return;
    }

    setMenyimpanPassword(true);
    setPesanPassword({ jenis: "", teks: "" });
    try {
      const hasil = await ubahKataSandi(kataSandi);
      setKataSandi({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordTerlihat({});
      setPesanPassword({ jenis: "success", teks: hasil.message || "Kata sandi berhasil diubah." });
    } catch (err) {
      setPesanPassword({ jenis: "error", teks: pesanKesalahan(err) });
    } finally {
      setMenyimpanPassword(false);
    }
  };

  const pengguna = profil ?? sesi;
  const namaTampil = pengguna?.nama || "";

  return (
    <div className="rw-profile-page">
      <header className="rw-profile-heading">
        <div>
          <p className="rw-profile-eyebrow">{isAdmin ? "AKUN ADMIN" : "AKUN WARGA"}</p>
          <h1>Profil saya</h1>
          <p>
            {isAdmin
              ? "Kelola informasi akun dan pantau laporan yang telah Anda tangani."
              : "Kelola informasi pribadi dan lihat kontribusi Anda untuk lingkungan."}
          </p>
        </div>
      </header>

      {galatProfil && (
        <Galat
          pesan={`Profil tidak dapat dimuat: ${galatProfil}`}
          onUlang={() => {
            setMemuatProfil(true);
            setGalatProfil("");
            getProfil()
              .then(({ pengguna: data }) => {
                if (!data) throw new Error("Data profil tidak ditemukan.");
                setProfil(data);
                setNama(data.nama ?? "");
                setNoTelp(data.noTelp ?? "");
              })
              .catch((err) => setGalatProfil(err.message))
              .finally(() => setMemuatProfil(false));
          }}
        />
      )}

      {memuatProfil && <Memuat teks="Memuat profil Anda..." />}

      {!memuatProfil && !galatProfil && (
        <div className="rw-profile-layout">
          <aside className="rw-profile-sidebar" aria-label="Navigasi profil">
            <section className="rw-profile-card rw-profile-summary">
              <div className="rw-profile-avatar" aria-hidden="true">{inisial(namaTampil)}</div>
              <h2>{namaTampil}</h2>
              <span className="rw-profile-role">{namaPeran(pengguna?.role)}</span>
              <div className="rw-profile-email-hint">
                <Mail size={14} aria-hidden="true" />
                <span>{pengguna?.email}</span>
              </div>
            </section>

            <nav className="rw-profile-card rw-profile-menu" aria-label="Bagian profil">
              <button
                type="button"
                className={bagianAktif === "informasi" ? "aktif" : ""}
                onClick={() => bukaBagian("informasi")}
              >
                <UserRound size={16} aria-hidden="true" /> Informasi pribadi
              </button>
              <button
                type="button"
                className={bagianAktif === "keamanan" ? "aktif" : ""}
                onClick={() => bukaBagian("keamanan")}
              >
                <ShieldCheck size={16} aria-hidden="true" /> Keamanan akun
              </button>
              <button
                type="button"
                className={bagianAktif === "laporan" ? "aktif" : ""}
                onClick={() => bukaBagian("laporan")}
              >
                <ClipboardList size={16} aria-hidden="true" />
                {isAdmin ? "Laporan ditangani" : "Laporan saya"}
              </button>
            </nav>

            <button type="button" className="rw-btn rw-profile-logout" onClick={onLogout}>
              <LogOut size={15} aria-hidden="true" /> Keluar dari akun
            </button>
          </aside>

          <div className="rw-profile-content">
            <section
              className="rw-profile-stats"
              aria-label={isAdmin ? "Ringkasan laporan ditangani" : "Ringkasan laporan"}
            >
              <article className="rw-profile-card rw-profile-stat">
                <ClipboardList size={18} aria-hidden="true" />
                <div>
                  <strong>{memuatLaporan ? "—" : galatLaporan ? "—" : statistik.total}</strong>
                  <span>{isAdmin ? "Laporan ditangani" : "Laporan saya"}</span>
                </div>
              </article>
              <article className="rw-profile-card rw-profile-stat">
                <CircleUserRound size={18} aria-hidden="true" />
                <div>
                  <strong>{memuatLaporan ? "—" : galatLaporan ? "—" : statistik.aktif}</strong>
                  <span>{isAdmin ? "Masih diproses" : "Masih aktif"}</span>
                </div>
              </article>
              <article className="rw-profile-card rw-profile-stat">
                <Check size={18} aria-hidden="true" />
                <div>
                  <strong>{memuatLaporan ? "—" : galatLaporan ? "—" : statistik.selesai}</strong>
                  <span>Selesai ditangani</span>
                </div>
              </article>
            </section>

            <div className="rw-profile-columns">
              <div className="rw-profile-primary">
                <section className="rw-profile-card rw-profile-panel" id="profil-informasi">
                  <div className="rw-profile-panel-heading">
                    <div>
                      <h2>Informasi pribadi</h2>
                      <p>
                        {isAdmin
                          ? "Kelola informasi kontak yang digunakan untuk akun administrator."
                          : "Data kontak membantu petugas menghubungi Anda terkait laporan."}
                      </p>
                    </div>
                    {!sedangMengubahProfil && (
                      <button
                        type="button"
                        className="rw-btn rw-btn-utama"
                        onClick={onUbahProfil}
                      >
                        Ubah profil
                      </button>
                    )}
                  </div>
                  {sedangMengubahProfil ? (
                    <form onSubmit={simpanProfil} noValidate>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-nama">Nama lengkap</label>
                        <input
                          id="profil-nama"
                          name="nama"
                          value={nama}
                          onChange={(event) => setNama(event.target.value)}
                          maxLength={100}
                          autoComplete="name"
                          aria-invalid={Boolean(pesanProfil.jenis === "error" && !nama.trim())}
                        />
                      </div>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-email">Email</label>
                        <div className="rw-profile-readonly">
                          <input id="profil-email" value={profil?.email ?? ""} readOnly aria-readonly="true" />
                          <Mail size={15} aria-hidden="true" />
                        </div>
                        <small>Email tidak dapat diubah dari halaman ini.</small>
                      </div>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-no-telp">Nomor telepon</label>
                        <div className="rw-profile-readonly rw-profile-editable-icon">
                          <input
                            id="profil-no-telp"
                            name="noTelp"
                            value={noTelp}
                            onChange={(event) => setNoTelp(event.target.value)}
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="08xxxxxxxxxx"
                            aria-invalid={Boolean(pesanProfil.jenis === "error" && noTelp && !FORMAT_TELP.test(noTelp))}
                          />
                          <Phone size={15} aria-hidden="true" />
                        </div>
                        <small>Gunakan format nomor Indonesia, contoh: 081234567890.</small>
                      </div>
                      <div className="rw-profile-actions">
                        <button
                          type="button"
                          className="rw-btn rw-btn-garis"
                          onClick={() => {
                            batalPerubahan();
                            onBatalUbahProfil?.();
                          }}
                          disabled={menyimpanProfil}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="rw-btn rw-btn-utama"
                          disabled={!profilBerubah || menyimpanProfil}
                        >
                          {menyimpanProfil ? "Menyimpan..." : "Simpan perubahan"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-nama">Nama lengkap</label>
                        <div className="rw-profile-readonly">
                          <input
                            id="profil-nama"
                            value={profil?.nama ?? ""}
                            readOnly
                            aria-readonly="true"
                          />
                        </div>
                      </div>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-email">Email</label>
                        <div className="rw-profile-readonly">
                          <input
                            id="profil-email"
                            value={profil?.email ?? ""}
                            readOnly
                            aria-readonly="true"
                          />
                          <Mail size={15} aria-hidden="true" />
                        </div>
                        <small>Email tidak dapat diubah dari halaman ini.</small>
                      </div>
                      <div className="rw-profile-field">
                        <label htmlFor="profil-no-telp">Nomor telepon</label>
                        <div className="rw-profile-readonly">
                          <input
                            id="profil-no-telp"
                            value={profil?.noTelp ?? ""}
                            readOnly
                            aria-readonly="true"
                          />
                          <Phone size={15} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  )}
                  <PesanForm pesan={pesanProfil} />
                </section>

                <section className="rw-profile-card rw-profile-panel" id="profil-keamanan">
                  <div className="rw-profile-security-heading">
                    <div className="rw-profile-security-icon"><KeyRound size={17} aria-hidden="true" /></div>
                    <div>
                      <h2>Keamanan akun</h2>
                      <p>Gunakan kata sandi yang kuat dan unik untuk melindungi akun Anda.</p>
                    </div>
                    {!passwordTerbuka && (
                      <button
                        type="button"
                        className="rw-btn rw-btn-garis"
                        onClick={() => {
                          setPasswordTerbuka(true);
                          setPesanPassword({ jenis: "", teks: "" });
                        }}
                      >
                        Ubah kata sandi
                      </button>
                    )}
                  </div>
                  {passwordTerbuka && (
                    <form className="rw-profile-password-form" onSubmit={simpanPassword} noValidate>
                      <FieldKataSandi
                        id="kata-sandi-saat-ini"
                        label="Kata sandi saat ini"
                        value={kataSandi.currentPassword}
                        onChange={ubahNilaiPassword("currentPassword")}
                        terlihat={Boolean(passwordTerlihat.currentPassword)}
                        onToggle={() => setPasswordTerlihat((saatIni) => ({
                          ...saatIni,
                          currentPassword: !saatIni.currentPassword,
                        }))}
                        autoComplete="current-password"
                      />
                      <FieldKataSandi
                        id="kata-sandi-baru"
                        label="Kata sandi baru"
                        value={kataSandi.newPassword}
                        onChange={ubahNilaiPassword("newPassword")}
                        terlihat={Boolean(passwordTerlihat.newPassword)}
                        onToggle={() => setPasswordTerlihat((saatIni) => ({
                          ...saatIni,
                          newPassword: !saatIni.newPassword,
                        }))}
                        autoComplete="new-password"
                      />
                      <FieldKataSandi
                        id="konfirmasi-kata-sandi"
                        label="Konfirmasi kata sandi baru"
                        value={kataSandi.confirmPassword}
                        onChange={ubahNilaiPassword("confirmPassword")}
                        terlihat={Boolean(passwordTerlihat.confirmPassword)}
                        onToggle={() => setPasswordTerlihat((saatIni) => ({
                          ...saatIni,
                          confirmPassword: !saatIni.confirmPassword,
                        }))}
                        autoComplete="new-password"
                      />
                      <small>Kata sandi minimal 8 karakter.</small>
                      <PesanForm pesan={pesanPassword} />
                      <div className="rw-profile-actions">
                        <button
                          type="button"
                          className="rw-btn rw-btn-garis"
                          onClick={() => {
                            setPasswordTerbuka(false);
                            setKataSandi({ currentPassword: "", newPassword: "", confirmPassword: "" });
                            setPasswordTerlihat({});
                            setPesanPassword({ jenis: "", teks: "" });
                          }}
                          disabled={menyimpanPassword}
                        >
                          Batal
                        </button>
                        <button type="submit" className="rw-btn rw-btn-utama" disabled={menyimpanPassword}>
                          {menyimpanPassword ? "Memperbarui..." : "Simpan kata sandi"}
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                {isWarga && (
                  <section
                    className="rw-profile-card rw-profile-panel rw-profile-delete"
                    aria-labelledby="profil-hapus-akun"
                  >
                    <h2 id="profil-hapus-akun">Hapus Akun</h2>
                    <p>
                      Penghapusan akun juga menghapus laporan yang Anda buat,
                      lokasi, dan tanggapan terkait secara permanen.
                    </p>
                    <button
                      type="button"
                      className="rw-btn rw-btn-bahaya-garis"
                      onClick={onHapusAkun}
                    >
                      Hapus Akun
                    </button>
                  </section>
                )}
              </div>

              <aside className="rw-profile-secondary">
                <section className="rw-profile-card rw-profile-panel" id="profil-laporan">
                  <div className="rw-profile-panel-heading">
                    <div>
                      <h2>{isAdmin ? "Laporan ditangani" : "Laporan saya"}</h2>
                      <p>
                        {isAdmin
                          ? "Laporan yang pernah Anda tangani."
                          : "Laporan yang telah Anda sampaikan."}
                      </p>
                    </div>
                  </div>
                  {memuatLaporan && (
                    <Memuat teks={isAdmin ? "Memuat laporan yang ditangani..." : "Memuat laporan Anda..."} />
                  )}
                  {!memuatLaporan && galatLaporan && (
                    <Galat pesan={galatLaporan} onUlang={muatUlang} />
                  )}
                  {!memuatLaporan && !galatLaporan && laporan.length === 0 && (
                    <Kosong>
                      {isAdmin
                        ? "Anda belum pernah menangani laporan."
                        : <>Anda belum membuat laporan. <a href="#/buat">Buat laporan pertama</a></>}
                    </Kosong>
                  )}
                  {!memuatLaporan && !galatLaporan && laporan.length > 0 && (
                    <div className="rw-profile-report-list">
                      {(tampilkanSemuaLaporan ? laporan : laporan.slice(0, 3)).map((item) => (
                        <KartuLaporan key={item.idLaporan} laporan={item} />
                      ))}
                      {laporan.length > 3 && (
                        <button
                          type="button"
                          className="rw-profile-more"
                          onClick={() => setTampilkanSemuaLaporan((tampil) => !tampil)}
                        >
                          {tampilkanSemuaLaporan ? "Tampilkan lebih sedikit" : `Lihat ${laporan.length - 3} laporan lainnya`}
                        </button>
                      )}
                    </div>
                  )}
                </section>

                {!isAdmin && !memuatLaporan && !galatLaporan && laporan.length > 0 && (
                  <section className="rw-profile-card rw-profile-panel rw-profile-activity">
                    <h2>Jejak kepedulian</h2>
                    <p className="rw-profile-activity-row">
                      <ArrowUp size={15} aria-hidden="true" />
                      <span>{statistik.dukungan} dukungan pada laporan Anda</span>
                    </p>
                    <p className="rw-profile-activity-note">
                      Terima kasih telah ikut merawat lingkungan kota.
                    </p>
                  </section>
                )}
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
