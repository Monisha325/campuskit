import { Router } from "express";
import { db } from "../db/index.js";
import { signToken } from "../middleware/auth.js";
import type { AuthUser } from "../types.js";
import { hashPassword, verifyPassword } from "../auth/passwords.js";

export const authRouter = Router();

authRouter.post("/login", (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };
  if (!email || !password) return response.status(400).json({ error: "Email and password are required." });

  const record = db.prepare("SELECT id, name, email, password, role FROM users WHERE email = ?").get(email.trim().toLowerCase()) as (AuthUser & { password: string }) | undefined;
  if (!record || !verifyPassword(password, record.password)) return response.status(401).json({ error: "Invalid email or password." });
  const { password: _password, ...user } = record;
  return response.json({ token: signToken(user), user });
});

authRouter.post("/register", (request, response) => {
  const { name, email, password } = request.body as { name?: string; email?: string; password?: string };
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanName || !cleanEmail || !password) return response.status(400).json({ error: "Name, email, and password are required." });
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return response.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 8) return response.status(400).json({ error: "Password must contain at least 8 characters." });

  try {
    const result = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')").run(cleanName, cleanEmail, hashPassword(password));
    const user: AuthUser = { id: Number(result.lastInsertRowid), name: cleanName, email: cleanEmail, role: "student" };
    return response.status(201).json({ token: signToken(user), user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) return response.status(409).json({ error: "An account already exists for this email address." });
    throw error;
  }
});
