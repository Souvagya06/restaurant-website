import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@libsql/client";

dotenv.config();

const app = express();
const PORT = 5000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ================== TURSO DB ==================
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ================== INIT TABLES ==================
(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        time TEXT,
        guests INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("Tables ready");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
})();

// ================== AUTH ROUTES ==================

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await db.execute({
      sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      args: [name, email, password],
    });

    // return created user
    const user = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    res.json({ success: true, user: user.rows[0] });

  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ? AND password = ?",
      args: [email, password],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================== CHECK USER (NEW) ==================
app.post("/check-user", async (req, res) => {
  const { name } = req.body;

  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE name = ?",
      args: [name],
    });

    if (result.rows.length === 0) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      user: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

// ================== RESERVATION ==================
app.post("/reserve", async (req, res) => {
  const { user_id, date, time, guests } = req.body;

  try {
    // 🔥 VALIDATION: check user exists
    const userCheck = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [user_id],
    });

    if (userCheck.rows.length === 0) {
      return res.json({
        success: false,
        error: "Please Sign Up First",
      });
    }

    // ✅ Insert reservation
    await db.execute({
      sql: `
        INSERT INTO reservations (user_id, date, time, guests)
        VALUES (?, ?, ?, ?)
      `,
      args: [user_id, date, time, guests],
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reservation failed" });
  }
});

// ================== GET USER RESERVATIONS ==================
app.get("/my-reservations/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.execute({
      sql: "SELECT * FROM reservations WHERE user_id = ?",
      args: [user_id],
    });

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

// ================== PAGE ROUTES ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
});

app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
});

app.get("/menu.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/menu.html"));
});

app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/about.html"));
});

app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/contact.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/login.html"));
});

app.get("/reservation.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/reservation.html"));
});

// ================== FALLBACK ==================
app.use((req, res) => {
  res.redirect("/");
});

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});