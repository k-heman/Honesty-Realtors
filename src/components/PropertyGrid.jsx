import { useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import { useProperties } from '../context/PropertyContext';
import '../styles/PropertyGrid.css';

/**
 * PropertySkeleton Component
 * Placeholder skeleton for property card loading states.
 */
function PropertySkeleton() {
  return (
    <div className='property-card-skeleton'>
      <div className='property-card-skeleton__image'></div>
      <div className='property-card-skeleton__content'>
        <div className='property-card-skeleton__title'></div>
        <div className='property-card-skeleton__text'></div>
        <div className='property-card-skeleton__badges'>
          <div className='property-card-skeleton__badge'></div>
          <div className='property-card-skeleton__badge'></div>
        </div>
        <div className='property-card-skeleton__button'></div>
      </div>
    </div>
  );
}

/**
 * PropertyGrid Component
 * Renders a responsive grid of PropertyCard components with scroll-triggered
 * fade-in animations using the IntersectionObserver API.
 * Uses Firestore real-time context data.
 */
function PropertyGrid() {
  const { filteredProperties, loading, resetFilters } = useProperties();
  // Ref to the grid container for observing child elements
  const gridRef = useRef(null);

  useEffect(() => {
    // If loading or empty, there is nothing to observe
    if (loading || filteredProperties.length === 0) return;

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

    // Observe all grid item children after a tiny render delay
    const timer = setTimeout(() => {
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.property-grid__item');
        items.forEach((item) => observer.observe(item));
      }
    }, 50);

    // Cleanup observer on unmount or updates
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [filteredProperties, loading]);

  return (
    <section className='property-grid-section' id='properties'>
      <div className='property-grid-section__container'>
        <h2 className='property-grid-section__heading'>Featured Properties</h2>
        <p className='property-grid-section__subheading'>
          Handpicked premium properties across Hyderabad
        </p>

        {loading ? (
          <div>
            <div className='property-grid-loading-message'>
              <div className='spinner'></div>
              <span>Loading amazing properties...</span>
            </div>
            <div className='property-grid'>
              <PropertySkeleton />
              <PropertySkeleton />
              <PropertySkeleton />
              <PropertySkeleton />
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className='property-grid'>
            <div className='property-grid-empty'>
              <div className='property-grid-empty__icon'>🔍</div>
              <h3 className='property-grid-empty__title'>No Properties Found</h3>
              <p className='property-grid-empty__description'>
                No properties match your active search filters. Try selecting a different location or price range.
              </p>
              <button className='property-grid-empty__btn' onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className='property-grid' ref={gridRef}>
            {filteredProperties.map((property) => (
              <div key={property.id} className='property-grid__item'>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PropertyGrid;
