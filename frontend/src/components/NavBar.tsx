import React from "react";
import { useAuth } from "../contexts/AuthContext";

type NavBarProps = {
  currentPage: "home" | "dashboard";
  onNavigate: (page: "home" | "dashboard") => void;
};

export function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const { user, userProfile } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>
        {user && userProfile && (
          <button
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
