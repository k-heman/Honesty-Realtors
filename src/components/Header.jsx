import { useState, useEffect } from 'react';
import '../styles/Header.css';

/**
 * Header Component
 * Sticky navigation bar with scroll-based styling and mobile hamburger menu.
 * - Adds 'header--scrolled' class when page is scrolled past 50px
 * - Mobile menu overlay toggles via hamburger button
 * - Nav links close the mobile menu on click
 */
function Header() {
  // Track whether the mobile hamburger menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Track whether the user has scrolled past the threshold
  const [isScrolled, setIsScrolled] = useState(false);

  // Attach scroll listener on mount, clean up on unmount
  useEffect(() => {
    const handleScroll = () => {
      // Add scrolled styling when scrolled more than 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle the mobile menu open/closed
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close the mobile menu when a nav link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Navigation link data for DRY rendering
  const navLinks = ['Home', 'Flats', 'Villas', 'Apartments', 'Contact'];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className='header__container'>
        {/* Logo and brand name */}
        <a className='header__logo-link' href='#'>
          <img
            src='/images/logo.png'
            alt='Honesty Realtors'
            className='header-logo'
          />
          <span className='header__brand'>Honesty Realtors</span>
        </a>

        {/* Desktop navigation links */}
        <nav className='header__nav'>
          {navLinks.map((link) => (
            <a key={link} className='header__nav-link' href='#'>
              {link}
            </a>
          ))}
        </nav>

        {/* Hamburger button for mobile - 3 animated bars */}
        <button
          className={`header__hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label='Toggle navigation menu'
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile navigation overlay - slides down when menu is open */}
      {isMenuOpen && (
        <div className='header__mobile-nav'>
          {navLinks.map((link) => (
            <a
              key={link}
              className='header__mobile-nav-link'
              href='#'
              onClick={handleLinkClick}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
