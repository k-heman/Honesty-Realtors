import { useSettings } from '../context/SettingsContext';
import '../styles/Footer.css';

/**
 * Footer Component
 * Premium dark-themed footer with 3 columns:
 * - Brand information and description
 * - Quick navigation links
 * - Contact information
 * Plus a bottom copyright bar.
 */
function Footer() {
  const { settings } = useSettings();

  return (
    <footer className='footer' id='contact'>
      <div className='footer__container'>
        {/* Brand column */}
        <div className='footer__col'>
          <div className='footer__brand'>
            <img
              src='/images/honestylogo.jpeg'
              alt='Honesty Realtors'
              className='footer__logo'
            />
            <h3>Honesty Realtors</h3>
          </div>
          <p>
            Your trusted property partner in Hyderabad. We believe in
            transparent deals and honest pricing for every home buyer.
          </p>
        </div>

        {/* Quick links column */}
        <div className='footer__col'>
          <h4>Quick Links</h4>
          <ul>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>Flats</a></li>
            <li><a href='#'>Villas</a></li>
            <li><a href='#'>Apartments</a></li>
            <li><a href='#'>Contact</a></li>
          </ul>
        </div>

        <div className='footer__col'>
          <h4>Contact Us</h4>
          <p>📍 {settings?.address || 'Hyderabad, Telangana'}</p>
          <p>📞 {settings?.phone || '+91 85238 02251'}</p>
          {settings?.email && <p>✉️ {settings.email}</p>}
        </div>
      </div>

      {/* Copyright bar */}
      <div className='footer__bottom'>
        <p>&copy; 2026 Honesty Realtors. All rights reserved.</p>
        <a
          href='https://hemank-portfolio.vercel.app/#home'
          target='_blank'
          rel='noopener noreferrer'
          className='developer-badge'
          title='Visit K. Heman Portfolio'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='developer-badge__icon'
          >
            <polyline points='16 18 22 12 16 6' />
            <polyline points='8 6 2 12 8 18' />
          </svg>
          <span>
            Developed By{' '}
            <strong className='developer-badge__name'>K. Heman</strong>
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='developer-badge__external-icon'
          >
            <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
            <polyline points='15 3 21 3 21 9' />
            <line x1='10' y1='14' x2='21' y2='3' />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
