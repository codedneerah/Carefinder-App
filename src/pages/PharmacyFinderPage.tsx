import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { pharmacies } from "../data/pharmacies";
import { states } from "../data/hospitals";
import { Icon } from "../components/Icon";

export function PharmacyFinderPage() {
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
  const [openOnly, setOpenOnly] = useState(false);

  const results = useMemo(
    () =>
      pharmacies.filter((pharmacy) => {
        const matchesState = !state || pharmacy.state === state;
        const matchesLocation =
          !location ||
          pharmacy.city.toLowerCase().includes(location.toLowerCase()) ||
          pharmacy.address.toLowerCase().includes(location.toLowerCase());
        const matchesOpen = !openOnly || pharmacy.open24h;
        return matchesState && matchesLocation && matchesOpen;
      }),
    [state, location, openOnly],
  );

  return (
    <div className="pharmacy-page page">
      <section className="page-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Pharmacy finder</span>
            <h1>Search nearby pharmacies</h1>
            <p>
              Find verified pharmacies, check opening hours, and call for
              medicine delivery or advice.
            </p>
          </div>
          <Link className="button primary" to="/hospitals">
            Search hospitals
          </Link>
        </div>

        <div className="filter-panel" aria-label="Pharmacy filters">
          <label>
            City or address
            <input
              placeholder="Lagos, Wuse II, Marina"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>
          <label>
            Filter by state
            <select value={state} onChange={(event) => setState(event.target.value)}>
              {states.map((item) => (
                <option value={item === "All states" ? "" : item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(event) => setOpenOnly(event.target.checked)}
            />
            Open now
          </label>
        </div>

        <div className="result-list">
          {results.length ? (
            results.map((pharmacy) => (
              <article className="hospital-card" key={pharmacy.id}>
                <div className="card-content">
                  <div className="card-heading">
                    <div>
                      <div className="eyebrow">Pharmacy</div>
                      <h3>{pharmacy.name}</h3>
                    </div>
                    <span className="rating">{pharmacy.open24h ? "24/7" : "Hours"}</span>
                  </div>
                  <p className="location-line">{pharmacy.address}, {pharmacy.city}</p>
                  <div className="tag-row">
                    {pharmacy.services.slice(0, 3).map((service) => (
                      <span className="tag" key={service}>{service}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <a className="text-link" href={`tel:${pharmacy.phone}`}>
                      Call <Icon name="phone" size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Icon name="search" size={34} />
              <h3>No pharmacies found</h3>
              <p>Try a broader location or search another state.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
