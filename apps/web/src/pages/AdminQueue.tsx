import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, DataTable, Modal, useToast } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { AdminBooking } from "../api/types";
import { ErrorState } from "../components/LoadState";

export function AdminQueue() {
  const client = useQueryClient();
  const { toast } = useToast();
  const [pendingAction, setPendingAction] = useState<{ booking: AdminBooking; status: "approved" | "rejected" }>();
  const bookings = useQuery({ queryKey: ["bookings", "admin"], queryFn: () => apiFetch<AdminBooking[]>("/bookings") });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" }) => apiFetch(`/bookings/${id}`, { body: JSON.stringify({ status }), method: "PATCH" }),
    onSuccess: (_, variables) => { client.invalidateQueries({ queryKey: ["bookings", "admin"] }); setPendingAction(undefined); toast({ message: `Booking ${variables.status}.`, tone: "success" }); },
    onError: (error: Error) => toast({ message: error.message, tone: "danger" })
  });
  if (bookings.isPending) return <p>Loading approval queue…</p>;
  if (bookings.error) return <ErrorState message={bookings.error.message} />;
  const rows = bookings.data ?? [];
  return <section><div className="page-heading"><div><p className="eyebrow">Administration</p><h1>Approval queue</h1><p className="muted">Approve or reject pending equipment requests.</p></div></div>
    <DataTable caption="Equipment approval requests" columns={[
      { cell: (row) => row.equipmentName, header: "Equipment", id: "equipment", sortValue: (row) => row.equipmentName },
      { cell: (row) => row.studentName, header: "Student", id: "student", sortValue: (row) => row.studentName },
      { cell: (row) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.slotStart)), header: "Time", id: "time", sortValue: (row) => row.slotStart },
      { cell: (row) => row.status, header: "Status", id: "status" },
      { cell: (row) => row.status === "pending" ? <div className="table-actions"><Button onClick={() => setPendingAction({ booking: row, status: "approved" })} size="sm">Approve</Button><Button onClick={() => setPendingAction({ booking: row, status: "rejected" })} size="sm" variant="danger">Reject</Button></div> : "—", header: "Action", id: "action" }
    ]} getRowId={(row) => String(row.id)} getRowLabel={(row) => `${row.equipmentName}, ${row.studentName}`} rows={rows} />
    <Modal onClose={() => setPendingAction(undefined)} open={Boolean(pendingAction)} title={`${pendingAction?.status === "approved" ? "Approve" : "Reject"} booking`} description={`This will ${pendingAction?.status === "approved" ? "approve" : "reject"} ${pendingAction?.booking.studentName ?? "the student"}'s request.`}><div className="modal-actions"><Button loading={update.isPending} loadingLabel="Saving" onClick={() => pendingAction && update.mutate({ id: pendingAction.booking.id, status: pendingAction.status })} variant={pendingAction?.status === "rejected" ? "danger" : "primary"}>Confirm</Button><Button onClick={() => setPendingAction(undefined)} variant="secondary">Cancel</Button></div></Modal>
  </section>;
}
