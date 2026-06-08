import { useEffect, useState } from "react";
import { z } from "zod";
import { Icon } from "../components/Icon";
import { hospitals } from "../data/hospitals";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const hospitalSchema = z.object({
  name: z.string().min(3, "Enter the hospital name"),
  address: z.string().min(8, "Enter a complete address"),
  phone: z.string().regex(/^[+0-9()\-\s]{7,}$/, "Enter a valid phone number"),
  state: z.string().min(2, "Select a state"),
});

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [view, setView] = useState<"overview" | "new">("overview");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    async function applySession(userId?: string) {
      if (!supabase || !userId) {
        setAuthenticated(false);
        setCheckingSession(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      setAuthenticated(!error && data?.role === "admin");
      if (!error && data?.role !== "admin") {
        setAuthError("This account does not have administrator access.");
      }
      setCheckingSession(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session?.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    if (!supabase) {
      setAuthenticated(true);
      return;
    }

    const form = new FormData(event.currentTarget);
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setSigningIn(false);

    if (error) setAuthError(error.message);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setAuthenticated(false);
  }

  if (checkingSession) {
    return (
      <div className="login-page">
        <section className="login-card">
          <p>Checking your admin session…</p>
        </section>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="login-page">
        <div className="login-brand">
          <span className="brand-mark">
            <Icon name="heart" />
          </span>
          <strong>Carefinder Admin</strong>
        </div>
        <section className="login-card">
          <span className="eyebrow">Protected dashboard</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage hospitals, submissions, and patient reviews.</p>
          <form
            onSubmit={signIn}
          >
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="admin@carefinder.ng"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
              />
            </label>
            {authError && <p className="field-error">{authError}</p>}
            <button
              className="button primary"
              type="submit"
              disabled={signingIn}
            >
              {signingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="login-note">
            Admin access is invite-only and authenticated through Supabase.
          </p>
        </section>
      </div>
    );
  }

  function saveHospital(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = hospitalSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      return;
    }
    setErrors({});
    setSaved(true);
    setView("overview");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="heart" size={19} />
          </span>
          <span>Carefinder</span>
        </div>
        <nav>
          <button
            className={view === "overview" ? "active" : ""}
            onClick={() => setView("overview")}
          >
            Overview
          </button>
          <button>Hospitals</button>
          <button>Pending submissions <span>8</span></button>
          <button>Reviews <span>12</span></button>
        </nav>
        <button className="sign-out" onClick={signOut}>
          Sign out
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>{view === "overview" ? "Directory overview" : "Add hospital"}</h1>
          </div>
          {view === "overview" && (
            <button className="button primary" onClick={() => setView("new")}>
              + Add hospital
            </button>
          )}
        </header>

        {view === "overview" ? (
          <>
            {saved && (
              <div className="success-banner">
                <Icon name="check" /> Hospital entry saved as a draft.
              </div>
            )}
            <div className="stats-grid">
              <div className="stat-card">
                <span>Total facilities</span>
                <strong>1,248</strong>
                <small>+24 this month</small>
              </div>
              <div className="stat-card">
                <span>Verified</span>
                <strong>1,102</strong>
                <small>88.3% of directory</small>
              </div>
              <div className="stat-card">
                <span>Pending review</span>
                <strong>8</strong>
                <small>Needs attention</small>
              </div>
              <div className="stat-card">
                <span>Flagged reviews</span>
                <strong>12</strong>
                <small>4 new today</small>
              </div>
            </div>
            <section className="admin-table-card">
              <div className="section-heading">
                <div>
                  <h2>Recently updated</h2>
                  <p>Latest changes to facility information.</p>
                </div>
                <button className="button secondary small">View all</button>
              </div>
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Facility</th>
                      <th>Location</th>
                      <th>Ownership</th>
                      <th>Status</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.slice(0, 5).map((hospital) => (
                      <tr key={hospital.id}>
                        <td><strong>{hospital.name}</strong></td>
                        <td>{hospital.city}, {hospital.state}</td>
                        <td>{hospital.ownership}</td>
                        <td><span className="status-badge">Verified</span></td>
                        <td>{hospital.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <form className="admin-form" onSubmit={saveHospital}>
            <div className="form-section">
              <div>
                <span className="form-step">01</span>
                <h2>Basic information</h2>
                <p>Public-facing identity and contact details.</p>
              </div>
              <div className="form-fields">
                <label>
                  Hospital name *
                  <input name="name" placeholder="e.g. Unity Specialist Hospital" />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </label>
                <label>
                  Address *
                  <input name="address" placeholder="Street and area" />
                  {errors.address && <small className="field-error">{errors.address}</small>}
                </label>
                <div className="field-row">
                  <label>
                    Phone *
                    <input name="phone" placeholder="+234…" />
                    {errors.phone && <small className="field-error">{errors.phone}</small>}
                  </label>
                  <label>
                    State *
                    <select name="state" defaultValue="">
                      <option value="" disabled>Select state</option>
                      <option>Lagos</option>
                      <option>FCT</option>
                      <option>Oyo</option>
                      <option>Rivers</option>
                    </select>
                    {errors.state && <small className="field-error">{errors.state}</small>}
                  </label>
                </div>
              </div>
            </div>
            <div className="form-section">
              <div>
                <span className="form-step">02</span>
                <h2>Clinical profile</h2>
                <p>Services used by patients to compare facilities.</p>
              </div>
              <div className="form-fields">
                <label>
                  Description
                  <textarea
                    name="description"
                    rows={6}
                    placeholder="Markdown supported: describe services, hours, and access notes."
                  />
                </label>
                <label>
                  Specialties
                  <input name="specialties" placeholder="Emergency, Maternity, Paediatrics" />
                </label>
                <label className="checkbox-label">
                  <input name="emergency24h" type="checkbox" />
                  Offers 24-hour emergency care
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="button secondary" onClick={() => setView("overview")}>
                Cancel
              </button>
              <button className="button primary">Save draft</button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
