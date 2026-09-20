import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, Role } from "../types.js";

export type AuthenticatedRequest = Request & { user: JwtPayload };

function getSecret() {
  return process.env.JWT_SECRET ?? "development-only-secret-change-me";
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "8h" });
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Authentication required." });
  try {
    (request as AuthenticatedRequest).user = jwt.verify(token, getSecret()) as JwtPayload;
    return next();
  } catch {
    return response.status(401).json({ error: "Invalid or expired token." });
  }
}

export function requireRole(role: Role) {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = (request as AuthenticatedRequest).user;
    if (user.role !== role) return response.status(403).json({ error: "You do not have permission for this action." });
    return next();
  };
}
