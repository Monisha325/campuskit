import cors from "cors";
import express from "express";
import "./db/index.js";
import { authRouter } from "./routes/auth.js";
import { bookingsRouter } from "./routes/bookings.js";
import { equipmentRouter } from "./routes/equipment.js";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json());
app.get("/", (_request, response) => response.json({
  name: "CampusKit API",
  health: "/health",
  routes: {
    auth: "POST /auth/login, POST /auth/register",
    equipment: "GET /equipment, GET /equipment/:id",
    bookings: "GET /bookings/mine, POST /bookings",
    admin: "GET /bookings, PATCH /bookings/:id"
  }
}));
app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.use("/auth", authRouter);
app.use("/equipment", equipmentRouter);
app.use("/bookings", bookingsRouter);
app.use((_request, response) => response.status(404).json({ error: "Route not found." }));
app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  return response.status(500).json({ error: "Unexpected server error." });
});
