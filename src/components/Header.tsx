import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import { useAuthSession } from "../lib/auth";

export function Header() {
  const user = useAuthSession();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("carefinder-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("carefinder-theme", theme);
  }, [theme]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Icon name="heart" size={21} />
          </span>
          <span>Carefinder</span>
        </Link>

        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name="menu" />
        </button>

        <nav className={open ? "nav-links is-open" : "nav-links"}>
          <NavLink to="/hospitals" onClick={() => setOpen(false)}>
            Find care
          </NavLink>
          <NavLink to="/pharmacies" onClick={() => setOpen(false)}>
            Pharmacy finder
          </NavLink>
          <NavLink to="/health-tools" onClick={() => setOpen(false)}>
            Understand results
          </NavLink>
          <NavLink to="/emergency" onClick={() => setOpen(false)}>
            Emergency
          </NavLink>
          <NavLink to="/favorites" onClick={() => setOpen(false)}>
            Favorites
          </NavLink>
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() =>
              setTheme((current) => (current === "light" ? "dark" : "light"))
            }
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          </button>
          <NavLink className="auth-link" to="/auth" onClick={() => setOpen(false)}>
            <Icon name="user" size={17} />
            {user?.email ? "Account" : "Sign in"}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
