import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import EnquiryModal from './EnquiryModal';
import BookVisitModal from './BookVisitModal';
import LazyImage from './LazyImage';
import { useSEO } from '../hooks/useSEO';
import '../styles/PropertyDetails.css';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

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

  useSEO({
    title: property ? `${property.title} | ${property.bhk || ''} ${property.type || 'Property'} in ${property.location} | Honesty Realtor` : 'Loading Property... | Honesty Realtor',
    description: property ? `Explore ${property.title} located in ${property.location}. Priced at ${property.price}. Find your dream property with Honesty Realtor.` : '',
    url: window.location.href,
    image: images[0] || `${window.location.origin}/images/logo.png`,
    schema: property ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": property.title,
      "image": images,
      "description": property.description?.replace(/<[^>]*>?/gm, ''),
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": property.priceValue,
        "availability": "https://schema.org/InStock"
      }
    } : null
  });

  // Loading state with Skeleton
  if (loading) {
    return (
      <section className='property-details-section'>
        <div className='property-details__container'>
          {/* Skeleton representation matching the actual UI */}
          <div className='property-details__layout' style={{ marginTop: '40px' }}>
            <div className='property-card-skeleton' style={{ height: '400px' }}>
              <div className='property-card-skeleton__image' style={{ height: '100%' }}></div>
            </div>
            <div className='property-card-skeleton__content' style={{ background: '#fff', borderRadius: '15px', padding: '30px' }}>
              <div className='property-card-skeleton__title' style={{ width: '80%', height: '36px', marginBottom: '20px' }}></div>
              <div className='property-card-skeleton__text' style={{ width: '40%', height: '20px', marginBottom: '10px' }}></div>
              <div className='property-card-skeleton__text' style={{ width: '60%', height: '24px', marginBottom: '30px' }}></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className='property-card-skeleton__badge' style={{ width: '80px', height: '30px' }}></div>
                <div className='property-card-skeleton__badge' style={{ width: '80px', height: '30px' }}></div>
              </div>
            </div>
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
                <LazyImage
                  src={images[activeImageIdx]}
                  alt={`${property.title} - Image ${activeImageIdx + 1}`}
                  className='property-details__main-image'
                  style={{ height: '100%', width: '100%' }}
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
                    <LazyImage src={img} alt={`Thumbnail ${idx + 1}`} style={{ height: '100%', width: '100%' }} />
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

            {/* Amenities */}
            {property.amenities && (property.amenities.length > 0 || typeof property.amenities === 'string') && (
              <div className='property-details__amenities-section'>
                <h3 className='property-details__section-title'>Amenities</h3>
                <div className='property-details__amenities-list'>
                  {(Array.isArray(property.amenities)
                    ? property.amenities
                    : property.amenities.split(',')
                  ).filter(a => a.trim()).map((amenity, idx) => (
                    <span key={idx} className='property-details__amenity-tag'>
                      ✅ {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {property.youtubeLink && getYouTubeEmbedUrl(property.youtubeLink) && (
              <div className='property-details__video-section'>
                <h3 className='property-details__section-title'>Property Tour</h3>
                <div className='property-details__video-wrapper'>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getYouTubeEmbedUrl(property.youtubeLink)} 
                    title="YouTube property video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Description */}
            <div className='property-details__description-section'>
              <h3 className='property-details__section-title'>About this Property</h3>
              <div 
                className='property-details__description' 
                dangerouslySetInnerHTML={{ __html: property.description }} 
              />
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
