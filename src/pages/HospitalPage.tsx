import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { hospitals, reviews } from "../data/hospitals";

export function HospitalPage() {
  const { hospitalId } = useParams();
  const hospital = hospitals.find(({ id }) => id === hospitalId);

  if (!hospital) {
    return (
      <div className="empty-state page-empty">
        <h1>Hospital not found</h1>
        <Link className="button primary" to="/hospitals">
          Return to directory
        </Link>
      </div>
    );
  }

  const hospitalReviews = reviews.filter(
    ({ hospitalId: id }) => id === hospital.id,
  );

  return (
    <div className="detail-page">
      <div className="breadcrumbs">
        <Link to="/hospitals">Hospitals</Link>
        <Icon name="arrow" size={14} />
        <span>{hospital.name}</span>
      </div>
      <section className="detail-hero">
        <img src={hospital.image} alt={`${hospital.name} facility`} />
        <div className="detail-summary">
          <span className="eyebrow">
            {hospital.ownership} · {hospital.type}
          </span>
          <h1>{hospital.name}</h1>
          <p className="location-line">
            <Icon name="location" />
            {hospital.address}, {hospital.city}, {hospital.state}
          </p>
          <div className="detail-meta">
            <span className="rating large">
              <Icon name="star" size={17} /> {hospital.rating}
            </span>
            <span>{hospital.reviewCount} reviews</span>
            <span>{hospital.priceLevel} cost level</span>
          </div>
          <div className="tag-row">
            {hospital.specialties.map((specialty) => (
              <span className="tag" key={specialty}>
                {specialty}
              </span>
            ))}
          </div>
          <div className="detail-actions">
            <a
              className="button primary"
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="location" size={17} /> Get directions
            </a>
            <a className="button secondary" href={`tel:${hospital.phone}`}>
              <Icon name="phone" size={17} /> Call hospital
            </a>
          </div>
        </div>
      </section>

      <section className="detail-layout">
        <div className="detail-main">
          <div className="content-card">
            <h2>About this facility</h2>
            <p>{hospital.description}</p>
          </div>
          <div className="content-card">
            <h2>Services and specialties</h2>
            <div className="info-grid">
              {hospital.services.map((service) => (
                <span className="check-item" key={service}>
                  <Icon name="check" size={17} /> {service}
                </span>
              ))}
            </div>
          </div>
          <div className="content-card">
            <h2>Equipment and amenities</h2>
            <div className="split-list">
              <div>
                <h3>Medical equipment</h3>
                {hospital.equipment.map((item) => (
                  <p className="check-item" key={item}>
                    <Icon name="check" size={17} /> {item}
                  </p>
                ))}
              </div>
              <div>
                <h3>Patient amenities</h3>
                {hospital.amenities.map((item) => (
                  <p className="check-item" key={item}>
                    <Icon name="check" size={17} /> {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="section-heading">
              <h2>Patient reviews</h2>
              <button className="button secondary small">Write a review</button>
            </div>
            {hospitalReviews.length ? (
              hospitalReviews.map((review) => (
                <article className="review" key={review.id}>
                  <div className="review-avatar">{review.author[0]}</div>
                  <div>
                    <strong>{review.author}</strong>
                    <div className="review-stars">
                      {"★".repeat(review.rating)}
                    </div>
                    <p>{review.text}</p>
                    <small>{review.date}</small>
                  </div>
                </article>
              ))
            ) : (
              <p>No published reviews yet.</p>
            )}
          </div>
        </div>
        <aside className="contact-card">
          <h2>Contact and hours</h2>
          <div className="contact-row">
            <Icon name="clock" />
            <div>
              <strong>Visiting hours</strong>
              <span>{hospital.hours}</span>
            </div>
          </div>
          <div className="contact-row">
            <Icon name="phone" />
            <div>
              <strong>Phone</strong>
              <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
            </div>
          </div>
          <div className="contact-row">
            <Icon name="share" />
            <div>
              <strong>Email</strong>
              <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
            </div>
          </div>
          <div className="emergency-status">
            <span className="pulse-dot" />
            <div>
              <strong>
                {hospital.emergency24h
                  ? "24-hour emergency care"
                  : "No 24-hour emergency unit"}
              </strong>
              <span>
                {hospital.ambulance
                  ? "Ambulance service available"
                  : "Call to confirm ambulance access"}
              </span>
            </div>
          </div>
          <p className="disclaimer">
            Facility information can change. Call ahead to confirm services,
            cost, and availability.
          </p>
        </aside>
      </section>
    </div>
  );
}
