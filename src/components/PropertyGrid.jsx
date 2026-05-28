import { useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import { properties } from '../data/properties';
import '../styles/PropertyGrid.css';

/**
 * PropertyGrid Component
 * Renders a responsive grid of PropertyCard components with scroll-triggered
 * fade-in animations using the IntersectionObserver API.
 *
 * Each grid item starts invisible and gains the 'visible' class
 * when it enters the viewport (threshold: 10%).
 */
function PropertyGrid() {
  // Ref to the grid container for observing child elements
  const gridRef = useRef(null);

  useEffect(() => {
    // Create an IntersectionObserver to watch for cards entering the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add 'visible' class to trigger CSS fade-in animation
            entry.target.classList.add('visible');
            // Stop observing once the animation has been triggered
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Trigger when 10% of the element is visible
        threshold: 0.1,
      }
    );

    // Observe all grid item children
    if (gridRef.current) {
      const items = gridRef.current.querySelectorAll('.property-grid__item');
      items.forEach((item) => observer.observe(item));
    }

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <section className='property-grid-section' id='properties'>
      <div className='property-grid-section__container'>
        <h2 className='property-grid-section__heading'>Featured Properties</h2>
        <p className='property-grid-section__subheading'>
          Handpicked premium properties across Hyderabad
        </p>

        {/* Grid container with ref for IntersectionObserver */}
        <div className='property-grid' ref={gridRef}>
          {properties.map((property) => (
            <div key={property.id} className='property-grid__item'>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PropertyGrid;
