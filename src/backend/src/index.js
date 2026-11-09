const express = require("express");
require("dotenv").config(); // harus sebelum require ./config/* (yang membaca process.env)
const { dbConnect } = require("./config/database");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const lokasiRoutes = require("./routes/lokasiRoutes");
const { mulaiPembersihLaporan } = require("./jobs/pembersihLaporan");

const app = express();
const PORT = process.env.PORT || 7002;

//Middleware
app.use(express.json());
app.use(sessionMiddleware);

// Foto laporan TIDAK disajikan statis. Aksesnya lewat GET /api/laporan/:id/foto (wajib login).

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/lokasi", lokasiRoutes);

//Mulai server
async function startServer() {
    try {
        await dbConnect();

        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        });

        mulaiPembersihLaporan(); // hapus otomatis laporan tidak valid yang lewat 2 minggu

    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();
