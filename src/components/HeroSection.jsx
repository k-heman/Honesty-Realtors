import FilterCard from './FilterCard';
import '../styles/HeroSection.css';

/**
 * HeroSection Component
 * Full-width hero banner with a dark overlay, headline text, and
 * the FilterCard component for property search.
 * The background image is applied via CSS (background-image: url('/images/hero-bg.jpg')).
 */
function HeroSection() {
  return (
    <section className='hero' id='hero'>
      {/* Dark overlay on top of the background image for text readability */}
      <div className='hero__overlay'></div>

      {/* Main hero content: title, subtitle, and filter card */}
      <div className='hero__content'>
        <h1 className='hero__title'>Find Your Perfect Home</h1>
        <p className='hero__subtitle'>
          Trusted property solutions in Hyderabad with complete transparency
        </p>

        {/* Trust Badges */}
        <div className='hero__trust-badges'>
          <span className='hero__trust-badge'><span className='hero__trust-badge-icon'>✔</span> HMDA Approved Projects</span>
          <span className='hero__trust-badge'><span className='hero__trust-badge-icon'>✔</span> DTCP Approved Layouts</span>
          <span className='hero__trust-badge'><span className='hero__trust-badge-icon'>✔</span> RERA Registered Properties</span>
          <span className='hero__trust-badge'><span className='hero__trust-badge-icon'>✔</span> Free Site Visit</span>
        </div>
        <FilterCard />
      </div>
    </section>
  );
}

export default HeroSection;
