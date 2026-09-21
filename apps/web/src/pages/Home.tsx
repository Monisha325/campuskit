import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const FEATURED_SERVICES = [
  {
    id: 1,
    name: "Laptops",
    category: "Computing",
    location: "IT Hub",
    description: "High-performance Mac and Windows laptops available for short-term loan.",
    icon: "💻",
    slots: "8 AM – 5 PM",
    available: 12,
  },
  {
    id: 2,
    name: "Projectors",
    category: "Presentation",
    location: "Media Center",
    description: "Portable 4K and 1080p projectors with HDMI and wireless casting capabilities.",
    icon: "📽️",
    slots: "8 AM – 5 PM",
    available: 5,
  },
  {
    id: 3,
    name: "Cameras",
    category: "Photography",
    location: "Media Studio",
    description: "DSLR and mirrorless cameras with standard kit lenses for media projects.",
    icon: "📷",
    slots: "9 AM – 3 PM",
    available: 8,
  },
  {
    id: 4,
    name: "Microphones",
    category: "Audio",
    location: "Audio Lab",
    description: "USB and XLR condenser microphones for high-quality audio recording and podcasting.",
    icon: "🎤",
    slots: "9 AM – 5 PM",
    available: 10,
  },
  {
    id: 5,
    name: "Lab/Workshop Equipment",
    category: "Fabrication",
    location: "Innovation Lab",
    description: "Soldering irons, hand tools, multimeters, and basic electronics kits.",
    icon: "🛠️",
    slots: "9 AM – 3 PM",
    available: 15,
  },
  {
    id: 6,
    name: "Sports Equipment",
    category: "Recreation",
    location: "Campus Gym",
    description: "Badminton rackets, basketballs, yoga mats, and other sports gear.",
    icon: "🏸",
    slots: "6 AM – 10 PM",
    available: 20,
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
                <div className="service-card-footer">
                  {user ? (
                    <Link className="btn-pill" to="/browse">
                      Book now
                    </Link>
                  ) : (
                    <Link className="btn-pill" to="/register">
                      Read More
                    </Link>
                  )}
                </div>
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
