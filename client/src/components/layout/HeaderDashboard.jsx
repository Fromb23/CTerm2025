import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { useTheme } from "../../contexts/themeContext.jsx";
import Button from "../ui/Button";
import { useDispatch } from "react-redux";
import { logoutState } from "../../redux/slices/loginSlice.js";

const HeaderDashboard = ({ onToggleSidebar, sidebarOpen }) => {
  const dispatch = useDispatch();
  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      onToggleSidebar(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutState());
  };

  return (
    <header className="w-full bg-primary border-b border-secondary shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden p-2 rounded hover:bg-muted transition-colors"
          onClick={() => onToggleSidebar(!sidebarOpen)}
        >
          <FiMenu className="w-6 h-6 text-secondary" />
        </Button>

        <Link
          to="/dashboard"
          className="text-xl font-bold text-accent hover:text-accent/80 transition-colors"
        >
          cterms2025
        </Link>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-secondary hover:text-accent transition-colors"
          aria-label="Notifications"
        >
          <FiBell className="w-6 h-6" />
          <span className="absolute -top-1 -right-2 bg-accent text-white text-xs font-semibold rounded-full px-1.5">
            3
          </span>
        </Button>

        {/* Profile Dropdown */}
        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 text-secondary hover:text-accent transition-colors"
          >
            <FiUser className="w-6 h-6" />
            <FiChevronDown className="w-4 h-4" />
          </Button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary rounded-lg shadow-lg z-50">
              <ul className="py-2">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-secondary/20"
                  >
                    <FiUser className="mr-2" /> View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-secondary/20"
                  >
                    <FiSettings className="mr-2" /> Settings
                  </Link>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="flex items-center w-full px-4 py-2 text-sm text-secondary hover:bg-secondary/20"
                    onClick={toggleDarkMode}
                  >
                    {isDark ? (
                      <>
                        <FiSun className="mr-2" /> Light Mode
                      </>
                    ) : (
                      <>
                        <FiMoon className="mr-2" /> Dark Mode
                      </>
                    )}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
