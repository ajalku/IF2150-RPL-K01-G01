const bcrypt = require("bcrypt");
const Pengguna = require("../models/Pengguna");

class PenggunaController {
    static #getSessionUserId(req) {
        return req.session?.userId ?? req.session?.idPengguna;
    }

    static #validasiPassword(password) {
        if (typeof password !== "string") {
            return "Password tidak valid";
        }

        if (
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
        ) {
            return "Password harus minimal 8 karakter, mengandung huruf kapital, angka, dan simbol";
        }

        return "";
    }

    static #validasiData(nama, nik, email, password, noTelp){
        const data = [nama, nik, email, password, noTelp];

        if (data.some(value =>
            typeof value !== "string" || value.trim() === ""
        )) {
            return "Data belum lengkap";
        }
        if (!/^\d{16}$/.test(nik)) {
            return "NIK tidak valid";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Email tidak valid";
        }
        const errorPassword = PenggunaController.#validasiPassword(password);
        if (errorPassword !== "") {
            return errorPassword;
        }

        if (!/^08\d{8,13}$/.test(noTelp)) {
            return "Nomor telepon tidak valid";
        }

        return ""; // valid
        
    }
    static async #cekAkunTerdaftar(email, nik){
        const penggunaEmail = await Pengguna.getPenggunaByEmail(email);
        if (penggunaEmail != null){
            return true;
        }
        const penggunaNIK = await Pengguna.getPenggunaByNIK(nik);
        if(penggunaNIK != null){
            return true;
        }
        return false;
    }
    static async #hashPassword(password){
        return await bcrypt.hash(password, 12);
    }
    static async #validasiKredensial(passwordInput, hashPassword){
        return await bcrypt.compare(passwordInput, hashPassword);
    }
    static async register(req, res) {
        try{
            const { nama, nik, email, password, noTelp } = req.body ?? {};
            const error = PenggunaController.#validasiData(nama, nik, email, password, noTelp);
            if(error !== ""){
                return res.status(400).json({message: error});
            }
            const isRegistered = await PenggunaController.#cekAkunTerdaftar(email, nik);
            if(isRegistered) {
                return res.status(409).json({message: "Email atau NIK sudah terdaftar"});
            }
            const hashedPassword = await PenggunaController.#hashPassword(password);
            const newUser = new Pengguna({nama, nik, email, hash_password : hashedPassword, no_telp : noTelp});
            const idPengguna = await newUser.simpanDataPengguna();
            return res.status(201).json({message: "Registration Succeeded", idPengguna});
        }
        catch (err) {
            console.error("Registration error: ", err);
            // Tangani email/NIK duplikat dari PostgreSQL
            if (err.code === "23505") {
                return res.status(409).json({
                    message: "Email atau NIK sudah terdaftar"
                });
            }
            return res.status(500).json({message:`Something went wrong`});
        }
    }


    static async login(req, res) {
        try{
            const  {email, password} = req.body ?? {};
            if (typeof email !== "string" ||typeof password !== "string" ||email.trim() === "" ||password.trim() === "") {
                return res.status(400).json({
                    message: "Email and password are required."
                });
            }
            const pengguna = await Pengguna.getPenggunaByEmail(email);
            if(pengguna == null){
                return res.status(401).json({message: "Wrong Email or Password"});
            }
            if(!(await PenggunaController.#validasiKredensial(password, pengguna.getHashPassword()))){
                return res.status(401).json({message: "Wrong Email or Password"});
            }
            await new Promise((resolve, reject) => {
                req.session.regenerate(err=> {
                    if(err) return reject(err);
                    resolve();
                });
            });
            req.session.userId = pengguna.getIdPengguna();
            req.session.idPengguna = pengguna.getIdPengguna();
            req.session.role = pengguna.getRole();
            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            return res.status(200).json({message: "Login succeeded.", role: pengguna.getRole()});
            
        }catch(err){
            console.error("Login error:", err);
            return res.status(500).json({message: "Something went wrong"});
        }
    }

    static async getProfile(req, res) {
        try {
            const pengguna = await Pengguna.getProfilPenggunaById(
                PenggunaController.#getSessionUserId(req)
            );
            if (pengguna == null) {
                return res.status(404).json({message: "User not found."});
            }

            return res.status(200).json({pengguna});
        } catch (err) {
            console.error("Profile retrieval error:", err);
            return res.status(500).json({message: "Something went wrong"});
        }
    }

    static async updateProfile(req, res) {
        try {
            const dataProfil = req.body;
            if (
                dataProfil === null ||
                typeof dataProfil !== "object" ||
                Array.isArray(dataProfil)
            ) {
                return res.status(400).json({message: "Invalid profile data."});
            }

            const fields = Object.keys(dataProfil);
            const protectedFields = [
                "id", "idPengguna", "userId", "role", "status", "statusIzin",
                "status_izin", "email", "nik", "password", "hashPassword",
                "hash_password"
            ];
            if (fields.some(field => protectedFields.includes(field))) {
                return res.status(400).json({
                    message: "Protected profile fields cannot be changed."
                });
            }
            if (fields.some(field => !["nama", "noTelp"].includes(field))) {
                return res.status(400).json({message: "Unsupported profile field."});
            }
            if (fields.length === 0) {
                return res.status(400).json({message: "No profile fields to update."});
            }

            const perubahan = {};
            if (Object.prototype.hasOwnProperty.call(dataProfil, "nama")) {
                if (
                    typeof dataProfil.nama !== "string" ||
                    dataProfil.nama.trim() === "" ||
                    [...dataProfil.nama.trim()].length > 100
                ) {
                    return res.status(400).json({
                        message: "Nama wajib diisi dan maksimal 100 karakter."
                    });
                }
                perubahan.nama = dataProfil.nama.trim();
            }
            if (Object.prototype.hasOwnProperty.call(dataProfil, "noTelp")) {
                if (
                    typeof dataProfil.noTelp !== "string" ||
                    !/^08\d{8,13}$/.test(dataProfil.noTelp)
                ) {
                    return res.status(400).json({message: "Nomor telepon tidak valid."});
                }
                perubahan.noTelp = dataProfil.noTelp;
            }

            const updated = await Pengguna.updateDataPengguna(
                PenggunaController.#getSessionUserId(req),
                perubahan
            );
            if (!updated) {
                return res.status(404).json({message: "User not found."});
            }

            const pengguna = await Pengguna.getProfilPenggunaById(
                PenggunaController.#getSessionUserId(req)
            );
            if (pengguna == null) {
                return res.status(404).json({message: "User not found."});
            }
            return res.status(200).json({
                message: "Profile updated successfully.",
                pengguna
            });
        } catch (err) {
            console.error("Profile update error:", err);
            return res.status(500).json({message: "Something went wrong"});
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body ?? {};
            if (
                typeof currentPassword !== "string" ||
                currentPassword.trim() === "" ||
                typeof newPassword !== "string" ||
                typeof confirmPassword !== "string"
            ) {
                return res.status(400).json({message: "All password fields are required."});
            }

            const errorPassword = PenggunaController.#validasiPassword(newPassword);
            if (errorPassword !== "") {
                return res.status(400).json({message: errorPassword});
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({message: "Password confirmation does not match."});
            }

            const idPengguna = PenggunaController.#getSessionUserId(req);
            const pengguna = await Pengguna.getPenggunaById(idPengguna);
            if (pengguna == null) {
                return res.status(404).json({message: "User not found."});
            }

            const hashPassword = pengguna.getHashPassword();
            if (!(await PenggunaController.#validasiKredensial(currentPassword, hashPassword))) {
                return res.status(401).json({message: "Current password is incorrect."});
            }
            if (await PenggunaController.#validasiKredensial(newPassword, hashPassword)) {
                return res.status(400).json({
                    message: "New password must be different from the current password."
                });
            }

            const hashedPassword = await PenggunaController.#hashPassword(newPassword);
            const updated = await Pengguna.updateDataPengguna(idPengguna, {
                hashPassword: hashedPassword
            });
            if (!updated) {
                return res.status(404).json({message: "User not found."});
            }

            return res.status(200).json({message: "Password updated successfully."});
        } catch (err) {
            console.error("Password update error:", err);
            return res.status(500).json({message: "Something went wrong"});
        }
    }

    // GET /api/auth/me  -> data pengguna yang sedang login (dipakai front-end saat halaman dimuat)
    static async me(req, res) {
        try {
            const pengguna = await Pengguna.getPenggunaById(req.session.idPengguna);
            if (pengguna == null) {
                // akun sudah dihapus tetapi sesi masih ada
                return req.session.destroy(() =>
                    res.status(401).json({message: "Please log in to continue."}));
            }
            return res.status(200).json({
                pengguna: {
                    idPengguna: pengguna.getIdPengguna(),
                    nama: pengguna.getNama(),
                    email: pengguna.getEmail(),
                    noTelp: pengguna.getNoTelp(),
                    role: req.session.role
                }
            });
        } catch (err) {
            console.error("Me error:", err);
            return res.status(500).json({message: "Something went wrong"});
        }
    }

    // POST /api/auth/logout
    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({message: "Something went wrong"});
            }
            res.clearCookie("rawat.sid");
            return res.status(200).json({message: "Logout succeeded."});
        });
    }

}
module.exports = PenggunaController;