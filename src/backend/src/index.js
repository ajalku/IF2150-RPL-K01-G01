const express = require("express");
const dotenv = require("dotenv").config();
const session = require("express-session");
const {dbConnect} = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const sessionMiddleware = require("./config/session");

dbConnect();

const app = express();
const PORT = process.env.PORT || 7002;

//Middleware
app.use(express.json());
app.use(sessionMiddleware);

//Routes
app.use("/api/auth", authRoutes);

//Mulai server
async function startServer() {
    try {
        await dbConnect();

        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();