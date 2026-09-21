import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [algorithm, salt, derivedKey] = storedPassword.split("$");
  if (algorithm !== "scrypt" || !salt || !derivedKey) return password === storedPassword;

  const candidate = scryptSync(password, salt, keyLength);
  const stored = Buffer.from(derivedKey, "hex");
  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}
