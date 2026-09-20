import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";
import styles from "./Skeleton.module.scss";

describe("Skeleton", () => {
  it("announces a supplied loading label", () => {
    render(<Skeleton label="Loading equipment" />);
    expect(screen.getByRole("status", { name: "Loading equipment" })).toHaveAttribute("aria-busy", "true");
  });

  it("is decorative without a loading label", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders its requested shape and animation state", () => {
    const { container } = render(<Skeleton animated={false} variant="circle" />);
    expect(container.firstChild).toHaveClass(styles.circle);
    expect(container.firstChild).not.toHaveClass(styles.animated);
  });
});
