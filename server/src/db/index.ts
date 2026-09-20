import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const configuredDatabasePath = process.env.DATABASE_PATH ?? "data/campuskit.db";
const databasePath = configuredDatabasePath === ":memory:" ? ":memory:" : resolve(process.cwd(), configuredDatabasePath);
if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'admin'))
  );

  CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    slot_start TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(equipment_id, slot_start)
  );
`);

const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const seed = db.transaction(() => {
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Sam Student", "student@test.edu", "Test@1234", "student");
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Ada Admin", "admin@test.edu", "Test@1234", "admin");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("3D Printer", "Lab A", "Fabrication", "FDM printer for prototype parts and course projects.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Laser Cutter", "Lab B", "Fabrication", "Precision cutter for approved acrylic and wood materials.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Sony A7 IV", "Media Room", "Photography", "Full-frame camera kit with a 24–70mm lens.");
  });
  seed();
}
