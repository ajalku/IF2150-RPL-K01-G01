
const fs = require("node:fs");
const { Pool } = require("pg");

const sslSetting = (process.env.DB_SSL || "false").trim().toLowerCase();
if (sslSetting !== "true" && sslSetting !== "false") {
    throw new Error("DB_SSL must be set to 'true' or 'false'.");
}

const ssl = sslSetting === "true"
    ? {
        rejectUnauthorized: true,
        ...(process.env.DB_SSL_CA_PATH
            ? { ca: fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8") }
            : {})
    }
    : undefined;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(ssl ? { ssl } : {})
});

const dbConnect = async () => {
    let connection;
    try {
        connection = await pool.connect();
        await connection.query("SELECT 1");

        const sessionTable = await connection.query(
            "SELECT to_regclass('public.user_sessions') AS table_name"
        );
        if (!sessionTable.rows[0].table_name) {
            throw new Error("Required PostgreSQL table 'public.user_sessions' is missing.");
        }

        console.log("Database connected and session table is ready.");
    } catch (err) {
        console.error("Database startup check failed:", err.message);
        throw err;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { pool, dbConnect };
