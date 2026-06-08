import { Link } from "react-router-dom";
import type { Hospital } from "../types";
import { Icon } from "./Icon";

export function HospitalCard({
  hospital,
  compact = false,
}: {
  hospital: Hospital;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "hospital-card compact" : "hospital-card"}>
      <div className="card-image-wrap">
        <img src={hospital.image} alt="" className="card-image" />
        {hospital.emergency24h && (
          <span className="open-badge">Open 24 hours</span>
        )}
      </div>
      <div className="card-content">
        <div className="card-heading">
          <div>
            <div className="eyebrow">
              {hospital.ownership} · {hospital.type}
            </div>
            <h3>{hospital.name}</h3>
          </div>
          <span className="rating">
            <Icon name="star" size={15} />
            {hospital.rating}
          </span>
        </div>
        <p className="location-line">
          <Icon name="location" size={16} />
          {hospital.address}, {hospital.city}
        </p>
        <div className="tag-row">
          {hospital.specialties.slice(0, compact ? 2 : 3).map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className="card-footer">
          <span className="verified">
            <Icon name="shield" size={16} />
            Verified facility
          </span>
          <Link to={`/hospitals/${hospital.id}`} className="text-link">
            View details <Icon name="arrow" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
