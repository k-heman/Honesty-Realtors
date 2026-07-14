import React, { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px', /* Bottom left placing it distinct from WhatsApp */
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'var(--gradient-gold)',
        color: 'var(--color-navy)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        cursor: 'pointer',
        zIndex: 9998,
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(0)';
      }}
      onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
      }}
    >
      ↑
    </button>
  );
}
