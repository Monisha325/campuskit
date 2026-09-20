export type User = { id: number; email: string; name: string; role: "student" | "admin" };
export type LoginResponse = { token: string; user: User };
export type Equipment = { id: number; name: string; location: string; category: string; description: string; imageUrl: string | null };
export type EquipmentDetail = Equipment & { bookings: { slotStart: string; status: "pending" | "approved" }[] };
export type Booking = { id: number; slotStart: string; status: string; equipmentName: string; location: string };
export type AdminBooking = Booking & { studentName: string; studentEmail: string };
