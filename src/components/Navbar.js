import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const getStorageTheme = () => {
  let theme = "light-theme";
  if (localStorage.getItem("theme")) {
    theme = localStorage.getItem("theme");
  }
  return theme;
};

export default function Navbar() {
  const location = useLocation().pathname;
  const [theme, setTheme] = useState(getStorageTheme());
  const toggleTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  };
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="navbar">
      <div className="nav-center">
        <Link to="/">Herolo Weather Task</Link>
        <ul className="nav-links">
          <li className={`${location === "/" ? "bold-link" : ""}`}>
            <Link to="/">home</Link>
          </li>
          <li className={`${location === "/favorites" ? "bold-link" : ""}`}>
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul>
      </div>
      <Switch color="default" onChange={toggleTheme} />
    </nav>
  );
}
