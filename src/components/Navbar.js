import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Smart Match
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/applications"
            className={`navbar-link ${
              isActive("/applications") ? "active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Applications
          </Link>

          <Link
            to="/approved"
            className={`navbar-link ${isActive("/approved") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Approved
          </Link>

          <Link
            to="/reviews"
            className={`navbar-link ${isActive("/reviews") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Reviews
          </Link>

          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <style jsx>{`
        .navbar {
          background: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #1976d2;
          text-decoration: none;
        }

        .brand-icon {
          margin-right: 0.5rem;
          font-size: 1.8rem;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-link {
          color: #5f6368;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.2s;
        }

        .navbar-link:hover {
          color: #1976d2;
        }

        .navbar-link.active {
          color: #1976d2;
        }

        .navbar-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #1976d2;
        }

        .signout-button {
          background: #f5f5f5;
          color: #5f6368;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .signout-button:hover {
          background: #e8f0fe;
          color: #1976d2;
        }

        .navbar-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .navbar-toggle span {
          width: 25px;
          height: 3px;
          background: #5f6368;
          margin: 3px 0;
          transition: 0.3s;
        }

        @media (max-width: 768px) {
          .navbar-toggle {
            display: flex;
          }

          .navbar-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: #fff;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            gap: 2rem;
            transition: left 0.3s ease;
          }

          .navbar-menu.active {
            left: 0;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          }

          .navbar-link {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
