import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HospitalCard } from "../components/HospitalCard";
import { hospitals } from "../data/hospitals";
import { Icon } from "../components/Icon";
import {
  createPersonalList,
  getFavoriteHospitalIds,
  getPersonalLists,
  toggleHospitalBookmark,
  toggleHospitalInList,
} from "../lib/storage";

export function FavoritesPage() {
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState(() => getPersonalLists());
  const [favorites, setFavorites] = useState(() => getFavoriteHospitalIds());

  const favoriteHospitals = useMemo(
    () => hospitals.filter((hospital) => favorites.includes(hospital.id)),
    [favorites],
  );

  function addList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = listName.trim();
    if (!name) return;
    setLists(createPersonalList(name));
    setListName("");
  }

  function toggleBookmark(hospitalId: string) {
    setFavorites(toggleHospitalBookmark(hospitalId));
  }

  function toggleListItem(list: string, hospitalId: string) {
    setLists(toggleHospitalInList(list, hospitalId));
  }

  return (
    <div className="favorites-page page">
      <section className="page-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Saved care</span>
            <h1>Your favorite hospitals and care lists</h1>
            <p>
              Bookmark hospitals, build personal lists, and access your trusted
              facilities quickly.
            </p>
          </div>
          <Link className="button primary" to="/hospitals">
            Browse hospitals
          </Link>
        </div>

        <form className="list-creation" onSubmit={addList}>
          <label>
            Create a personal list
            <input
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="e.g. Maternity care, Emergency options"
            />
          </label>
          <button className="button secondary" type="submit">
            Add list
          </button>
        </form>

        <div className="favorites-grid">
          <div className="favorite-section">
            <h2>Bookmarked hospitals</h2>
            {favoriteHospitals.length ? (
              <div className="favorite-list">
                {favoriteHospitals.map((hospital) => (
                  <HospitalCard
                    hospital={hospital}
                    key={hospital.id}
                    bookmarked
                    onBookmark={() => toggleBookmark(hospital.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="heart" size={34} />
                <h3>No saved hospitals yet</h3>
                <p>Bookmark hospitals from the directory or detail pages.</p>
              </div>
            )}
          </div>

          <div className="favorite-section">
            <h2>Personal lists</h2>
            {Object.keys(lists).length ? (
              Object.entries(lists).map(([name, ids]) => (
                <div className="list-card" key={name}>
                  <h3>{name}</h3>
                  {ids.length ? (
                    <ul>
                      {ids.map((id) => {
                        const hospital = hospitals.find((item) => item.id === id);
                        if (!hospital) return null;
                        return (
                          <li key={id}>
                            <Link to={`/hospitals/${hospital.id}`}>
                              {hospital.name}
                            </Link>
                            <button
                              className="text-button"
                              type="button"
                              onClick={() => toggleListItem(name, id)}
                            >
                              Remove
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="list-empty">No hospitals in this list yet.</p>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Icon name="moon" size={34} />
                <h3>No personal lists yet</h3>
                <p>Create lists for maternity care, emergency options, or clinics.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
