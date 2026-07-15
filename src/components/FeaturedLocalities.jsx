import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import '../styles/HomeSections.css';

// Placeholder image for localities with no property image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80';

/**
 * FeaturedLocalities Component
 * Dynamically generates locality cards from Firestore property data.
 * - Extracts unique locations from all properties.
 * - Counts properties per location.
 * - Uses the first property's image as the background.
 * - Displays top 6 localities by property count.
 * - Clicking navigates to Properties section filtered by that location.
 */
export default function FeaturedLocalities() {
  const { properties, triggerSearch } = useProperties();
  const navigate = useNavigate();

  /**
   * Memoized computation of locality data from properties.
   * Runs only when properties array changes.
   * Returns top 6 localities sorted by property count (descending).
   */
  const localityData = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    // Build a map: locationName -> { count, image }
    const locationMap = {};

    properties.forEach((prop) => {
      const loc = (prop.location || '').trim();
      if (!loc) return;

      if (!locationMap[loc]) {
        // Use the first property's main image for this location
        const image =
          (prop.images && prop.images.length > 0 ? prop.images[0] : prop.image) ||
          PLACEHOLDER_IMAGE;
        locationMap[loc] = { name: loc, count: 0, image };
      }

      locationMap[loc].count += 1;
    });

    // Convert to array, sort by count (descending), take top 6
    return Object.values(locationMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [properties]);

  /**
   * Navigate to Properties section with the selected location filter applied.
   */
  const handleLocalityClick = (locName) => {
    // Apply location filter via context
    triggerSearch({
      searchTerm: '',
      category: null,
      subFilter: null,
      nestedFilter: null,
      location: locName,
      minPrice: 0,
      maxPrice: Infinity,
    });

    // Scroll to the properties grid section
    const grid = document.getElementById('properties');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  // Don't render the section if there are no localities
  if (localityData.length === 0) return null;

  return (
    <section className="home-sections__wrapper section-featured-localities">
      <div className="home-sections__container">
        <h2 className="property-grid-section__heading">Explore Popular Localities</h2>
        <p className="property-grid-section__subheading">
          Discover premium properties across Hyderabad's fastest growing locations.
        </p>

        <div className="featured-localities__grid">
          {localityData.map((loc) => (
            <div
              key={loc.name}
              className="featured-localities__card"
              onClick={() => handleLocalityClick(loc.name)}
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="featured-localities__img"
                loading="lazy"
              />
              <div className="featured-localities__overlay"></div>
              <div className="featured-localities__content">
                <h3 className="featured-localities__name">{loc.name}</h3>
                <span className="featured-localities__count">
                  {loc.count} {loc.count === 1 ? 'Property' : 'Properties'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
