
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
    static async getPenggunaById(idPengguna) {
        const query = `
            SELECT * FROM pengguna
            WHERE id_pengguna = $1
        `;

        const result = await pool.query(query, [idPengguna]);

        if (result.rows.length === 0) {
            return null;
        }

        return new Pengguna(result.rows[0]);
    }

    static async getProfilPenggunaById(idPengguna) {
        const query = `
            SELECT id_pengguna, nama, email, no_telp, role
            FROM pengguna
            WHERE id_pengguna = $1
        `;

        const result = await pool.query(query, [idPengguna]);

        if (result.rows.length === 0) {
            return null;
        }

        const pengguna = result.rows[0];
        return {
            idPengguna: pengguna.id_pengguna,
            nama: pengguna.nama,
            email: pengguna.email,
            noTelp: pengguna.no_telp,
            role: pengguna.role
        };
    }

    static async updateDataPengguna(idPengguna, dataPengguna) {
        if ( !dataPengguna || typeof dataPengguna !== "object" || Array.isArray(dataPengguna)) {
            return false;
        }

        const kolomDiizinkan = [
            ["nama", "nama"],
            ["noTelp", "no_telp"],
            ["hashPassword", "hash_password"]
        ];
        const perubahan = kolomDiizinkan.filter(([atribut]) =>
            Object.prototype.hasOwnProperty.call(dataPengguna, atribut)
        );

        if (perubahan.length === 0) {
            return false;
        }

        const nilai = perubahan.map(([atribut]) => dataPengguna[atribut]);
        const setClause = perubahan.map(([, kolom], indeks) =>
            `${kolom} = $${indeks + 1}`
        );
        nilai.push(idPengguna);

        const query = `
            UPDATE pengguna
            SET ${setClause.join(", ")}
            WHERE id_pengguna = $${nilai.length}
            RETURNING id_pengguna
        `;
        const result = await pool.query(query, nilai);

        return result.rowCount === 1;
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

    getNama(){
        return this.#nama;
    }

    getEmail(){
        return this.#email;
    }

    getNoTelp(){
        return this.#noTelp;
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
