(() => {
  const styles = `
    .ck-availability { background: var(--color-surface, #ffffff); border: 1px solid var(--color-border, #cbd5e1); border-radius: var(--radius-lg, .5rem); color: var(--color-text, #0f172a); font-family: var(--font-family, system-ui, sans-serif); max-width: 28rem; padding: var(--space-4, 1rem); }
    .ck-availability__title { font-size: 1.125rem; line-height: 1.2; margin: 0; }
    .ck-availability__meta { color: var(--color-text-muted, #64748b); margin: .5rem 0 1rem; }
    .ck-availability__slots { display: grid; gap: .5rem; grid-template-columns: repeat(3, minmax(0, 1fr)); list-style: none; margin: 0; padding: 0; }
    .ck-availability__slot { border: 1px solid var(--color-success, #16a34a); border-radius: var(--radius-md, .375rem); color: var(--color-success, #16a34a); font-size: .875rem; padding: .5rem; text-align: center; }
    .ck-availability__slot--unavailable { background: var(--color-surface-muted, #f1f5f9); border-color: var(--color-border, #cbd5e1); color: var(--color-text-muted, #64748b); }
    .ck-availability__message { color: var(--color-text-muted, #64748b); margin: 0; }
  `;

  const defaultSlots = [9, 10, 11, 12, 13, 14].map((hour) => new Date(2026, 8, 21, hour, 0, 0).toISOString());

  function formatSlot(slotStart) {
    return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(slotStart));
  }

  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderMessage(content, message) {
    content.replaceChildren(element("p", "ck-availability__message", message));
  }

  function renderEquipment(content, equipment, slotStarts) {
    const bookedSlots = new Set(equipment.bookings.filter((booking) => ["pending", "approved"].includes(booking.status)).map((booking) => booking.slotStart));
    const title = element("h2", "ck-availability__title", equipment.name);
    const meta = element("p", "ck-availability__meta", `${equipment.location} · ${equipment.category}`);
    const slots = element("ul", "ck-availability__slots");
    slots.setAttribute("aria-label", "Time slot availability");

    slotStarts.forEach((slotStart) => {
      const unavailable = bookedSlots.has(slotStart);
      const item = element("li", `ck-availability__slot${unavailable ? " ck-availability__slot--unavailable" : ""}`, `${formatSlot(slotStart)} · ${unavailable ? "Booked" : "Available"}`);
      slots.append(item);
    });
    content.replaceChildren(title, meta, slots);
  }

  /**
   * Mount an embeddable availability preview.
   * @param {Element|string} target DOM element or selector where the widget is rendered.
   * @param {{ apiBaseUrl: string, equipmentId: number|string, slotStarts?: string[] }} options
   */
  function createAvailabilityWidget(target, options) {
    const root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) throw new Error("CampusKit availability widget target was not found.");
    if (!options?.apiBaseUrl || !options?.equipmentId) throw new Error("apiBaseUrl and equipmentId are required.");

    root.classList.add("ck-availability");
    const style = document.createElement("style");
    style.textContent = styles;
    const content = element("div", "ck-availability__content");
    root.replaceChildren(style, content);

    const refresh = async () => {
      renderMessage(content, "Loading availability…");
      try {
        const response = await fetch(`${options.apiBaseUrl.replace(/\/$/, "")}/equipment/${options.equipmentId}`);
        if (!response.ok) throw new Error("Equipment is unavailable.");
        renderEquipment(content, await response.json(), options.slotStarts ?? defaultSlots);
      } catch (error) {
        renderMessage(content, error instanceof Error ? error.message : "Availability could not be loaded.");
      }
    };

    void refresh();
    return { destroy: () => root.replaceChildren(), refresh };
  }

  window.CampusKitAvailability = { createAvailabilityWidget };
})();
