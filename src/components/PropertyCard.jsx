import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';
import ShareModal from './ShareModal';
import { useFavorites } from '../context/FavoritesContext';
import { useCompare } from '../context/CompareContext';
import { stripHtml } from '../utils/stripHtml';
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
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isComparing } = useCompare();
  
  const [showShareModal, setShowShareModal] = useState(false);

  const isFav = isFavorite(property.id);
  const isComp = isComparing(property.id);

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const propertyUrl = `${window.location.origin}/property/${property.id}`;
    const shareText = `Check out this property: ${property.title} in ${property.location} - ${property.price}`;

    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: shareText,
        url: propertyUrl,
      }).catch(err => console.log('Error sharing', err));
    } else {
      setShowShareModal(true);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    toggleCompare(property.id);
  };

  return (
    <div className='property-card' onClick={handleViewDetails}>
      {/* Image section with badges and hover overlay */}
      <div className='property-card__image-container'>
        <LazyImage
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
        
        {/* Top-right floating actions: Share and Heart */}
        <div className='property-card__actions-top'>
          <button 
            className='property-card__icon-btn' 
            onClick={handleShare}
            title='Share Property'
          >
            ↪️
          </button>
          <button 
            className={`property-card__icon-btn ${isFav ? 'property-card__icon-btn--fav' : ''}`} 
            onClick={handleToggleFavorite}
            title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
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

        <p className='property-card__description'>
          {stripHtml(property.description, 120)}
        </p>

        {/* Actions row: View Details and Compare */}
        <div className='property-card__actions-bottom'>
          <button className='property-card__btn' onClick={handleViewDetails}>View Details →</button>
          <button 
            className={`property-card__compare-btn ${isComp ? 'active' : ''}`} 
            onClick={handleToggleCompare}
          >
            {isComp ? '✓ Added to Compare' : '+ Compare'}
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          property={property} 
          onClose={(e) => { 
            if(e) e.stopPropagation(); 
            setShowShareModal(false); 
          }} 
        />
      )}
    </div>
  );
}

export default memo(PropertyCard);
