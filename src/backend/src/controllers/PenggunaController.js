const bcrypt = require("bcrypt");
const Pengguna = require("../models/Pengguna");

class PenggunaController {
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
        if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) { 
            return "Password harus 8-72 karakter";
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