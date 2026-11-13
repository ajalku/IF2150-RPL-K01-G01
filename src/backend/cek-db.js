require("dotenv").config();
const { pool, dbConnect } = require("./src/config/database");

const requiredTables = ["pengguna", "laporan", "lokasi", "tanggapan", "user_sessions"];

async function checkDatabase() {
  try {
    await dbConnect();
    const result = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name = ANY($1::text[])`,
      [requiredTables]
    );
    const availableTables = new Set(result.rows.map((row) => row.table_name));
    const missingTables = requiredTables.filter((table) => !availableTables.has(table));

    if (missingTables.length > 0) {
      throw new Error(`Required tables are missing: ${missingTables.join(", ")}.`);
    }

    console.log("Database connection and required RAWAT tables are ready.");
  } catch (err) {
    console.error("Database check failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabase();
