
const { Pool } = require("pg");

const pool = new Pool({ //kelola koneksi database
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const dbConnect = async() => {
    try{
        const connect = await pool.connect();
        console.log(`Database connected: ${connect.host || process.env.DB_HOST}`);
        connect.release();
    } catch(err){
        console.error("Database connection failed:", err.message);
        throw err;
    }
    
} 

module.exports = {pool, dbConnect};
