const express = require("express");
require("dotenv").config(); // harus sebelum require ./config/* (yang membaca process.env)
const { dbConnect } = require("./config/database");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const lokasiRoutes = require("./routes/lokasiRoutes");
const upvoteRoutes = require("./routes/upvoteRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const profileRoutes = require("./routes/profileRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const { mulaiPembersihLaporan } = require("./jobs/pembersihLaporan");

const app = express();
const PORT = process.env.PORT || 7001;

// Di balik reverse proxy (Nginx, dsb.) cookie "secure" hanya dikirim jika Express percaya header X-Forwarded-*
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

//Middleware
app.use(express.json());
app.use(sessionMiddleware);

// Foto laporan TIDAK disajikan statis. Aksesnya lewat GET /api/laporan/:id/foto (wajib login).

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/lokasi", lokasiRoutes);
app.use("/api/upvote", upvoteRoutes);
app.use("/api/tutorial", tutorialRoutes);
app.use("/api/homepage", homepageRoutes);

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