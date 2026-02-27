import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("waitlist.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/waitlist", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    try {
      const stmt = db.prepare("INSERT INTO waitlist (email) VALUES (?)");
      stmt.run(email);
      res.json({ success: true, message: "Welcome to the future." });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "You're already on the list!" });
      }
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  app.get("/api/count", (req, res) => {
    const row = db.prepare("SELECT COUNT(*) as count FROM waitlist").get() as { count: number };
    res.json({ count: row.count + 1240 }); // Adding a base number for "social proof"
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
