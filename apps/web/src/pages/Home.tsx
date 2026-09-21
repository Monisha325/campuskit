import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const FEATURED_SERVICES = [
  {
    id: 1,
    name: "3D Printers",
    category: "Fabrication",
    location: "Innovation Lab A",
    description: "FDM printers for rapid prototyping, course projects, and maker competitions. PLA, PETG and TPU filaments available.",
    icon: "🖨️",
    slots: "9 AM – 3 PM",
    available: 3,
  },
  {
    id: 2,
    name: "Laser Cutters",
    category: "Fabrication",
    location: "Innovation Lab B",
    description: "Precision CO₂ laser cutters for acrylic, plywood, leather, and fabric. Approved materials provided on request.",
    icon: "⚡",
    slots: "9 AM – 3 PM",
    available: 2,
  },
  {
    id: 3,
    name: "Photography Kit",
    category: "Photography",
    location: "Media Studio",
    description: "Sony A7 IV full-frame mirrorless with 24–70 mm f/2.8 lens, tripod, and two LED panels. Perfect for portraits and projects.",
    icon: "📷",
    slots: "9 AM – 3 PM",
    available: 2,
  },
  {
    id: 4,
    name: "Podcast Studio",
    category: "Audio / Video",
    location: "Media Room 2",
    description: "Soundproofed recording booth with condenser microphones, audio interface, and Audacity pre-installed.",
    icon: "🎙️",
    slots: "9 AM – 3 PM",
    available: 1,
  },
  {
    id: 5,
    name: "Soldering Stations",
    category: "Electronics",
    location: "Electronics Lab C",
    description: "Temperature-controlled Hakko soldering stations with fume extractors, component trays, and basic electronic components.",
    icon: "🔧",
    slots: "9 AM – 3 PM",
    available: 5,
  },
  {
    id: 6,
    name: "VR Headsets",
    category: "XR / Immersive",
    location: "XR Hub",
    description: "Meta Quest 3 headsets for design reviews, virtual field trips, and immersive project experiences.",
    icon: "🥽",
    slots: "9 AM – 3 PM",
    available: 4,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create an account",
    body: "Register with your campus email in under a minute. No approval required — just verify your address and you're in.",
  },
  {
    step: "02",
    title: "Browse equipment",
    body: "Explore the full catalogue of campus resources by category, location, or keyword search. See live availability at a glance.",
  },
  {
    step: "03",
    title: "Pick a time slot",
    body: "Choose an open slot on the equipment's calendar. Each slot is one hour, bookable from 9 AM to 3 PM on weekdays.",
  },
  {
    step: "04",
    title: "Get approved & use it",
    body: "A staff member reviews your request within 24 hours. Once approved, head to the lab at your scheduled time.",
  },
];

const STATS = [
  { value: "50+", label: "Campus resources" },
  { value: "12", label: "Equipment categories" },
  { value: "6", label: "Booking slots daily" },
  { value: "<24h", label: "Approval turnaround" },
];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="public-site">
      {/* ── NAV ──────────────────────────────────────────────────── */}
      <header className="public-header">
        <Link aria-label="CampusKit home" className="brand" to="/">
          <span aria-hidden="true" className="brand-mark">C</span>
          <span className="brand-copy">
            <strong>CampusKit</strong>
            <small>Campus resources</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>
        <div className="public-actions">
          {user ? (
            <Link className="register-link" to="/browse">Go to app →</Link>
          ) : (
            <>
              <Link className="sign-in-link" to="/login">Sign in</Link>
              <Link className="register-link" to="/register">Get started free</Link>
            </>
          )}
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="public-hero" id="hero" aria-label="Hero">
        <div>
          <p className="eyebrow">Campus resource booking</p>
          <h1>Every tool you need, one click away.</h1>
          <p>CampusKit lets students and researchers browse, reserve, and track campus equipment — 3D printers, cameras, studios, and more — from a single dashboard.</p>
          <div className="hero-actions">
            {user ? (
              <Link className="register-link large" to="/browse">Browse equipment →</Link>
            ) : (
              <>
                <Link className="register-link large" to="/register">Create a free account →</Link>
                <Link className="sign-in-link" to="/login">Already have an account? Sign in</Link>
              </>
            )}
          </div>
        </div>

        {/* Stats card */}
        <div className="public-summary" aria-label="Booking service statistics">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section className="public-section" id="services" aria-labelledby="services-heading">
        <p className="eyebrow">What you can book</p>
        <h2 id="services-heading">Campus services &amp; equipment</h2>
        <div className="public-card-grid home-services-grid">
          {FEATURED_SERVICES.map((item) => (
            <article className="service-card" key={item.id}>
              <div className="service-card-icon" aria-hidden="true">{item.icon}</div>
              <div className="service-card-body">
                <div className="service-card-meta">
                  <span className="service-badge">{item.category}</span>
                  <span className="service-avail">
                    <span className="avail-dot" aria-hidden="true" />
                    {item.available} available
                  </span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="service-location">
                  <span aria-hidden="true">⌖</span> {item.location} &nbsp;·&nbsp; {item.slots}
                </p>
              </div>
              <div className="service-card-footer">
                {user ? (
                  <Link className="text-link" to="/browse">
                    Book now <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link className="text-link" to="/register">
                    Sign up to book <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="public-section process-section" id="how-it-works" aria-labelledby="process-heading">
        <p className="eyebrow">Simple by design</p>
        <h2 id="process-heading">How booking works</h2>
        <ol aria-label="Booking steps">
          {STEPS.map((s) => (
            <li key={s.step}>
              <span aria-hidden="true">{s.step}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      {!user && (
        <section className="public-section cta-band" id="about" aria-label="Get started">
          <div className="cta-band-inner">
            <div>
              <p className="eyebrow">Ready to book?</p>
              <h2>Start using campus resources today.</h2>
              <p className="cta-sub">Registration is free and instant. No waitlists, no paperwork — just pick a slot and show up.</p>
            </div>
            <div className="cta-actions">
              <Link className="register-link large" to="/register" id="cta-register">
                Create your free account →
              </Link>
              <Link className="sign-in-link" to="/login" id="cta-signin">
                Sign in to existing account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="public-footer" aria-label="Site footer">
        <div className="public-footer-inner">
          <Link aria-label="CampusKit home" className="brand" to="/">
            <span aria-hidden="true" className="brand-mark brand-mark-sm">C</span>
            <span className="brand-copy"><strong>CampusKit</strong></span>
          </Link>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} CampusKit · Campus Equipment Booking Portal
          </p>
          <nav aria-label="Footer navigation" className="footer-nav">
            {user ? (
              <Link to="/browse">Browse equipment</Link>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
