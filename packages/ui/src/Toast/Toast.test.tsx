import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";

function ToastTrigger({ duration = 5000, tone = "success" }: { duration?: number; tone?: "success" | "info" | "warning" | "danger" }) {
  const { toast } = useToast();
  return <button onClick={() => toast({ duration, message: "Booking confirmed", tone })} type="button">Show notification</button>;
}

function renderToastTrigger(props?: Parameters<typeof ToastTrigger>[0]) {
  return render(<ToastProvider><ToastTrigger {...props} /></ToastProvider>);
}

afterEach(() => vi.useRealTimers());

describe("Toast", () => {
  it("announces a success notification", async () => {
    const user = userEvent.setup();
    renderToastTrigger();
    await user.click(screen.getByRole("button", { name: "Show notification" }));
    expect(screen.getByRole("status")).toHaveTextContent("Booking confirmed");
  });

  it("uses assertive announcements for danger notifications", async () => {
    const user = userEvent.setup();
    renderToastTrigger({ tone: "danger" });
    await user.click(screen.getByRole("button", { name: "Show notification" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Booking confirmed");
  });

  it("dismisses a notification with the keyboard", async () => {
    const user = userEvent.setup();
    renderToastTrigger();
    await user.click(screen.getByRole("button", { name: "Show notification" }));
    const dismissButton = screen.getByRole("button", { name: "Dismiss notification" });
    dismissButton.focus();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("auto-dismisses after the requested duration", async () => {
    vi.useFakeTimers();
    renderToastTrigger({ duration: 1000 });
    await act(async () => screen.getByRole("button", { name: "Show notification" }).click());
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
