import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

function renderModal(overrides: Partial<ComponentProps<typeof Modal>> = {}) {
  const onClose = vi.fn();
  const view = render(
    <Modal onClose={onClose} open title="Confirm booking" {...overrides}>
      <button type="button">Confirm</button>
    </Modal>
  );
  return { onClose, ...view };
}

describe("Modal", () => {
  it("does not render while closed", () => {
    renderModal({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible modal dialog", () => {
    renderModal({ description: "This will reserve the selected time." });
    const dialog = screen.getByRole("dialog", { name: "Confirm booking" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("This will reserve the selected time.");
  });

  it("closes with Escape and backdrop clicks", () => {
    const { onClose } = renderModal();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.mouseDown(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("traps Tab at the end of its focusable elements", () => {
    renderModal();
    const buttons = screen.getAllByRole("button");
    const lastButton = buttons[buttons.length - 1];
    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: "Tab" });
    expect(buttons[0]).toHaveFocus();
  });

  it("restores focus and unlocks scrolling when it closes", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const { rerender } = renderModal();
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Modal onClose={vi.fn()} open={false} title="Confirm booking"><button type="button">Confirm</button></Modal>);
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    trigger.remove();
  });
});
