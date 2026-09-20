import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Card, Modal, SlotGrid, useToast } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { EquipmentDetail } from "../api/types";
import { ErrorState } from "../components/LoadState";

const hours = [9, 10, 11, 12, 13, 14];
const toSlotStart = (hour: number) => new Date(2026, 8, 21, hour, 0, 0).toISOString();

export function EquipmentDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string>();
  const [confirming, setConfirming] = useState(false);
  const equipment = useQuery({ queryKey: ["equipment", id], queryFn: () => apiFetch<EquipmentDetail>(`/equipment/${id}`), enabled: Boolean(id) });
  const booking = useMutation({
    mutationFn: (slotStart: string) => apiFetch("/bookings", { body: JSON.stringify({ equipmentId: Number(id), slotStart }), method: "POST" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["equipment", id] }); queryClient.invalidateQueries({ queryKey: ["bookings"] }); setConfirming(false); toast({ message: "Booking request submitted.", tone: "success" }); },
    onError: (error: Error) => toast({ message: error.message, tone: "danger" })
  });
  const slots = useMemo(() => hours.map((hour) => {
    const slotStart = toSlotStart(hour);
    const existing = equipment.data?.bookings.find((item) => item.slotStart === slotStart);
    const label = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(slotStart));
    return { id: slotStart, label, state: existing ? "booked" as const : "available" as const };
  }), [equipment.data]);
  const selected = slots.find((slot) => slot.id === selectedId);
  if (equipment.isPending) return <Card aria-label="Loading equipment"><p>Loading equipment…</p></Card>;
  if (equipment.error || !equipment.data) return <ErrorState message={equipment.error?.message ?? "Equipment not found."} />;
  return <><Link className="text-link" to="/browse">← Back to browse</Link><section className="detail-layout"><Card heading={equipment.data.name} headingLevel="h1"><div className="card-copy"><Badge tone="info">{equipment.data.category}</Badge><p>{equipment.data.description}</p><p className="muted">{equipment.data.location}</p></div></Card>
    <Card heading="Choose a time" headingLevel="h2"><div className="booking-panel"><SlotGrid onSelect={(slot) => setSelectedId(slot.id)} selectedId={selectedId} slots={slots} /><Button disabled={!selected} onClick={() => setConfirming(true)}>Confirm booking</Button></div></Card></section>
    <Modal onClose={() => setConfirming(false)} open={confirming} title="Confirm booking" description={`Request ${equipment.data.name} at ${selected?.label ?? "the selected time"}?`}><div className="modal-actions"><Button loading={booking.isPending} loadingLabel="Submitting request" onClick={() => selected && booking.mutate(selected.id)}>Submit request</Button><Button onClick={() => setConfirming(false)} variant="secondary">Cancel</Button></div></Modal>
  </>;
}
