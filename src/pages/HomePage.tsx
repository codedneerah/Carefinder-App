import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HospitalCard } from "../components/HospitalCard";
import { Icon } from "../components/Icon";
import { hospitals } from "../data/hospitals";

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  function search(event: React.FormEvent) {
    event.preventDefault();
    navigate(`/hospitals?query=${encodeURIComponent(query)}`);
  }

  function useLocation() {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        navigate(
          `/hospitals?latitude=${coords.latitude}&longitude=${coords.longitude}`,
        );
      },
      () => {
        setLocating(false);
        navigate("/hospitals");
      },
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">Trusted healthcare, closer to you</span>
          <h1>Find the right care, right when you need it.</h1>
          <p>
            Search verified hospitals and clinics across Nigeria. Compare
            services, get directions, and make informed healthcare decisions.
          </p>
          <form className="hero-search" onSubmit={search}>
            <Icon name="search" />
            <input
              aria-label="Search hospitals"
              placeholder="Hospital, specialty, city or LGA"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="button primary" type="submit">
              Find care
            </button>
          </form>
          <button className="location-button" onClick={useLocation}>
            <Icon name="location" size={18} />
            {locating ? "Finding your location…" : "Use my current location"}
          </button>
          <div className="trust-row">
            <span>
              <Icon name="shield" size={18} /> Verified information
            </span>
            <span>
              <Icon name="check" size={18} /> Free to use
            </span>
            <span>
              <Icon name="heart" size={18} /> Built for Nigerians
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=1200&q=85"
            alt=""
          />
          <div className="floating-card floating-top">
            <span className="floating-icon">
              <Icon name="shield" />
            </span>
            <div>
              <strong>1,200+ verified</strong>
              <small>health facilities</small>
            </div>
          </div>
          <div className="floating-card floating-bottom">
            <span className="pulse-dot" />
            <div>
              <strong>Emergency care nearby</strong>
              <small>Open 24 hours · 2.4 km</small>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">How can we help?</span>
            <h2>Care starts with the right information.</h2>
          </div>
        </div>
        <div className="action-grid">
          <Link className="action-card coral" to="/emergency">
            <span className="action-icon">
              <Icon name="ambulance" size={27} />
            </span>
            <h3>Emergency help</h3>
            <p>Find 24-hour hospitals and ambulance contacts near you.</p>
            <span className="text-link">
              Get help now <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link className="action-card teal" to="/health-tools">
            <span className="action-icon">
              <Icon name="heart" size={27} />
            </span>
            <h3>Understand test results</h3>
            <p>Turn confusing medical terms into clear, everyday English.</p>
            <span className="text-link">
              Explain my result <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link className="action-card blue" to="/health-tools?tab=medicine">
            <span className="action-icon">
              <Icon name="clock" size={27} />
            </span>
            <h3>Medicine guidance</h3>
            <p>Learn how and when to use medicine prescribed to you.</p>
            <span className="text-link">
              Check guidance <Icon name="arrow" size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section className="service-categories section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Nearby healthcare services</span>
            <h2>Search by category</h2>
          </div>
        </div>
        <div className="category-grid">
          <Link className="category-card" to="/hospitals?query=Hospital">
            <strong>Hospitals</strong>
            <p>Verified hospital listings for general and specialist care.</p>
          </Link>
          <Link className="category-card" to="/hospitals?query=Clinic">
            <strong>Clinics</strong>
            <p>Local clinics for outpatient care and routine visits.</p>
          </Link>
          <Link className="category-card" to="/hospitals?query=Laboratory">
            <strong>Laboratories</strong>
            <p>Testing centres for blood work, imaging, and diagnostics.</p>
          </Link>
          <Link className="category-card" to="/pharmacies">
            <strong>Pharmacies</strong>
            <p>Find pharmacies that offer delivery and 24-hour service.</p>
          </Link>
          <Link className="category-card" to="/hospitals?query=Blood bank">
            <strong>Blood banks</strong>
            <p>Locate blood centres for donation and emergency supply.</p>
          </Link>
        </div>
      </section>

      <section className="featured-section section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Trusted facilities</span>
            <h2>Highly rated hospitals</h2>
          </div>
          <Link to="/hospitals" className="button secondary">
            View all hospitals
          </Link>
        </div>
        <div className="featured-grid">
          {hospitals.slice(0, 3).map((hospital) => (
            <HospitalCard hospital={hospital} key={hospital.id} compact />
          ))}
        </div>
      </section>

      <section className="emergency-banner section-pad">
        <div>
          <span className="eyebrow">In an emergency</span>
          <h2>Every second matters.</h2>
          <p>
            Call Nigeria's national emergency number or find an open emergency
            department near you.
          </p>
        </div>
        <div className="emergency-actions">
          <a className="button light" href="tel:112">
            <Icon name="phone" /> Call 112
          </a>
          <Link className="button outline-light" to="/emergency">
            Find emergency care
          </Link>
        </div>
      </section>
    </>
  );
}
