import { useId, useRef, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./SlotGrid.module.scss";

export type SlotState = "available" | "booked" | "yours" | "unavailable";

export type Slot = {
  id: string;
  label: string;
  state: SlotState;
};

export type SlotGridProps = {
  "aria-label"?: string;
  columns?: number;
  onSelect: (slot: Slot) => void;
  selectedId?: string;
  slots: Slot[];
};

const unavailableStates: SlotState[] = ["booked", "unavailable"];

export function SlotGrid({ "aria-label": ariaLabel = "Available time slots", columns = 3, onSelect, selectedId, slots }: SlotGridProps) {
  const gridId = useId();
  const slotRefs = useRef(new Map<string, HTMLButtonElement>());

  function nextAvailableIndex(currentIndex: number, direction: -1 | 1) {
    for (let step = 1; step <= slots.length; step += 1) {
      const candidate = (currentIndex + direction * step + slots.length) % slots.length;
      if (!unavailableStates.includes(slots[candidate].state)) return candidate;
    }
    return currentIndex;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = nextAvailableIndex(index, 1);
    if (event.key === "ArrowLeft") nextIndex = nextAvailableIndex(index, -1);
    if (event.key === "ArrowDown") {
      const candidate = index + columns;
      nextIndex = candidate < slots.length && !unavailableStates.includes(slots[candidate].state) ? candidate : nextAvailableIndex(index, 1);
    }
    if (event.key === "ArrowUp") {
      const candidate = index - columns;
      nextIndex = candidate >= 0 && !unavailableStates.includes(slots[candidate].state) ? candidate : nextAvailableIndex(index, -1);
    }
    if (event.key === "Home") nextIndex = slots.findIndex((slot) => !unavailableStates.includes(slot.state));
    if (event.key === "End") nextIndex = slots.reduce((lastIndex, slot, slotIndex) => !unavailableStates.includes(slot.state) ? slotIndex : lastIndex, -1);
    if (nextIndex === undefined || nextIndex < 0) return;
    event.preventDefault();
    slotRefs.current.get(slots[nextIndex].id)?.focus();
  }

  return (
    <div aria-label={ariaLabel} className={styles.grid} id={gridId} role="grid" style={{ "--slot-columns": columns } as CSSProperties}>
      {slots.map((slot, index) => {
        const isUnavailable = unavailableStates.includes(slot.state);
        const isSelected = slot.id === selectedId;
        return (
          <div
            aria-label={`${slot.label}, ${slot.state}${isSelected ? ", selected" : ""}`}
            aria-selected={isSelected}
            className={styles.cell}
            key={slot.id}
            role="gridcell"
          >
            <button
              className={[styles.slot, styles[slot.state], isSelected && styles.selected].filter(Boolean).join(" ")}
              disabled={isUnavailable}
              onClick={() => onSelect(slot)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                if (node) slotRefs.current.set(slot.id, node);
                else slotRefs.current.delete(slot.id);
              }}
              tabIndex={isUnavailable ? -1 : 0}
              type="button"
            >
              {slot.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
