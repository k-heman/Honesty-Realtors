import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import EnquiryModal from './EnquiryModal';
import BookVisitModal from './BookVisitModal';
import '../styles/PropertyDetails.css';

/**
 * PropertyDetails Component
 * Full-page property view with image gallery, detailed info, and action buttons.
 * Fetches property data from context using the URL param ID.
 */
function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();

  const [property, setProperty] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showBookVisitModal, setShowBookVisitModal] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find property from context
  useEffect(() => {
    if (properties.length > 0) {
      const found = properties.find(
        (p) => String(p.id) === String(id)
      );
      setProperty(found || null);
    }
  }, [id, properties]);

  // Build images array (support single `image` or array `images`)
  const images = property
    ? property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : []
    : [];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Loading state
  if (loading) {
    return (
      <section className='property-details-section'>
        <div className='property-details__container'>
          <div className='property-details__loading'>
            <div className='spinner'></div>
            <span>Loading property details...</span>
          </div>
        </div>
      </section>
    );
  }

  // Not found state
  if (!property) {
    return (
      <section className='property-details-section'>
        <div className='property-details__container'>
          <div className='property-details__not-found'>
            <div className='property-details__not-found-icon'>🏠</div>
            <h2>Property Not Found</h2>
            <p>The property you are looking for does not exist or has been removed.</p>
            <button className='property-details__back-btn' onClick={() => navigate('/')}>
              ← Back to Properties
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='property-details-section'>
      <div className='property-details__container'>
        {/* Back Navigation */}
        <button className='property-details__back-link' onClick={() => navigate('/')}>
          ← Back to Properties
        </button>

        <div className='property-details__layout'>
          {/* === LEFT: Image Gallery === */}
          <div className='property-details__gallery'>
            <div className='property-details__gallery-main'>
              {images.length > 0 ? (
                <img
                  src={images[activeImageIdx]}
                  alt={`${property.title} - Image ${activeImageIdx + 1}`}
                  className='property-details__main-image'
                />
              ) : (
                <div className='property-details__no-image'>
                  <span>📷</span>
                  <p>No images available</p>
                </div>
              )}

              {/* Gallery navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className='property-details__gallery-arrow property-details__gallery-arrow--left'
                    onClick={handlePrevImage}
                    aria-label='Previous image'
                  >
                    ‹
                  </button>
                  <button
                    className='property-details__gallery-arrow property-details__gallery-arrow--right'
                    onClick={handleNextImage}
                    aria-label='Next image'
                  >
                    ›
                  </button>
                  <div className='property-details__image-counter'>
                    {activeImageIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className='property-details__thumbnails'>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`property-details__thumbnail ${idx === activeImageIdx ? 'active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === RIGHT: Property Info === */}
          <div className='property-details__info'>
            {/* Badges */}
            <div className='property-details__badges'>
              {property.isNew && (
                <span className='property-details__badge property-details__badge--new'>✨ New</span>
              )}
              {property.isFeatured && (
                <span className='property-details__badge property-details__badge--featured'>⭐ Featured</span>
              )}
            </div>

            <h1 className='property-details__title'>{property.title}</h1>

            <p className='property-details__location'>
              📍 {property.location}{property.city ? `, ${property.city}` : ''}
            </p>

            <p className='property-details__price'>{property.price}</p>

            {/* Property specs */}
            <div className='property-details__specs'>
              {property.bhk && (
                <div className='property-details__spec'>
                  <span className='property-details__spec-icon'>🏠</span>
                  <span className='property-details__spec-label'>Type</span>
                  <span className='property-details__spec-value'>{property.bhk}</span>
                </div>
              )}
              {property.area && (
                <div className='property-details__spec'>
                  <span className='property-details__spec-icon'>📐</span>
                  <span className='property-details__spec-label'>Area</span>
                  <span className='property-details__spec-value'>{property.area}</span>
                </div>
              )}
              {property.type && (
                <div className='property-details__spec'>
                  <span className='property-details__spec-icon'>🏢</span>
                  <span className='property-details__spec-label'>Category</span>
                  <span className='property-details__spec-value'>{property.type}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className='property-details__description-section'>
              <h3 className='property-details__section-title'>About this Property</h3>
              <p className='property-details__description'>{property.description}</p>
            </div>

            {/* Action Buttons */}
            <div className='property-details__actions'>
              <button
                className='property-details__action-btn property-details__action-btn--visit'
                onClick={() => setShowBookVisitModal(true)}
              >
                📅 Book a Site Visit
              </button>
              <button
                className='property-details__action-btn property-details__action-btn--enquiry'
                onClick={() => setShowEnquiryModal(true)}
              >
                📩 Enquiry Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEnquiryModal && (
        <EnquiryModal
          property={property}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}
      {showBookVisitModal && (
        <BookVisitModal
          property={property}
          onClose={() => setShowBookVisitModal(false)}
        />
      )}
    </section>
  );
}

export default PropertyDetails;
