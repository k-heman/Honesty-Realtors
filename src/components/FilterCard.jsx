import { useState } from 'react';
import { filterConfig, locations, priceRanges } from '../data/properties';
import '../styles/FilterCard.css';

/**
 * FilterCard Component
 * Multi-level dynamic filter system for property search.
 * - Level 1: Category tabs (Flats, Independent Houses, Villas, Agriculture Land, Plots)
 * - Level 2: Sub-filters based on selected category
 * - Level 3: Nested filters based on selected sub-filter
 * - Permanent: Location dropdown, budget dropdown, and search button
 *
 * Each level resets downstream filters when changed.
 */
function FilterCard() {
  // Active category (e.g., 'Flats', 'Villas')
  const [activeCategory, setActiveCategory] = useState(null);
  // Active sub-filter within the selected category
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  // Active nested filter within the selected sub-filter
  const [activeNestedFilter, setActiveNestedFilter] = useState(null);
  // Selected location from dropdown
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  // Selected price range index
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Extract category names from the filter configuration
  const categories = Object.keys(filterConfig);

  /**
   * Handle category tab click.
   * Resets sub-filter and nested filter when category changes.
   */
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setActiveSubFilter(null);
    setActiveNestedFilter(null);
  };

  /**
   * Handle sub-filter click.
   * Resets nested filter when sub-filter changes.
   */
  const handleSubFilterClick = (sub) => {
    setActiveSubFilter(sub);
    setActiveNestedFilter(null);
  };

  return (
    <div className='filter-card'>
      <h2 className='filter-card__title'>Find Your Dream Property</h2>

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
      {activeCategory && filterConfig[activeCategory].subFilters.length > 0 && (
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
      {activeSubFilter && activeCategory && (
        <div className='filter-card__nested-filters'>
          {filterConfig[activeCategory].nested[activeSubFilter]?.map((nested) => (
            <button
              key={nested}
              className={`filter-card__nested-btn ${activeNestedFilter === nested ? 'active' : ''}`}
              onClick={() => setActiveNestedFilter(nested)}
            >
              {nested}
            </button>
          ))}
        </div>
      )}

      {/* Permanent filters - always visible regardless of category selection */}
      <div className='filter-card__permanent'>
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

        {/* Budget dropdown */}
        <div className='filter-card__select-group'>
          <label>Budget</label>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(Number(e.target.value))}
          >
            {priceRanges.map((range, i) => (
              <option key={i} value={i}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <button className='filter-card__search-btn'>
          🔍 Search Properties
        </button>
      </div>
    </div>
  );
}

export default FilterCard;
