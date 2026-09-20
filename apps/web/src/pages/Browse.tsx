import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge, Card, Select } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { Equipment } from "../api/types";
import { ErrorState, LoadingCards } from "../components/LoadState";
import { useState } from "react";

export function Browse() {
  const [category, setCategory] = useState("all");
  const equipment = useQuery({ queryKey: ["equipment"], queryFn: () => apiFetch<Equipment[]>("/equipment") });
  const categories = [...new Set(equipment.data?.map((item) => item.category) ?? [])];
  const items = equipment.data?.filter((item) => category === "all" || item.category === category) ?? [];
  return <>
    <section className="page-heading"><div><p className="eyebrow">Equipment booking</p><h1>Browse equipment</h1><p className="muted">Reserve campus equipment in a few steps.</p></div>
      <Select label="Filter by category" onChange={(event) => setCategory(event.target.value)} value={category}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</Select>
    </section>
    {equipment.isPending && <LoadingCards />}
    {equipment.error && <ErrorState message={equipment.error.message} />}
    {!equipment.isPending && !equipment.error && <div className="equipment-grid">{items.map((item) => <Card footer={<Link className="text-link" to={`/equipment/${item.id}`}>View availability</Link>} heading={item.name} headingLevel="h2" key={item.id}><div className="card-copy"><Badge tone="info">{item.category}</Badge><p>{item.description}</p><p className="muted">{item.location}</p></div></Card>)}</div>}
    {!equipment.isPending && !equipment.error && items.length === 0 && <p className="empty-state">No equipment matches this category.</p>}
  </>;
}
