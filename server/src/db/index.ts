import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { hashPassword } from "../auth/passwords.js";

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
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Sam Student", "student@test.edu", hashPassword("Test@1234"), "student");
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Ada Admin", "admin@test.edu", hashPassword("Test@1234"), "admin");

    // Fabrication
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("3D Printer — Prusa MK4", "Innovation Lab A", "Fabrication", "FDM printer for prototype parts and course projects. Supports PLA, PETG, and TPU filaments. Max build volume 250×210×220 mm.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("3D Printer — Bambu X1C", "Innovation Lab A", "Fabrication", "High-speed multi-filament FDM printer with AMS support. Ideal for multi-colour or multi-material prints up to 256×256×256 mm.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Laser Cutter — Epilog Fusion", "Innovation Lab B", "Fabrication", "60 W CO₂ laser cutter for approved acrylic, plywood, leather, and fabric. 610×305 mm work area. Safety training required.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Vinyl Cutter — Cricut Maker", "Innovation Lab B", "Fabrication", "Precision blade cutter for vinyl, paper, and fabric. Includes weeding kit and design software access on the adjacent workstation.");

    // Photography & video
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Sony A7 IV — Full-Frame Kit", "Media Studio", "Photography", "Full-frame mirrorless camera with 24–70 mm f/2.8 GM lens, two batteries, and a fast CFexpress card. Great for stills and 4K video.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("DJI Ronin Gimbal + GoPro", "Media Studio", "Photography", "3-axis motorised gimbal with a GoPro Hero 12 for smooth handheld or walking shots. Includes 2 batteries and a ND filter set.");

    // Audio / Video
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Podcast Recording Studio", "Media Room 2", "Audio / Video", "Soundproofed booth with two Shure SM7B microphones, Focusrite Scarlett 2i2 interface, and Audacity on the in-room Mac.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Video Production Kit", "Media Room 2", "Audio / Video", "Sony ZV-E10 camera, Godox SL60 LED panel, collapsible green screen, and Rode VideoMic — all in one carry bag.");

    // Electronics
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Soldering Station — Hakko FX-951", "Electronics Lab C", "Electronics", "Temperature-controlled soldering station with fine tips, fume extractor, helping-hands clamp, and a component starter tray.");
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Oscilloscope — Rigol DS1054Z", "Electronics Lab C", "Electronics", "4-channel 50 MHz digital oscilloscope with logic analyser probes and USB storage. Ideal for embedded systems and signal debugging.");

    // XR / Immersive
    db.prepare("INSERT INTO equipment (name, location, category, description) VALUES (?, ?, ?, ?)").run("Meta Quest 3 — VR Headset", "XR Hub", "XR / Immersive", "Standalone mixed-reality headset with 2× Touch Plus controllers. Library includes 30+ educational and design apps. Charging dock available.");
  });
  seed();
}

