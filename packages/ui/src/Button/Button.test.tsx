import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import styles from "./Button.module.scss";

describe("Button", () => {
  it.each(["primary", "secondary", "ghost", "danger"] as const)("renders the %s variant", (variant) => {
    render(<Button variant={variant}>Book</Button>);
    expect(screen.getByRole("button", { name: "Book" })).toHaveClass(styles[variant]);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Book</Button>);
    await user.click(screen.getByRole("button", { name: "Book" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables itself and announces its loading state", () => {
    render(<Button loading loadingLabel="Booking equipment">Book</Button>);
    expect(screen.getByRole("button", { name: "Booking equipment" })).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("activates through the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Book</Button>);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon slots without changing the accessible name", () => {
    render(<Button leadingIcon={<span aria-hidden="true">+</span>} trailingIcon={<span aria-hidden="true">→</span>}>Book</Button>);
    expect(screen.getByRole("button", { name: "Book" })).toBeVisible();
  });
});
