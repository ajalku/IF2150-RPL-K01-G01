require("dotenv").config();
const { Pool } = require("pg");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
console.log("HOST     :", JSON.stringify(DB_HOST));
console.log("PORT     :", JSON.stringify(DB_PORT));
console.log("USER     :", JSON.stringify(DB_USER));
console.log("DATABASE :", JSON.stringify(DB_NAME));
console.log("PASSWORD :", DB_PASSWORD ? `terisi (${DB_PASSWORD.length} karakter)` : "KOSONG");

const pool = new Pool({
  host: DB_HOST, port: Number(DB_PORT), user: DB_USER,
  password: DB_PASSWORD, database: DB_NAME,
});

pool.query("SELECT current_database() AS db")
  .then((r) => console.log("\nKONEKSI OK -> database:", r.rows[0].db))
  .catch((e) => {
    console.log("\nKODE  :", e.code);
    console.log("PESAN :", e.message);
    (e.errors || []).forEach((x) => console.log("DETAIL:", x.code, `${x.address}:${x.port}`));
  })
  .finally(() => pool.end());