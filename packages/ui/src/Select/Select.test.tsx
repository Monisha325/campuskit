import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("connects its label and options", () => {
    render(<Select label="Lab"><option value="a">Lab A</option></Select>);
    expect(screen.getByLabelText("Lab")).toHaveRole("combobox");
    expect(screen.getByLabelText("Lab")).toHaveValue("a");
  });

  it("reports an error with an accessible description", () => {
    render(<Select error="Choose a lab" id="lab" label="Lab"><option>Choose one</option></Select>);
    expect(screen.getByLabelText("Lab")).toHaveAttribute("aria-describedby", "lab-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a lab");
  });

  it("changes selected options through keyboard-capable native control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Lab" onChange={onChange}><option value="a">Lab A</option><option value="b">Lab B</option></Select>);
    await user.selectOptions(screen.getByLabelText("Lab"), "b");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Lab")).toHaveValue("b");
  });
});
