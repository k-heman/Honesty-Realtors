import { useNavigate } from 'react-router-dom';
import '../styles/PropertyCard.css';

/**
 * PropertyCard Component
 * Displays a single property listing card with:
 * - Image with optional "New" and "Featured" badges
 * - Property title, location, and price
 * - Detail badges for BHK, area, and type
 * - Short description text
 * - "View Details" call-to-action button
 *
 * @param {Object} props
 * @param {Object} props.property - The property data object
 */
function PropertyCard({ property }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className='property-card' onClick={handleViewDetails}>
      {/* Image section with badges and hover overlay */}
      <div className='property-card__image-container'>
        <img
          src={property.image}
          alt={property.title}
          className='property-card__image'
        />
        {/* Conditional badges for new and featured properties */}
        <div className='property-card__badges'>
          {property.isNew && (
            <span className='property-card__badge property-card__badge--new'>
              New
            </span>
          )}
          {property.isFeatured && (
            <span className='property-card__badge property-card__badge--featured'>
              Featured
            </span>
          )}
        </div>
        {/* Gradient overlay for visual depth on hover */}
        <div className='property-card__image-overlay'></div>
      </div>

      {/* Card content section */}
      <div className='property-card__content'>
        <h3 className='property-card__title'>{property.title}</h3>
        <p className='property-card__location'>📍 {property.location}</p>
        <p className='property-card__price'>{property.price}</p>

        {/* Property detail badges (BHK, area, type) */}
        <div className='property-card__details'>
          <span className='property-card__detail-badge'>{property.bhk}</span>
          <span className='property-card__detail-badge'>{property.area}</span>
          <span className='property-card__detail-badge'>{property.type}</span>
        </div>

        <p className='property-card__description'>{property.description}</p>

        {/* Call-to-action button */}
        <button className='property-card__btn' onClick={handleViewDetails}>View Details →</button>
      </div>
    </div>
  );
}

export default PropertyCard;
