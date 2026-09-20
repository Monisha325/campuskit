import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";
import styles from "./Badge.module.scss";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>Available</Badge>);
    expect(screen.getByText("Available")).toBeVisible();
  });

  it.each(["neutral", "success", "warning", "danger", "info"] as const)("supports the %s tone", (tone) => {
    render(<Badge tone={tone}>Status</Badge>);
    expect(screen.getByText("Status")).toHaveClass(styles[tone]);
  });

  it("passes an accessible label to the badge", () => {
    render(<Badge aria-label="Equipment is available">Available</Badge>);
    expect(screen.getByLabelText("Equipment is available")).toHaveTextContent("Available");
  });
});
