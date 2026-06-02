import { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import '../styles/FilterCard.css';

// Manual Budget Range Options
const minPriceOptions = [
  { label: 'Min Price', value: 0 },
  { label: '₹20 Lakhs', value: 2000000 },
  { label: '₹30 Lakhs', value: 3000000 },
  { label: '₹50 Lakhs', value: 5000000 },
  { label: '₹75 Lakhs', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹2 Crores', value: 20000000 },
  { label: '₹3 Crores', value: 30000000 },
  { label: '₹5 Crores', value: 50000000 },
  { label: '₹10 Crores', value: 100000000 }
];

const maxPriceOptions = [
  { label: 'Max Price', value: Infinity },
  { label: '₹30 Lakhs', value: 3000000 },
  { label: '₹50 Lakhs', value: 5000000 },
  { label: '₹75 Lakhs', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹2 Crores', value: 20000000 },
  { label: '₹3 Crores', value: 30000000 },
  { label: '₹5 Crores', value: 50000000 },
  { label: '₹10 Crores', value: 100000000 },
  { label: '₹10+ Crores', value: Infinity }
];

/**
 * FilterCard Component
 * Multi-level dynamic filter system for property search connected to Firebase.
 * - Search bar with auto-recommend suggestion lists of matching properties.
 * - Level 1: Category tabs (Flats, Independent Houses, Villas, Agriculture Land, Plots)
 * - Level 2: Sub-filters based on selected category
 * - Level 3: Nested filters based on selected sub-filter
 * - Permanent: Location and side-by-side Min/Max Price dropdown selectors
 */
function FilterCard() {
  const { properties, filterConfig, locations, triggerSearch, loading, searchCriteria } = useProperties();

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecs, setShowRecs] = useState(false);

  // Active category (e.g., 'Flats', 'Villas')
  const [activeCategory, setActiveCategory] = useState(null);
  // Active sub-filter within the selected category
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  // Active nested filter within the selected sub-filter
  const [activeNestedFilter, setActiveNestedFilter] = useState(null);
  // Selected location from dropdown
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  // Selected min and max prices
  const [selectedMinPrice, setSelectedMinPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(Infinity);

  // Sync state with context searchCriteria when reset happens
  useEffect(() => {
    if (searchCriteria) {
      setSearchTerm(searchCriteria.searchTerm || '');
      setActiveCategory(searchCriteria.category);
      setActiveSubFilter(searchCriteria.subFilter);
      setActiveNestedFilter(searchCriteria.nestedFilter);
      setSelectedLocation(searchCriteria.location);
      setSelectedMinPrice(searchCriteria.minPrice || 0);
      setSelectedMaxPrice(searchCriteria.maxPrice || Infinity);
    }
  }, [searchCriteria]);

  // Compute recommendations in real-time based on search text input
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const term = searchTerm.toLowerCase();
      const matches = properties.filter(prop => {
        return (
          (prop.title || '').toLowerCase().includes(term) ||
          (prop.location || '').toLowerCase().includes(term) ||
          (prop.type || '').toLowerCase().includes(term) ||
          (prop.bhk || '').toLowerCase().includes(term) ||
          (prop.price || '').toLowerCase().includes(term) ||
          (prop.description || '').toLowerCase().includes(term)
        );
      });
      setRecommendations(matches.slice(0, 5)); // Limit to top 5 recommendations
    } else {
      setRecommendations([]);
    }
  }, [searchTerm, properties]);

  // Render glassmorphic skeletons if data is loading from Firestore
  if (loading || !filterConfig) {
    return (
      <div className='filter-card filter-card--loading'>
        <div className='filter-card__skeleton-title'></div>
        <div className='filter-card__skeleton-tabs'></div>
        <div className='filter-card__skeleton-inputs'></div>
      </div>
    );
  }

  // Extract category names from the database configuration
  const categories = Object.keys(filterConfig);

  /**
   * Handle category tab click.
   * Resets sub-filter and nested filter when category changes.
   */
  const handleCategoryClick = (cat) => {
    setActiveCategory(activeCategory === cat ? null : cat);
    setActiveSubFilter(null);
    setActiveNestedFilter(null);
  };

  /**
   * Handle sub-filter click.
   * Resets nested filter when sub-filter changes.
   */
  const handleSubFilterClick = (sub) => {
    setActiveSubFilter(activeSubFilter === sub ? null : sub);
    setActiveNestedFilter(null);
  };

  /**
   * Submit current filters to context
   */
  const handleSearchSubmit = () => {
    triggerSearch({
      searchTerm: searchTerm,
      category: activeCategory,
      subFilter: activeSubFilter,
      nestedFilter: activeNestedFilter,
      location: selectedLocation,
      minPrice: selectedMinPrice,
      maxPrice: selectedMaxPrice
    });
  };

  /**
   * Click handler for recommendations
   */
  const handleRecommendationClick = (prop) => {
    setSearchTerm(prop.title);
    setRecommendations([]);
    
    // Execute search immediately with just this property name
    triggerSearch({
      searchTerm: prop.title,
      category: null,
      subFilter: null,
      nestedFilter: null,
      location: 'All Locations',
      minPrice: 0,
      maxPrice: Infinity
    });

    // Scroll to property grid
    const gridElement = document.getElementById('properties');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='filter-card'>
      <h2 className='filter-card__title'>Find Your Dream Property</h2>

      {/* Search Input Bar with Auto-recommend suggestions */}
      <div className='filter-card__search-bar-container'>
        <span className='filter-card__search-icon'>🔍</span>
        <input
          type='text'
          placeholder='Search by category, type, location, BHK, budget...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowRecs(true)}
          onBlur={() => setTimeout(() => setShowRecs(false), 200)}
          className='filter-card__search-input'
        />

        {/* Dynamic Recommendations popup */}
        {showRecs && recommendations.length > 0 && (
          <div className='filter-card__recommendations-dropdown'>
            {recommendations.map((prop) => (
              <div
                key={prop.id}
                className='filter-card__recommendation-item'
                onClick={() => handleRecommendationClick(prop)}
              >
                <img src={prop.image} alt={prop.title} className='filter-card__rec-img' />
                <div className='filter-card__rec-info'>
                  <span className='filter-card__rec-title'>{prop.title}</span>
                  <span className='filter-card__rec-meta'>
                    📍 {prop.location} • {prop.price} • {prop.type} • {prop.bhk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category tabs - always visible */}
      <div className='filter-card__categories'>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-card__category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-filters - shown only when a category with sub-filters is selected */}
      {activeCategory && filterConfig[activeCategory]?.subFilters?.length > 0 && (
        <div className='filter-card__sub-filters'>
          {filterConfig[activeCategory].subFilters.map((sub) => (
            <button
              key={sub}
              className={`filter-card__sub-btn ${activeSubFilter === sub ? 'active' : ''}`}
              onClick={() => handleSubFilterClick(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Nested filters - shown only when both category and sub-filter are selected */}
      {activeSubFilter && activeCategory && filterConfig[activeCategory]?.nested?.[activeSubFilter] && (
        <div className='filter-card__nested-filters'>
          {filterConfig[activeCategory].nested[activeSubFilter].map((nested) => (
            <button
              key={nested}
              className={`filter-card__nested-btn ${activeNestedFilter === nested ? 'active' : ''}`}
              onClick={() => setActiveNestedFilter(activeNestedFilter === nested ? null : nested)}
            >
              {nested}
            </button>
          ))}
        </div>
      )}

      {/* Permanent filters - location, min/max price range, search button */}
      <div className='filter-card__permanent'>
        <div className='filter-card__inputs-row'>
          {/* Location dropdown */}
          <div className='filter-card__select-group'>
            <label>Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Budget dropdown group */}
          <div className='filter-card__price-range-group'>
            <div className='filter-card__select-group'>
              <label>Min Price</label>
              <select
                value={selectedMinPrice}
                onChange={(e) => setSelectedMinPrice(Number(e.target.value))}
              >
                {minPriceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-card__select-group'>
              <label>Max Price</label>
              <select
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              >
                {maxPriceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search button */}
        <button className='filter-card__search-btn' onClick={handleSearchSubmit}>
          🔍 Search Properties
        </button>
      </div>
    </div>
  );
}

export default FilterCard;
