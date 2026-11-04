
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { pool } = require("./database");

const sessionMiddleware = session({
    name: "rawat.sid", //nama cookie session
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new PgSession({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true
    }),

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 2
    }
});

module.exports = sessionMiddleware;
