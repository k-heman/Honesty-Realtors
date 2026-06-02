import { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import '../styles/Header.css';

/**
 * Header Component
 * Sticky navigation bar with scroll-based styling and mobile hamburger menu.
 * - Dynamic category navigation fetched from database
 * - Smooth scroll integration with search filter actions
 */
function Header() {
  const { filterConfig, triggerSearch, setSearchCriteria, searchCriteria } = useProperties();

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

  // Extract dynamic categories from configuration or use fallback
  const categories = filterConfig ? Object.keys(filterConfig) : ['Flats', 'Villas'];
  const navLinks = ['Home', ...categories, 'Contact'];

  // Handle navigation click and trigger respective action/scroll
  const handleNavLinkClick = (link, e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (link === 'Home') {
      // Clear filters and scroll to top
      setSearchCriteria({
        category: null,
        subFilter: null,
        nestedFilter: null,
        location: 'All Locations',
        priceRangeIndex: 0
      });
      triggerSearch({
        category: null,
        subFilter: null,
        nestedFilter: null,
        location: 'All Locations',
        priceRangeIndex: 0
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === 'Contact') {
      // Scroll to footer contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Select category filter and scroll to property grid
      triggerSearch({
        category: link,
        subFilter: null,
        nestedFilter: null,
        location: 'All Locations',
        priceRangeIndex: 0
      });
      
      const propertiesSection = document.getElementById('properties');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className='header__container'>
        {/* Logo and brand name */}
        <a className='header__logo-link' href='#' onClick={(e) => handleNavLinkClick('Home', e)}>
          <img
            src='/images/logo.png'
            alt='Honesty Realtors'
            className='header-logo'
          />
          <span className='header__brand'>Honesty Realtors</span>
        </a>

        {/* Desktop navigation links */}
        <nav className='header__nav'>
          {navLinks.map((link) => {
            const isLinkActive = 
              (link === 'Home' && !searchCriteria?.category) ||
              (link !== 'Home' && link !== 'Contact' && searchCriteria?.category === link);

            return (
              <a 
                key={link} 
                className={`header__nav-link ${isLinkActive ? 'active' : ''}`} 
                href='#'
                onClick={(e) => handleNavLinkClick(link, e)}
              >
                {link}
              </a>
            );
          })}
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
              onClick={(e) => handleNavLinkClick(link, e)}
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
