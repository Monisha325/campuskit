import { useQuery } from "@tanstack/react-query";
import { Badge, DataTable } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { Booking } from "../api/types";
import { ErrorState } from "../components/LoadState";

const toneForStatus = (status: string) => status === "approved" ? "success" : status === "rejected" ? "danger" : status === "cancelled" ? "neutral" : "warning" as const;

export function MyBookings() {
  const bookings = useQuery({ queryKey: ["bookings", "mine"], queryFn: () => apiFetch<Booking[]>("/bookings/mine") });
  if (bookings.isPending) return <p>Loading your bookings…</p>;
  if (bookings.error) return <ErrorState message={bookings.error.message} />;
  return <section><div className="page-heading"><div><p className="eyebrow">Account</p><h1>My bookings</h1><p className="muted">Track the approval status of your equipment requests.</p></div></div>
    <DataTable caption="Your equipment bookings" columns={[
      { cell: (row) => row.equipmentName, header: "Equipment", id: "equipment", sortValue: (row) => row.equipmentName },
      { cell: (row) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.slotStart)), header: "Time", id: "time", sortValue: (row) => row.slotStart },
      { cell: (row) => row.location, header: "Location", id: "location" },
      { cell: (row) => <Badge tone={toneForStatus(row.status)}>{row.status}</Badge>, header: "Status", id: "status" }
    ]} getRowId={(row) => String(row.id)} getRowLabel={(row) => row.equipmentName} rows={bookings.data ?? []} />
  </section>;
}
