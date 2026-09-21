import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge, Card, Select } from "@campuskit/ui";
import { apiFetch } from "../api/client";
import type { Equipment } from "../api/types";
import { ErrorState, LoadingCards } from "../components/LoadState";
import { useState } from "react";

export function Browse() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const equipment = useQuery({ queryKey: ["equipment"], queryFn: () => apiFetch<Equipment[]>("/equipment") });
  const categories = [...new Set(equipment.data?.map((item) => item.category) ?? [])];
  const items = equipment.data?.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const searchable = `${item.name} ${item.category} ${item.location}`.toLowerCase();
    return matchesCategory && searchable.includes(query.trim().toLowerCase());
  }) ?? [];
  return <>
    <section className="browse-hero">
      <div className="browse-hero-copy"><p className="eyebrow">Campus resource booking</p><h1>Make more time for making.</h1><p>Reserve the equipment you need, see availability at a glance, and keep every booking in one place.</p></div>
      <dl aria-label="Booking service summary" className="hero-stats"><div><dt>{equipment.data?.length ?? "—"}</dt><dd>resources</dd></div><div><dt>{categories.length || "—"}</dt><dd>categories</dd></div><div><dt>9–3</dt><dd>daily slots</dd></div></dl>
    </section>
    <section aria-label="Find equipment" className="equipment-toolbar">
      <div className="search-field"><label htmlFor="equipment-search">Search resources</label><div className="search-control"><span aria-hidden="true">⌕</span><input id="equipment-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, category, or location" type="search" value={query} /></div></div>
      <Select label="Category" onChange={(event) => setCategory(event.target.value)} value={category}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</Select>
    </section>
    {!equipment.isPending && !equipment.error && <div className="results-summary"><span>{items.length} {items.length === 1 ? "resource" : "resources"} available to browse</span>{(category !== "all" || query) && <button onClick={() => { setCategory("all"); setQuery(""); }} type="button">Clear filters</button>}</div>}
    {equipment.isPending && <LoadingCards />}
    {equipment.error && <ErrorState message={equipment.error.message} />}
    {!equipment.isPending && !equipment.error && <div className="equipment-grid">{items.map((item) => <Card className="equipment-card" footer={<Link className="text-link" to={`/equipment/${item.id}`}>View availability <span aria-hidden="true">→</span></Link>} heading={item.name} headingLevel="h2" key={item.id}><div className="card-copy"><div className="card-meta"><Badge tone="info">{item.category}</Badge><Badge tone="success">Available today</Badge></div><p>{item.description}</p><p className="location"><span aria-hidden="true">⌖</span>{item.location}</p></div></Card>)}</div>}
    {!equipment.isPending && !equipment.error && items.length === 0 && <div className="empty-state"><strong>No matching resources</strong><p>Try a different search term or clear the active filters.</p></div>}
  </>;
}
