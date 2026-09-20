import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("connects a visible label to its input", () => {
    render(<Input label="University email" name="email" type="email" />);
    expect(screen.getByLabelText("University email")).toHaveAttribute("name", "email");
  });

  it("announces its description and validation error", () => {
    render(<Input description="Use your .edu email" error="Enter a valid email" id="email" label="University email" />);
    const input = screen.getByLabelText("University email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-description email-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
  });

  it("forwards changes from keyboard entry", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="University email" onChange={onChange} />);
    await user.type(screen.getByLabelText("University email"), "student@campus.edu");
    expect(onChange).toHaveBeenCalled();
  });
});
