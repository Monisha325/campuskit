import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { SlotGrid, type Slot } from "./SlotGrid";

const slots: Slot[] = [
  { id: "0900", label: "9:00 AM", state: "available" },
  { id: "1000", label: "10:00 AM", state: "booked" },
  { id: "1100", label: "11:00 AM", state: "yours" },
  { id: "1200", label: "12:00 PM", state: "unavailable" },
  { id: "1300", label: "1:00 PM", state: "available" }
];

function renderSlotGrid(overrides: Partial<ComponentProps<typeof SlotGrid>> = {}) {
  const onSelect = vi.fn();
  render(<SlotGrid onSelect={onSelect} selectedId="1100" slots={slots} {...overrides} />);
  return onSelect;
}

describe("SlotGrid", () => {
  it("renders the available, booked, yours, and unavailable states", () => {
    renderSlotGrid();
    expect(screen.getByRole("grid", { name: "Available time slots" })).toBeVisible();
    expect(screen.getByRole("gridcell", { name: "11:00 AM, yours, selected" })).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByRole("gridcell", { name: "10:00 AM, booked" })).getByRole("button")).toBeDisabled();
  });

  it("calls onSelect for an available slot but not for blocked slots", () => {
    const onSelect = renderSlotGrid();
    fireEvent.click(within(screen.getByRole("gridcell", { name: "9:00 AM, available" })).getByRole("button"));
    fireEvent.click(within(screen.getByRole("gridcell", { name: "10:00 AM, booked" })).getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(slots[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("moves arrow-key focus and skips blocked slots", () => {
    renderSlotGrid();
    const first = within(screen.getByRole("gridcell", { name: "9:00 AM, available" })).getByRole("button");
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(within(screen.getByRole("gridcell", { name: "11:00 AM, yours, selected" })).getByRole("button")).toHaveFocus();
  });

  it("uses Home and End keys to reach the first and last selectable slots", () => {
    renderSlotGrid();
    const selected = within(screen.getByRole("gridcell", { name: "11:00 AM, yours, selected" })).getByRole("button");
    selected.focus();
    fireEvent.keyDown(selected, { key: "End" });
    const last = within(screen.getByRole("gridcell", { name: "1:00 PM, available" })).getByRole("button");
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: "Home" });
    expect(within(screen.getByRole("gridcell", { name: "9:00 AM, available" })).getByRole("button")).toHaveFocus();
  });
});
