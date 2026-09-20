import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders labelled article content", () => {
    render(<Card aria-label="3D Printer"><p>Lab A</p></Card>);
    expect(screen.getByRole("article", { name: "3D Printer" })).toHaveTextContent("Lab A");
  });

  it("renders an optional semantic heading and footer", () => {
    render(<Card footer="Available today" heading="3D Printer" headingLevel="h3">Details</Card>);
    expect(screen.getByRole("heading", { level: 3, name: "3D Printer" })).toBeVisible();
    expect(screen.getByText("Available today")).toBeInTheDocument();
  });

  it("forwards standard article attributes", () => {
    render(<Card data-testid="card" id="equipment-card">Details</Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("id", "equipment-card");
  });
});
