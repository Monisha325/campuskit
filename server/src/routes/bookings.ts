import { Router } from "express";
import { db } from "../db/index.js";
import { type AuthenticatedRequest, requireAuth, requireRole } from "../middleware/auth.js";

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

bookingsRouter.get("/mine", (request, response) => {
  const user = (request as AuthenticatedRequest).user;
  const bookings = db.prepare(`
    SELECT bookings.id, bookings.slot_start AS slotStart, bookings.status, equipment.name AS equipmentName, equipment.location
    FROM bookings JOIN equipment ON equipment.id = bookings.equipment_id
    WHERE bookings.user_id = ? ORDER BY bookings.slot_start DESC
  `).all(user.id);
  return response.json(bookings);
});

bookingsRouter.get("/", requireRole("admin"), (_request, response) => {
  const bookings = db.prepare(`
    SELECT bookings.id, bookings.slot_start AS slotStart, bookings.status, equipment.name AS equipmentName, users.name AS studentName, users.email AS studentEmail
    FROM bookings JOIN equipment ON equipment.id = bookings.equipment_id JOIN users ON users.id = bookings.user_id
    ORDER BY bookings.created_at DESC
  `).all();
  return response.json(bookings);
});

bookingsRouter.post("/", (request, response) => {
  const user = (request as AuthenticatedRequest).user;
  const { equipmentId, slotStart } = request.body as { equipmentId?: number; slotStart?: string };
  if (!Number.isInteger(equipmentId) || !slotStart || Number.isNaN(Date.parse(slotStart))) {
    return response.status(400).json({ error: "equipmentId and a valid ISO slotStart are required." });
  }
  const equipment = db.prepare("SELECT id FROM equipment WHERE id = ?").get(equipmentId);
  if (!equipment) return response.status(404).json({ error: "Equipment not found." });
  try {
    const result = db.prepare("INSERT INTO bookings (equipment_id, user_id, slot_start) VALUES (?, ?, ?)").run(equipmentId, user.id, slotStart);
    return response.status(201).json({ id: result.lastInsertRowid, equipmentId, slotStart, status: "pending" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) return response.status(409).json({ error: "This slot is no longer available." });
    throw error;
  }
});

bookingsRouter.patch("/:id", requireRole("admin"), (request, response) => {
  const { status } = request.body as { status?: "approved" | "rejected" };
  if (status !== "approved" && status !== "rejected") return response.status(400).json({ error: "Status must be approved or rejected." });
  const result = db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, request.params.id);
  if (result.changes === 0) return response.status(404).json({ error: "Booking not found." });
  return response.json({ id: Number(request.params.id), status });
});
