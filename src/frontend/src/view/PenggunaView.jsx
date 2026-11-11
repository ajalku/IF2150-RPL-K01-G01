import { Component } from "react";
import { Eye, EyeOff, Mail, ArrowRight, HandHeart, Users} from "lucide-react";
import { login as requestLogin } from "../services/authService.js";
import { register as requestRegister } from "../services/authService.js";
import "./PenggunaView.css";
import logoRawat from "../assets/brand-icon.svg";

class PenggunaView extends Component {
  constructor(props) {
    super(props);
    const rememberedEmail = localStorage.getItem("rawat_remembered_email") || "";

    this.state = {
      halaman: "login",
      email: rememberedEmail,
      passwordInput: "",
      rememberEmail: Boolean(rememberedEmail),
    
      showPassword: false,
      loading: false,
      pesan: "",
      tipePesan: "",

      registrasi: {
      nama: "",
      nik: "",
      email: "",
      password: "",
      konfirmasiPassword: "",
      noTelp: "",
    }
    };
  }

  tampilkanErrorMsgs(pesan) {
    this.setState({ pesan, tipePesan: "error" });
  }

  tampilkanPesanBerhasil(pesan) {
    this.setState({ pesan, tipePesan: "success" });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = async (event) => {
    event.preventDefault();
    if (this.state.loading) return;
    const { email, passwordInput, rememberEmail } = this.state;
    this.setState({ loading: true, pesan: "", tipePesan: "" });
    try {
      const result = await requestLogin(email.trim(), passwordInput);
      if (rememberEmail) localStorage.setItem("rawat_remembered_email", email.trim());
      else localStorage.removeItem("rawat_remembered_email");
      this.setState({ passwordInput: "" });
      this.tampilkanPesanBerhasil("Login berhasil. Anda sudah masuk ke RAWAT.");
      if (this.props.onLoginSuccess) this.props.onLoginSuccess(result);
    } catch (err) {
      this.tampilkanErrorMsgs(err.message || "Login gagal.");
    } finally {
      this.setState({ loading: false });
    }
  };


  handleRegisterChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      registrasi: {
        ...prevState.registrasi,
        [name]: value,
      },
    }));
  };

  handleRegister = async (event) => {
    event.preventDefault();

    if (this.state.loading) return;

    const {
      nama,
      nik,
      email,
      password,
      konfirmasiPassword,
      noTelp,
    } = this.state.registrasi;

    if (!/^\d{16}$/.test(nik)) {
      this.tampilkanErrorMsgs("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    if (!/^08\d{8,13}$/.test(noTelp)) {
      this.tampilkanErrorMsgs("Nomor telepon tidak valid.");
      return;
    }

    const passwordBytes = new TextEncoder().encode(password).length;

    if (password.length < 8 || passwordBytes > 72) {
      this.tampilkanErrorMsgs(
        "Kata sandi harus minimal 8 karakter."
      );
      return;
    }

    if (password !== konfirmasiPassword) {
      this.tampilkanErrorMsgs("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    this.setState({
      loading: true,
      pesan: "",
      tipePesan: "",
    });

    try {
      await requestRegister({
        nama: nama.trim(),
        nik: nik.trim(),
        email: email.trim(),
        password,
        noTelp: noTelp.trim(),
      });

      this.setState({
        halaman: "login",
        email: email.trim(),
        passwordInput: "",
        registrasi: {
          nama: "",
          nik: "",
          email: "",
          password: "",
          konfirmasiPassword: "",
          noTelp: "",
        },
      });

      this.tampilkanPesanBerhasil(
        "Registrasi berhasil! Silakan masuk menggunakan akun Anda."
      );

    } catch (error) {
      this.tampilkanErrorMsgs(
        error.message || "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      this.setState({ loading: false });
    }
  };


  tampilkanFormRegistrasi() {
    const {
      registrasi,
      loading,
      pesan,
      tipePesan,
      showPassword,
    } = this.state;

    return (
      <section className="auth-inner register-inner">
        <div className="header-icon">
          <HandHeart size={19} />
        </div>

        <h2>Mulai perubahan dari sini.</h2>

        <p className="subtitle">
          Daftarkan diri Anda untuk menyampaikan aspirasi
          dan membantu membangun kota yang lebih baik.
        </p>

        <form onSubmit={this.handleRegister}>
          <div className="field">
            <label htmlFor="register-nama">Nama lengkap</label>
            <div className="input-wrap">
              <input
                id="register-nama"
                name="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                value={registrasi.nama}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-nik">NIK</label>
            <div className="input-wrap">
              <input
                id="register-nik"
                name="nik"
                type="text"
                inputMode="numeric"
                maxLength={16}
                pattern="[0-9]{16}"
                placeholder="16 digit NIK"
                value={registrasi.nik}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <div className="input-wrap">
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                value={registrasi.email}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-telepon">Nomor telepon</label>
            <div className="input-wrap">
              <input
                id="register-telepon"
                name="noTelp"
                type="tel"
                inputMode="tel"
                pattern="08[0-9]{8,13}"
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
                value={registrasi.noTelp}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-password">Kata sandi</label>
            <div className="input-wrap">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                value={registrasi.password}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-confirm">
              Konfirmasi kata sandi
            </label>
            <div className="input-wrap">
              <input
                id="register-confirm"
                name="konfirmasiPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                value={registrasi.konfirmasiPassword}
                onChange={this.handleRegisterChange}
                required
              />
            </div>
          </div>

          <label className="register-visibility">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) =>
                this.setState({ showPassword: e.target.checked })
              }
            />
            Tampilkan kata sandi
          </label>

          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Memproses..." : (
              <>
                <ArrowRight size={15} />
                Daftar
              </>
            )}
          </button>

          {pesan && (
            <p
              className={`form-message ${tipePesan}`}
              role={tipePesan === "error" ? "alert" : "status"}
            >
              {pesan}
            </p>
          )}
        </form>

        <p className="switch-page">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() =>
              this.setState({
                halaman: "login",
                pesan: "",
                tipePesan: "",
                showPassword: false,
              })
            }
          >
            Masuk sekarang
          </button>
        </p>
      </section>
    );
  }

  tampilkanFormLogin() {
    const { email, passwordInput, showPassword, rememberEmail, loading, pesan, tipePesan } = this.state;
    return (
      <section className="auth-inner" aria-labelledby="login-title">
        <div className="header-icon"><HandHeart size={19} /></div>
        <h2 id="login-title">Selamat datang kembali.</h2>
        <p className="subtitle">Masuk untuk menyuarakan kepedulian dan mengikuti perubahan di sekitar Anda.</p>
        <form onSubmit={this.handleLogin}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <div className="input-wrap">
              <input id="login-email" type="email" name="email" autoComplete="email"
                placeholder="nama@email.com" value={email} onChange={this.handleChange} required />
              <Mail size={16} aria-hidden="true" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="login-password">Kata sandi</label>
            <div className="input-wrap">
              <input id="login-password" name="passwordInput" type={showPassword ? "text" : "password"}
                autoComplete="current-password" placeholder="Masukkan kata sandi"
                value={passwordInput} onChange={this.handleChange} required />
              <button className="visibility" type="button"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                onClick={() => this.setState(s => ({ showPassword: !s.showPassword }))}>
                {showPassword ? <Eye size={16}/> : <EyeOff size={16}/>}
              </button>
            </div>
          </div>
          <div className="form-options">
            <label className="remember" title="Hanya menyimpan email di perangkat ini, bukan memperpanjang sesi login">
              <input type="checkbox" checked={rememberEmail}
                onChange={e => this.setState({ rememberEmail: e.target.checked })}/>
              Ingat email saya
            </label>
            <span className="muted-link" title="Fitur reset password belum disediakan backend">Lupa kata sandi?</span>
          </div>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Memproses..." : <><ArrowRight size={15}/> Masuk</>}
          </button>
          {pesan && <p className={`form-message ${tipePesan}`} role={tipePesan === "error" ? "alert" : "status"}>{pesan}</p>}
        </form>
          <p className="switch-page">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() =>
                this.setState({
                  halaman: "register",
                  pesan: "",
                  tipePesan: "",
                  showPassword: false,
                })
              }
            >
              Daftar sekarang
            </button>
          </p>

      </section>
    );
  }

  
  render() {
    return (
      <div className="app">

        {/* PANEL KIRI — BRANDING RAWAT */}
        <aside className="brand-panel">

          <div className="brand-logo">
            <img src = {logoRawat} alt = "Logo Rawat"/>
            <div>
              <strong>RAWAT</strong>
              <span>
                Ruang Aspirasi Warga dan Aduan Terpadu
              </span>
            </div>
          </div>

          <div className="brand-content">
            <p className="eyebrow">
              DARI WARGA, UNTUK KOTA.
            </p>

            <h1>
              Kota yang nyaman,
              <br />
              dimulai dari kita.
            </h1>

            <p className="brand-desc">
              Ada trotoar rusak atau fasilitas yang
              perlu perhatian? Sampaikan di RAWAT.
              Kita kawal perbaikannya bersama.
            </p>

            <div className="town-image">
              <img
                src="/kota-preview.jpg"
                alt="Suasana jalan perkotaan"
              />

              <div className="town-sticker">
                Ruang bersama, tanggung jawab bersama.
              </div>
            </div>

            
            <div className="brand-highlights">
              <span>
                <Eye size={15} strokeWidth={1.8} />
                Terbuka & terlacak
              </span>

              <span>
                <Users size={15} strokeWidth={1.8} />
                Suara warga berarti
              </span>
            </div>


            <span className="brand-foot">
              RAWAT • Ruang Aspirasi Warga dan Aduan Terpadu
            </span>
          </div>
        </aside>

        {/* PANEL KANAN — LOGIN */}
        <main className="main-panel">

          <header className="main-header">
            <span>PLATFORM ASPIRASI WARGA</span>
          </header>

          {this.state.halaman === "login"
          ? this.tampilkanFormLogin()
          : this.tampilkanFormRegistrasi()}

          <footer className="main-footer">
            <span>© 2026 RAWAT</span>
          </footer>

        </main>

      </div>
    );
  }

}

export default PenggunaView;
