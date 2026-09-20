import { Router } from "express";
import { db } from "../db/index.js";
import { signToken } from "../middleware/auth.js";
import type { AuthUser } from "../types.js";

export const authRouter = Router();

authRouter.post("/login", (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };
  if (!email || !password) return response.status(400).json({ error: "Email and password are required." });

  const user = db.prepare("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?").get(email, password) as AuthUser | undefined;
  if (!user) return response.status(401).json({ error: "Invalid email or password." });
  return response.json({ token: signToken(user), user });
});
