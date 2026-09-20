import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("connects its visible label to the checkbox", () => {
    render(<Checkbox label="I agree to the lab rules" />);
    expect(screen.getByLabelText("I agree to the lab rules")).toHaveAttribute("type", "checkbox");
  });

  it("toggles when activated by its label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="I agree to the lab rules" onChange={onChange} />);
    await user.click(screen.getByText("I agree to the lab rules"));
    expect(screen.getByLabelText("I agree to the lab rules")).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("announces validation errors", () => {
    render(<Checkbox error="You must accept the lab rules" id="rules" label="I agree to the lab rules" />);
    expect(screen.getByLabelText("I agree to the lab rules")).toHaveAttribute("aria-describedby", "rules-error");
    expect(screen.getByRole("alert")).toHaveTextContent("You must accept the lab rules");
  });
});
