
const { pool } = require("../config/database");

class Pengguna {
    #idPengguna;
    #nama;
    #NIK;
    #email;
    #hashPassword;
    #noTelp;          
    #role;
    constructor(data) {
        this.#idPengguna = data.id_pengguna ?? null;
        this.#nama = data.nama;
        this.#NIK = data.nik;
        this.#email = data.email;
        this.#hashPassword = data.hash_password;
        this.#noTelp = data.no_telp;
        this.#role = data.role ?? "warga";
    }

    async simpanDataPengguna() {
        const query = `
            INSERT INTO pengguna
                (nama, nik, email, hash_password, no_telp)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_pengguna
        `;

        const values = [
            this.#nama,
            this.#NIK,
            this.#email,
            this.#hashPassword,
            this.#noTelp
        ];

        const result = await pool.query(query, values);

        this.#idPengguna = result.rows[0].id_pengguna;

        return this.#idPengguna;
    }

    static async getPenggunaByEmail(email) {
        const query = `
            SELECT * FROM pengguna
            WHERE email = $1
        `;

        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return new Pengguna(result.rows[0]);
    }
    static async getPenggunaByNIK(nik) {
        const query = `
            SELECT * FROM pengguna
            WHERE nik = $1
        `;

        const result = await pool.query(query, [nik]);

        if (result.rows.length === 0) {
            return null;
        }

        return new Pengguna(result.rows[0]);
    }

    getRole(){
        return this.#role;
    }

    getHashPassword(){
        return this.#hashPassword;
    }
    getIdPengguna(){
        return this.#idPengguna;
    }


}

module.exports = Pengguna;
