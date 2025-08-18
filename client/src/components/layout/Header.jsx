import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';

const Header = ({ onToggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const navItems = [
    { label: 'About Us', href: '#about' },
    { label: 'Our Programs', href: '#programs' },
    { label: 'Our Community', href: '#community' },
    { label: 'Our Impact', href: '#impact' },
    { label: 'Talent Hub', href: '#talent' }
  ];

  return (
    <header className="bg-accent text-on-accent py-4 shadow-theme-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold">cTerm2025</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="hover:text-blue-300 transition-colors"
              >
                {item.label}
              </a>
            ))}

            <Button variant="primary" size="sm">
              Be Part of Us
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleDarkMode}
              className="border-on-accent text-on-accent"
            >
              Dark Mode
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden button-outline px-3 py-1 rounded focus:outline-none focus:ring-2"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-on-accent pt-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="hover:text-blue-300 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col space-y-2 pt-3 border-t border-on-accent">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Be Part of Us
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onToggleDarkMode();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full border-on-accent text-on-accent"
                >
                  Dark Mode
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  onToggleDarkMode: PropTypes.func.isRequired,
};

export default Header;