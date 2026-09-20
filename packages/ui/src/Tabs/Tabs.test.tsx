import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs, type Tab } from "./Tabs";

const tabs: Tab[] = [
  { content: "Upcoming reservations", id: "upcoming", label: "Upcoming" },
  { content: "Past reservations", id: "past", label: "Past" },
  { content: "Cancelled reservations", disabled: true, id: "cancelled", label: "Cancelled" }
];

describe("Tabs", () => {
  it("connects the active tab with its panel", () => {
    render(<Tabs aria-label="Booking history" tabs={tabs} />);
    const tab = screen.getByRole("tab", { name: "Upcoming" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", tab.id);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Upcoming reservations");
  });

  it("changes panel when a tab is clicked", () => {
    render(<Tabs tabs={tabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Past" }));
    expect(screen.getByRole("tab", { name: "Past" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Past reservations");
  });

  it("moves roving focus with Arrow keys and skips disabled tabs", () => {
    render(<Tabs tabs={tabs} />);
    const upcoming = screen.getByRole("tab", { name: "Upcoming" });
    upcoming.focus();
    fireEvent.keyDown(upcoming, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Past" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("tab", { name: "Past" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Upcoming" })).toHaveFocus();
  });

  it("supports Home, End, and controlled change callbacks", () => {
    const onChange = vi.fn();
    render(<Tabs activeId="past" onChange={onChange} tabs={tabs} />);
    const past = screen.getByRole("tab", { name: "Past" });
    fireEvent.keyDown(past, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith("upcoming");
    fireEvent.keyDown(past, { key: "End" });
    expect(onChange).toHaveBeenCalledWith("past");
  });
});
