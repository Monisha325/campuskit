import { Router } from "express";
import { db } from "../db/index.js";

export const equipmentRouter = Router();

equipmentRouter.get("/", (_request, response) => {
  const equipment = db.prepare("SELECT id, name, location, category, description, image_url AS imageUrl FROM equipment ORDER BY name").all();
  return response.json(equipment);
});

equipmentRouter.get("/:id", (request, response) => {
  const equipment = db.prepare("SELECT id, name, location, category, description, image_url AS imageUrl FROM equipment WHERE id = ?").get(request.params.id);
  if (!equipment) return response.status(404).json({ error: "Equipment not found." });
  const bookings = db.prepare("SELECT slot_start AS slotStart, status FROM bookings WHERE equipment_id = ? AND status IN ('pending', 'approved') ORDER BY slot_start").all(request.params.id);
  return response.json({ ...equipment as object, bookings });
});
