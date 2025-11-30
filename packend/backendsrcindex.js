
@'
import express from "express";
import cors from "cors";
import pkg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:password@db:5432/legaldb";

const { Pool } = pkg;
const pool = new Pool({ connectionString: DATABASE_URL });

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Legal advisor backend running ✅" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
});
'@ | Set-Content -Encoding UTF8 backend\src\index.js
