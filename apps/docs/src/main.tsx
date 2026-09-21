import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@campuskit/tokens/styles.css";
import { Badge, Card } from "@campuskit/ui";
import "./styles.scss";

function CampusKitService() {
  const bookingPortalUrl = import.meta.env.VITE_BOOKING_PORTAL_URL?.replace(/\/$/, "");
  useEffect(() => {
    document.documentElement.dataset.theme = "bootstrap";
    document.documentElement.dataset.mode = "light";
  }, []);

  return (
    <main>
      <header className="service-header">
        <a className="service-brand" href="#top"><span aria-hidden="true">C</span>CampusKit</a>
        <nav aria-label="Service navigation"><a href="#services">Services</a><a href="#how-to-book">How to book</a><a href="#visit">Visit us</a>{bookingPortalUrl && <span className="auth-links"><a href={`${bookingPortalUrl}/login`}>Sign in</a><a className="header-cta" href={`${bookingPortalUrl}/register`}>Create account</a></span>}</nav>
      </header>

      <section className="service-hero" id="top">
        <div>
          <p className="eyebrow">Campus equipment booking</p>
          <h1>Tools for your next project.</h1>
          <p className="hero-copy">CampusKit helps students find and reserve the specialist equipment they need for coursework, research, and creative work.</p>
          <a className="service-cta" href={bookingPortalUrl ?? "#how-to-book"}>{bookingPortalUrl ? "Book equipment" : "How to book"}<span aria-hidden="true">→</span></a>
        </div>
        <aside aria-label="Service at a glance" className="hero-summary">
          <div><strong>3</strong><span>equipment areas</span></div>
          <div><strong>9 AM–3 PM</strong><span>weekday booking slots</span></div>
          <div><strong>1 hour</strong><span>standard reservation length</span></div>
        </aside>
      </section>

      <section className="service-section" id="services">
        <div className="section-intro"><p className="eyebrow">Available services</p><h2>Equipment that supports practical work.</h2><p>Browse available resources in the booking portal and choose a time that fits your schedule.</p></div>
        <div className="service-grid">
          <Card heading="Fabrication lab" headingLevel="h3"><div className="service-card-copy"><Badge tone="success">Available to book</Badge><p>3D printers and laser cutting equipment for prototypes, models, and approved project materials.</p><span>Lab A & Lab B</span></div></Card>
          <Card heading="Media equipment" headingLevel="h3"><div className="service-card-copy"><Badge tone="success">Available to book</Badge><p>Camera equipment for course assignments, documentation, and supervised creative projects.</p><span>Media Room</span></div></Card>
          <Card heading="Study support" headingLevel="h3"><div className="service-card-copy"><Badge tone="info">Plan ahead</Badge><p>Reserve a resource before your lab session so there is time to prepare and check equipment.</p><span>Campus-wide service</span></div></Card>
        </div>
      </section>

      <section className="service-section how-to-book" id="how-to-book">
        <div className="section-intro"><p className="eyebrow">Booking process</p><h2>Simple from search to confirmation.</h2></div>
        <ol className="booking-steps">
          <li><span>01</span><div><h3>Sign in</h3><p>Use your campus account to access the booking portal.</p></div></li>
          <li><span>02</span><div><h3>Choose equipment</h3><p>Search by resource, category, or location and view the available time slots.</p></div></li>
          <li><span>03</span><div><h3>Submit your request</h3><p>Confirm a suitable slot. You can track the request in My Bookings.</p></div></li>
        </ol>
      </section>

      <section className="visit-panel" id="visit">
        <div><p className="eyebrow">Before you visit</p><h2>Bring your campus ID and arrive on time.</h2><p>Some equipment requires a short induction or staff approval before use. Check the resource details before submitting a request.</p></div>
        <dl><div><dt>Opening hours</dt><dd>Monday–Friday, 9 AM–3 PM</dd></div><div><dt>Need help?</dt><dd>Speak with the lab team before booking.</dd></div></dl>
      </section>

      <footer className="service-footer"><span>CampusKit</span><span>Campus equipment booking service</span></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><CampusKitService /></StrictMode>);
