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
  return (
    <footer className='footer' id='contact'>
      <div className='footer__container'>
        {/* Brand column */}
        <div className='footer__col'>
          <div className='footer__brand'>
            <img
              src='/images/logo.png'
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

        {/* Contact info column */}
        <div className='footer__col'>
          <h4>Contact Us</h4>
          <p>📍 Hyderabad, Telangana</p>
          <p>📞 +91 85238 02251</p>
          {/* <p>✉️ info@honestyrealtors.com</p> */}
        </div>
      </div>

      {/* Copyright bar */}
      <div className='footer__bottom'>
        <p>&copy; 2026 Honesty Realtors. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
