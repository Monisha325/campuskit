import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

type Booking = { equipment: string; status: string; time: string };

const rows: Booking[] = [
  { equipment: "3D Printer", status: "Confirmed", time: "11:00 AM" },
  { equipment: "Laser Cutter", status: "Pending", time: "9:00 AM" }
];

const columns: DataTableColumn<Booking>[] = [
  { cell: (booking) => booking.equipment, header: "Equipment", id: "equipment", sortValue: (booking) => booking.equipment },
  { cell: (booking) => booking.time, header: "Time", id: "time", sortValue: (booking) => booking.time },
  { cell: (booking) => booking.status, header: "Status", id: "status" }
];

function renderTable(tableRows = rows) {
  return render(<DataTable caption="My bookings" columns={columns} getRowId={(booking) => booking.equipment} rows={tableRows} />);
}

describe("DataTable", () => {
  it("renders a semantic table with its caption and headers", () => {
    renderTable();
    const table = screen.getByRole("table", { name: "My bookings" });
    expect(within(table).getByRole("columnheader", { name: /Equipment/ })).toBeVisible();
    expect(within(table).getAllByRole("row")).toHaveLength(3);
  });

  it("sorts rows when a sortable header is activated", () => {
    renderTable();
    const table = screen.getByRole("table");
    fireEvent.click(screen.getByRole("button", { name: "Sort by Equipment" }));
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("3D Printer");
    expect(screen.getByRole("columnheader", { name: /Equipment/ })).toHaveAttribute("aria-sort", "ascending");
  });

  it("toggles an active sort direction", () => {
    renderTable();
    const sortButton = screen.getByRole("button", { name: "Sort by Equipment" });
    fireEvent.click(sortButton);
    fireEvent.click(sortButton);
    expect(screen.getByRole("columnheader", { name: /Equipment/ })).toHaveAttribute("aria-sort", "descending");
  });

  it("renders equivalent mobile cards", () => {
    renderTable();
    const card = screen.getByRole("article", { name: "3D Printer" });
    expect(within(card).getByText("Equipment")).toBeVisible();
    expect(within(card).getByText("Confirmed")).toBeVisible();
  });

  it("renders an empty state in both presentations", () => {
    renderTable([]);
    expect(screen.getByRole("table")).toHaveTextContent("No results found.");
    expect(screen.getByRole("status")).toHaveTextContent("No results found.");
  });
});
