import { Link } from "react-router-dom";
import { HospitalCard } from "../components/HospitalCard";
import { Icon } from "../components/Icon";
import { hospitals } from "../data/hospitals";

const contacts = [
  {
    label: "National emergency line",
    number: "112",
    note: "Police, fire, or medical emergency",
  },
  {
    label: "Lagos State Ambulance",
    number: "767",
    note: "LASAMBUS emergency response",
  },
  {
    label: "Federal Road Safety",
    number: "122",
    note: "Road crashes and highway emergencies",
  },
];

export function EmergencyPage() {
  const emergencyHospitals = hospitals.filter(
    ({ emergency24h }) => emergency24h,
  );

  return (
    <div className="emergency-page">
      <section className="emergency-hero">
        <div>
          <span className="emergency-pill">
            <span className="pulse-dot" /> Emergency support
          </span>
          <h1>Get help now.</h1>
          <p>
            If someone is in immediate danger, call 112. Stay on the line and
            follow the emergency operator's instructions.
          </p>
        </div>
        <a className="emergency-call" href="tel:112">
          <Icon name="phone" size={27} />
          <span>
            <small>National emergency number</small>
            <strong>Call 112</strong>
          </span>
        </a>
      </section>

      <section className="section-pad emergency-content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Important contacts</span>
            <h2>Emergency numbers</h2>
          </div>
        </div>
        <div className="contact-grid">
          {contacts.map((contact) => (
            <a className="emergency-contact" href={`tel:${contact.number}`} key={contact.number}>
              <span className="action-icon">
                <Icon name="phone" />
              </span>
              <div>
                <h3>{contact.label}</h3>
                <p>{contact.note}</p>
              </div>
              <strong>{contact.number}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="section-pad nearby-emergency">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Open around the clock</span>
            <h2>Hospitals with emergency care</h2>
          </div>
          <Link className="button secondary" to="/hospitals?emergencyOnly=true">
            View on map
          </Link>
        </div>
        <div className="featured-grid">
          {emergencyHospitals.slice(0, 3).map((hospital) => (
            <HospitalCard hospital={hospital} key={hospital.id} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
