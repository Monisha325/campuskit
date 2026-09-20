import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@campuskit/tokens/styles.css";
import { Badge, Button, Card, Checkbox, DataTable, Input, Modal, Select, Skeleton, SlotGrid, Tabs, ToastProvider, useToast } from "@campuskit/ui";
import "./styles.scss";

type Theme = "bootstrap" | "material";
type ColorMode = "light" | "dark";
type BookingRow = { equipment: string; owner: string; time: string };

const bookingRows: BookingRow[] = [
  { equipment: "3D Printer", owner: "You", time: "10:00 AM" },
  { equipment: "Laser Cutter", owner: "Alex Kim", time: "11:00 AM" }
];

function ThemeHarness() {
  const [theme, setTheme] = useState<Theme>("bootstrap");
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [email, setEmail] = useState("");
  const [lab, setLab] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("1100");
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.mode = colorMode;
  }, [colorMode]);

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">CampusKit / Phase 1</p>
        <h1 id="page-title">Theme token harness</h1>
        <p>Switch themes to verify components can consume semantic CSS variables without hard-coded visual values.</p>
        <div className="theme-controls">
          <label className="theme-picker">
            <span>Active theme</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
              <option value="bootstrap">Bootstrap</option>
              <option value="material">Material Design 3</option>
            </select>
          </label>
          <label className="theme-picker">
            <span>Color mode</span>
            <select value={colorMode} onChange={(event) => setColorMode(event.target.value as ColorMode)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </section>

      <section className="demo-card" aria-labelledby="button-preview">
        <h2 id="button-preview">Raw token preview</h2>
        <p>These buttons intentionally use only theme variables. The component library comes next.</p>
        <div className="button-row">
          <Button>Book equipment</Button>
          <Button variant="secondary">Check availability</Button>
          <Button variant="ghost">Save for later</Button>
          <Button variant="danger">Cancel booking</Button>
          <Button loading loadingLabel="Booking equipment">Book equipment</Button>
        </div>
      </section>

      <section className="component-showcase" aria-labelledby="component-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="component-preview">Foundation components</h2>
        </div>
        <div className="showcase-grid">
          <Card footer={<Badge tone="success">Available</Badge>} heading="3D Printer — Lab A" headingLevel="h3">
            Reserve specialized equipment in one-hour slots.
          </Card>
          <Card aria-label="Loading equipment card">
            <Skeleton label="Loading equipment" />
            <div className="skeleton-stack" aria-hidden="true">
              <Skeleton width="70%" />
              <Skeleton width="45%" />
            </div>
          </Card>
        </div>
      </section>

      <section className="component-showcase" aria-labelledby="form-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="form-preview">Accessible form fields</h2>
          <p>Each label, help message, and error state is connected to the control for assistive technology.</p>
        </div>
        <form className="form-preview" onSubmit={(event) => event.preventDefault()}>
          <Input
            description="Use your campus-issued address."
            label="University email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@campus.edu"
            type="email"
            value={email}
          />
          <Select
            error={!lab ? "Select a lab before continuing." : undefined}
            label="Preferred lab"
            onChange={(event) => setLab(event.target.value)}
            value={lab}
          >
            <option value="">Choose a lab</option>
            <option value="lab-a">Lab A</option>
            <option value="lab-b">Lab B</option>
          </Select>
          <Checkbox
            checked={agreedToRules}
            description="Required before reserving equipment."
            label="I agree to the lab rules"
            onChange={(event) => setAgreedToRules(event.target.checked)}
          />
          <Button type="submit">Continue to booking</Button>
        </form>
      </section>

      <section className="component-showcase" aria-labelledby="toast-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="toast-preview">Toast notifications</h2>
          <p>Notifications stack in the viewport, announce their message, and can be dismissed with a keyboard.</p>
        </div>
        <div className="button-row">
          <Button onClick={() => toast({ message: "Booking confirmed for Lab A.", tone: "success" })}>Show success</Button>
          <Button onClick={() => toast({ message: "That slot has just been booked.", tone: "warning" })} variant="secondary">Show warning</Button>
          <Button onClick={() => toast({ message: "Booking could not be saved.", tone: "danger" })} variant="danger">Show error</Button>
        </div>
      </section>

      <section className="component-showcase" aria-labelledby="modal-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="modal-preview">Modal dialog</h2>
          <p>The dialog manages focus, restores it on close, and supports Escape or backdrop dismissal.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Open booking dialog</Button>
      </section>

      <section className="component-showcase" aria-labelledby="tabs-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="tabs-preview">Tabs</h2>
          <p>Use Left/Right arrow keys to move between active panels. Disabled tabs are skipped.</p>
        </div>
        <Tabs
          aria-label="Booking categories"
          tabs={[
            { content: "Two upcoming reservations are ready to manage.", id: "upcoming", label: "Upcoming" },
            { content: "Your booking history is available for reference.", id: "history", label: "History" },
            { content: "No cancelled reservations.", disabled: true, id: "cancelled", label: "Cancelled" }
          ]}
        />
      </section>

      <section className="component-showcase" aria-labelledby="table-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="table-preview">Responsive data table</h2>
          <p>Sort by Equipment or Time. Resize below 768px to see the table become cards.</p>
        </div>
        <DataTable
          caption="Today’s equipment bookings"
          columns={[
            { cell: (row) => row.equipment, header: "Equipment", id: "equipment", sortValue: (row) => row.equipment },
            { cell: (row) => row.time, header: "Time", id: "time", sortValue: (row) => row.time },
            { cell: (row) => row.owner, header: "Booked by", id: "owner" }
          ]}
          getRowId={(row) => row.equipment}
          rows={bookingRows}
        />
      </section>

      <section className="component-showcase" aria-labelledby="slot-preview">
        <div>
          <p className="eyebrow">Shared UI package</p>
          <h2 id="slot-preview">Time-slot picker</h2>
          <p>Use arrow keys to move through selectable time slots. Booked and unavailable slots cannot be selected.</p>
        </div>
        <SlotGrid
          columns={3}
          onSelect={(slot) => setSelectedSlotId(slot.id)}
          selectedId={selectedSlotId}
          slots={[
            { id: "0900", label: "9:00 AM", state: "available" },
            { id: "1000", label: "10:00 AM", state: "booked" },
            { id: "1100", label: "11:00 AM", state: "yours" },
            { id: "1200", label: "12:00 PM", state: "unavailable" },
            { id: "1300", label: "1:00 PM", state: "available" },
            { id: "1400", label: "2:00 PM", state: "available" }
          ]}
        />
      </section>

      <Modal
        description="This reserves the 10:00 AM slot for the 3D Printer in Lab A."
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title="Confirm booking"
      >
        <div className="modal-actions">
          <Button onClick={() => { setModalOpen(false); toast({ message: "Booking confirmed for Lab A.", tone: "success" }); }}>Confirm booking</Button>
          <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
        </div>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><ToastProvider><ThemeHarness /></ToastProvider></StrictMode>
);
