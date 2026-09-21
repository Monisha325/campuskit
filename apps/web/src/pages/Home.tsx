import { Link } from "react-router-dom";
import { Card } from "@campuskit/ui";

export function Home() {
  return <main className="public-site">
    <header className="public-header">
      <Link aria-label="CampusKit home" className="brand" to="/"><span aria-hidden="true" className="brand-mark">C</span><span className="brand-copy"><strong>CampusKit</strong><small>Campus resources</small></span></Link>
      <nav aria-label="Public navigation"><a href="#services">Services</a><a href="#how-it-works">How it works</a></nav>
      <div className="public-actions"><Link className="sign-in-link" to="/login">Sign in</Link><Link className="register-link" to="/register">Create account</Link></div>
    </header>

    <section className="public-hero">
      <div><p className="eyebrow">Campus equipment booking</p><h1>Tools for your next project.</h1><p>Find specialised campus equipment, choose an available time, and keep every booking in one place.</p><div className="hero-actions"><Link className="register-link large" to="/register">Create account <span aria-hidden="true">→</span></Link><Link className="sign-in-link" to="/login">Already registered? Sign in</Link></div></div>
      <aside aria-label="Service information" className="public-summary"><div><strong>3</strong><span>equipment areas</span></div><div><strong>9 AM - 3 PM</strong><span>weekday booking slots</span></div><div><strong>1 hour</strong><span>standard reservation length</span></div></aside>
    </section>

    <section className="public-section" id="services"><div><p className="eyebrow">Available services</p><h2>Equipment that supports practical work.</h2></div><div className="public-card-grid"><Card heading="Fabrication lab" headingLevel="h3"><p>Reserve 3D printing and laser-cutting equipment for prototypes and approved project materials.</p></Card><Card heading="Media equipment" headingLevel="h3"><p>Book camera equipment for coursework, documentation, and creative projects.</p></Card><Card heading="Manage bookings" headingLevel="h3"><p>Review your requests and booking status from one personal dashboard.</p></Card></div></section>

    <section className="public-section process-section" id="how-it-works"><p className="eyebrow">How it works</p><h2>Simple from sign-up to confirmation.</h2><ol><li><span>01</span><div><h3>Create your account</h3><p>Register with your name, email address, and a secure password.</p></div></li><li><span>02</span><div><h3>Choose equipment</h3><p>Search resources and select an available time slot.</p></div></li><li><span>03</span><div><h3>Track your request</h3><p>See each booking in My Bookings after you sign in.</p></div></li></ol></section>
  </main>;
}
