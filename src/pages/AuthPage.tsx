import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import {
  resetPassword,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  useAuthSession,
} from "../lib/auth";

export function AuthPage() {
  const user = useAuthSession();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await signUpWithEmail(email, password);
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setMessage(
        "Check your email for a confirmation link. Then sign in to continue.",
      );
      return;
    }

    if (mode === "reset") {
      const { error: resetError } = await resetPassword(email);
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMessage("Password reset instructions have been sent to your email.");
      return;
    }

    const { error: signInError } = await signInWithEmail(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setMessage("Signed in successfully. Refresh the page to continue.");
  }

  async function handleSignOut() {
    await signOutUser();
    setMessage("Signed out successfully.");
  }

  return (
    <main className="login-page">
      <div className="login-brand">
        <Icon name="heart" size={24} />
        <span>Carefinder</span>
      </div>

      <section className="login-card">
        <div className="login-card-header">
          <span className="eyebrow">Account access</span>
          <h1>
            {user
              ? "Welcome back"
              : mode === "signup"
              ? "Create your Carefinder account"
              : mode === "reset"
              ? "Reset your password"
              : "Sign in to Carefinder"}
          </h1>
          <p>
            {user
              ? "Manage your saved hospitals, reviews, and appointment requests."
              : "Sign in or sign up to save favorites, submit reviews, and request appointments."}
          </p>
        </div>

        {user ? (
          <div className="auth-status login-status">
            <p>
              Signed in as <strong>{user.email ?? "anonymous"}</strong>
            </p>
            <div className="login-actions">
              <button className="button primary" onClick={handleSignOut}>
                Sign out
              </button>
              <Link className="button secondary" to="/favorites">
                View favorites
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="login-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
              <button
                type="button"
                className={mode === "reset" ? "active" : ""}
                onClick={() => setMode("reset")}
              >
                Reset password
              </button>
            </div>

            <div className="login-form-fields">
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </label>

              {(mode === "login" || mode === "signup") && (
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </label>
              )}
            </div>

            {error && <p className="field-error">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button className="button primary" type="submit" disabled={loading}>
              {loading
                ? "Working…"
                : mode === "signup"
                ? "Create account"
                : mode === "reset"
                ? "Send reset email"
                : "Sign in"}
            </button>

            <div className="login-footer">
              {mode === "login" && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setMode("reset")}
                >
                  Forgot password?
                </button>
              )}
              {mode !== "signup" && (
                <p>
                  New to Carefinder?{' '}
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setMode("signup")}
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </section>

      <div className="login-note">
        <p>
          Your account is secured with Supabase. Use the same email to keep your
          favorites and hospital requests in sync.
        </p>
      </div>
    </main>
  );
}
