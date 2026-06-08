import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { hospitals, reviews as initialReviews } from "../data/hospitals";
import {
  getReviewsForHospital,
  isHospitalBookmarked,
  submitAppointment,
  submitReview,
  toggleHospitalBookmark,
} from "../lib/storage";

export function HospitalPage() {
  const { hospitalId } = useParams();
  const hospital = hospitals.find(({ id }) => id === hospitalId);
  const [bookmarked, setBookmarked] = useState(false);
  const [hospitalReviews, setHospitalReviews] = useState(() => [] as typeof initialReviews);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hospital) return;
    setBookmarked(isHospitalBookmarked(hospital.id));
    const storedReviews = getReviewsForHospital(hospital.id);
    setHospitalReviews([
      ...initialReviews.filter((review) => review.hospitalId === hospital.id),
      ...storedReviews,
    ]);
  }, [hospital]);

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

  function clearMessages() {
    window.setTimeout(() => {
      setStatusMessage(null);
      setErrorMessage(null);
    }, 2200);
  }

  function copyText(value: string, label: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setStatusMessage(`${label} copied`);
        clearMessages();
      })
      .catch(() => {
        setErrorMessage(`Unable to copy ${label}.`);
        clearMessages();
      });
  }

  function handleToggleBookmark() {
    if (!hospital) return;
    const nextState = !bookmarked;
    toggleHospitalBookmark(hospital.id);
    setBookmarked(nextState);
    setStatusMessage(
      nextState ? "Saved to favorites." : "Removed from favorites.",
    );
    clearMessages();
  }

  function handleSubmitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hospital) return;
    setErrorMessage(null);
    setStatusMessage(null);

    if (!reviewAuthor.trim() || !reviewText.trim()) {
      setErrorMessage("Enter your name and review to continue.");
      clearMessages();
      return;
    }

    const newReview = submitReview(hospital.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
    });

    setHospitalReviews((current) => [newReview, ...current]);
    setReviewAuthor("");
    setReviewText("");
    setReviewRating(5);
    setStatusMessage("Thanks — your review has been added.");
    clearMessages();
  }

  function handleSubmitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hospital) return;
    setErrorMessage(null);
    setStatusMessage(null);

    if (!appointmentDate) {
      setErrorMessage("Please choose a date for your appointment request.");
      clearMessages();
      return;
    }

    submitAppointment({
      hospitalId: hospital.id,
      date: appointmentDate,
      note: appointmentNote.trim(),
    });

    setAppointmentDate("");
    setAppointmentNote("");
    setStatusMessage("Appointment request submitted successfully.");
    clearMessages();
  }

  const reportHref = `mailto:report@carefinder.app?subject=Incorrect%20information%20for%20${encodeURIComponent(
    hospital.name,
  )}&body=Please%20update%20the%20details%20for%20${encodeURIComponent(
    hospital.name,
  )}.`;

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
            <button
              type="button"
              className="button outline"
              onClick={() => copyText(`${hospital.phone} • ${hospital.email}`, "Contact info")}
            >
              <Icon name="share" size={17} /> Copy contact
            </button>
            <button
              type="button"
              className={`button bookmark ${bookmarked ? "active" : ""}`}
              onClick={handleToggleBookmark}
            >
              <Icon name="heart" size={17} />
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>
          {statusMessage && <p className="success-message">{statusMessage}</p>}
          {errorMessage && <p className="field-error">{errorMessage}</p>}
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
              <h2>Request an appointment</h2>
              <small>
                Choose a date, add details, and send a request to the hospital.
              </small>
            </div>
            <form className="appointment-form" onSubmit={handleSubmitAppointment}>
              <label>
                Hospital
                <input value={hospital.name} disabled />
              </label>
              <label>
                Appointment date
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  required
                />
              </label>
              <label>
                Note for the hospital team
                <textarea
                  value={appointmentNote}
                  onChange={(event) => setAppointmentNote(event.target.value)}
                  placeholder="Tell the staff what you need or your preferred service"
                />
              </label>
              <button className="button primary" type="submit">
                Submit request
              </button>
            </form>
          </div>
          <div className="content-card">
            <div className="section-heading">
              <h2>Patient reviews</h2>
              <p>Share your experience and help others choose the right facility.</p>
            </div>
            <form className="review-form" onSubmit={handleSubmitReview}>
              <label>
                Your name
                <input
                  value={reviewAuthor}
                  onChange={(event) => setReviewAuthor(event.target.value)}
                  placeholder="First name or initials"
                  required
                />
              </label>
              <label>
                Rating
                <select
                  value={reviewRating}
                  onChange={(event) =>
                    setReviewRating(Number(event.target.value))
                  }
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option value={value} key={value}>
                      {value} star{value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Review
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="What was the service like?"
                  required
                />
              </label>
              <button className="button secondary" type="submit">
                Submit review
              </button>
            </form>
            <div className="review-list">
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
              <div className="contact-actions">
                <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => copyText(hospital.phone, "Phone number")}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className="contact-row">
            <Icon name="share" />
            <div>
              <strong>Email</strong>
              <div className="contact-actions">
                <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => copyText(hospital.email, "Email address")}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className="contact-row">
            <Icon name="location" />
            <div>
              <strong>Address</strong>
              <div className="contact-actions">
                <span>{hospital.address}, {hospital.city}</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => copyText(`${hospital.address}, ${hospital.city}`, "Address")}
                >
                  Copy
                </button>
              </div>
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
          <div className="contact-actions secondary-link">
            <a href={reportHref}>Report incorrect information</a>
          </div>
          <p className="disclaimer">
            Facility details can change. Call ahead to confirm services, cost,
            and availability.
          </p>
        </aside>
      </section>
    </div>
  );
}
