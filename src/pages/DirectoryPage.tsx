import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HospitalCard } from "../components/HospitalCard";
import { Icon } from "../components/Icon";
import { hospitals, specialties, states } from "../data/hospitals";
import {
  exportHospitals,
  filterHospitals,
  filtersFromSearchParams,
  filtersToSearchParams,
  type ExportColumn,
} from "../lib/utils";
import type { SearchFilters } from "../types";

const allColumns: { key: ExportColumn; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "specialties", label: "Specialties" },
  { key: "rating", label: "Rating" },
];

export function DirectoryPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() =>
    filtersFromSearchParams(params),
  );
  const [showExport, setShowExport] = useState(false);
  const [columns, setColumns] = useState<ExportColumn[]>(
    allColumns.map(({ key }) => key),
  );
  const [copied, setCopied] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");

  const results = useMemo(
    () => filterHospitals(hospitals, filters),
    [filters],
  );

  useEffect(() => {
    setParams(filtersToSearchParams(filters), { replace: true });
  }, [filters, setParams]);

  function update<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function useLocation() {
    setLocationLabel("Finding you…");
    navigator.geolocation?.getCurrentPosition(
      () => setLocationLabel("Showing care near you"),
      () => setLocationLabel("Location unavailable"),
    );
  }

  return (
    <div className="directory-page">
      <section className="directory-header">
        <div>
          <span className="eyebrow">Hospital directory</span>
          <h1>Find healthcare that fits your needs.</h1>
          <p>Search verified facilities across Nigeria and compare your options.</p>
        </div>
      </section>

      <section className="filter-panel" aria-label="Hospital filters">
        <label className="search-field">
          <Icon name="search" />
          <input
            aria-label="Search directory"
            placeholder="Search hospital, city or LGA"
            value={filters.query}
            onChange={(event) => update("query", event.target.value)}
          />
        </label>
        <select
          aria-label="Filter by state"
          value={filters.state}
          onChange={(event) => update("state", event.target.value)}
        >
          {states.map((state) => (
            <option value={state === "All states" ? "" : state} key={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by specialty"
          value={filters.specialty}
          onChange={(event) => update("specialty", event.target.value)}
        >
          {specialties.map((specialty) => (
            <option
              value={specialty === "All specialties" ? "" : specialty}
              key={specialty}
            >
              {specialty}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by ownership"
          value={filters.ownership}
          onChange={(event) => update("ownership", event.target.value)}
        >
          <option value="">All ownership</option>
          <option>Public</option>
          <option>Private</option>
          <option>Mission</option>
        </select>
        <button className="button location" onClick={useLocation}>
          <Icon name="location" size={17} />
          {locationLabel || "Near me"}
        </button>
      </section>

      <div className="results-toolbar">
        <div>
          <strong>{results.length} facilities found</strong>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.emergencyOnly}
              onChange={(event) =>
                update("emergencyOnly", event.target.checked)
              }
            />
            Open 24 hours
          </label>
        </div>
        <div className="toolbar-actions">
          <button className="button secondary small" onClick={share}>
            <Icon name="share" size={17} /> {copied ? "Link copied" : "Share"}
          </button>
          <button
            className="button secondary small"
            onClick={() => setShowExport(true)}
          >
            <Icon name="download" size={17} /> Export CSV
          </button>
        </div>
      </div>

      <section className="directory-layout">
        <div className="result-list">
          {results.length ? (
            results.map((hospital) => (
              <HospitalCard hospital={hospital} key={hospital.id} />
            ))
          ) : (
            <div className="empty-state">
              <Icon name="search" size={34} />
              <h3>No matching facilities</h3>
              <p>Try removing a filter or searching another city.</p>
            </div>
          )}
        </div>
        <div className="map-panel" aria-label="Hospital map">
          <div className="map-grid" />
          <div className="map-road road-one" />
          <div className="map-road road-two" />
          {results.slice(0, 6).map((hospital, index) => (
            <button
              className="map-pin"
              style={{
                left: `${18 + ((index * 29) % 65)}%`,
                top: `${20 + ((index * 23) % 62)}%`,
              }}
              title={hospital.name}
              key={hospital.id}
            >
              <Icon name="location" size={19} />
            </button>
          ))}
          <div className="map-label">Interactive map preview</div>
        </div>
      </section>

      {showExport && (
        <div className="modal-backdrop" onMouseDown={() => setShowExport(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">Export results</span>
            <h2 id="export-title">Choose CSV columns</h2>
            <p>{results.length} matching facilities will be included.</p>
            <div className="column-options">
              {allColumns.map(({ key, label }) => (
                <label className="checkbox-label" key={key}>
                  <input
                    type="checkbox"
                    checked={columns.includes(key)}
                    onChange={(event) =>
                      setColumns((current) =>
                        event.target.checked
                          ? [...current, key]
                          : current.filter((column) => column !== key),
                      )
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="button secondary"
                onClick={() => setShowExport(false)}
              >
                Cancel
              </button>
              <button
                className="button primary"
                disabled={!columns.length}
                onClick={() => {
                  exportHospitals(results, columns, filters.query);
                  setShowExport(false);
                }}
              >
                <Icon name="download" size={17} /> Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
