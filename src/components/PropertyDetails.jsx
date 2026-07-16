import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from './EnquiryModal';
import BookVisitModal from './BookVisitModal';
import ShareModal from './ShareModal';
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

/** Strip HTML tags and decode common entities for clean text rendering */
const stripHtmlForDescription = (html) => {
  if (!html) return '';
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text;
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
  const { settings } = useSettings();

  const [property, setProperty] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showBookVisitModal, setShowBookVisitModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleShare = () => {
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

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCall = () => {
    const phone = settings?.phone || '+918523802251';
    window.open(`tel:${phone.replace(/\s+/g, '')}`, '_self');
  };

  const handleWhatsApp = () => {
    const phone = settings?.whatsapp || settings?.phone || '+918523802251';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(
      `Hi, I'm interested in the property: ${property.title} (${property.price}) in ${property.location}. Can you provide more details?`
    );
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${msg}`, '_blank');
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

  // Build feature chips from property data
  const getFeatureChips = () => {
    if (!property) return [];
    const chips = [];
    if (property.approval) chips.push({ icon: '✅', label: `${property.approval} Approved` });
    if (property.facing) chips.push({ icon: '🧭', label: `${property.facing} Facing` });
    if (property.bhk) chips.push({ icon: '🏠', label: property.bhk });
    if (property.status) chips.push({ icon: '📋', label: property.status });
    if (property.parking) chips.push({ icon: '🚗', label: 'Parking' });
    if (property.loanAvailable) chips.push({ icon: '🏦', label: 'Loan Available' });
    return chips;
  };

  // Build info card rows
  const getInfoRows = () => {
    if (!property) return [];
    const rows = [];
    if (property.type) rows.push({ icon: '🏢', label: 'Property Type', value: property.type });
    if (property.price) rows.push({ icon: '💰', label: 'Price', value: property.price });
    if (property.bhk) rows.push({ icon: '🛏️', label: 'Bedrooms', value: property.bhk });
    if (property.area) rows.push({ icon: '📐', label: 'Area', value: property.area });
    if (property.facing) rows.push({ icon: '🧭', label: 'Facing', value: property.facing });
    if (property.approval) rows.push({ icon: '✅', label: 'Approval', value: property.approval });
    if (property.status) rows.push({ icon: '📋', label: 'Status', value: property.status });
    if (property.category) rows.push({ icon: '📁', label: 'Category', value: property.category });
    return rows;
  };

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

  const featureChips = getFeatureChips();
  const infoRows = getInfoRows();
  const cleanDescription = stripHtmlForDescription(property.description);

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

            {/* Feature Chips */}
            {featureChips.length > 0 && (
              <div className='property-details__features-grid'>
                {featureChips.map((chip, idx) => (
                  <span key={idx} className='property-details__feature-chip'>
                    {chip.icon} {chip.label}
                  </span>
                ))}
              </div>
            )}

            {/* Structured Info Card */}
            {infoRows.length > 0 && (
              <div className='property-details__info-card'>
                {infoRows.map((row, idx) => (
                  <div key={idx} className='property-details__info-card-row'>
                    <span className='property-details__info-label'>
                      {row.icon} {row.label}
                    </span>
                    <span className='property-details__info-value'>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Property specs (kept for desktop view consistency) */}
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

            {/* Description - Clean text, no HTML */}
            <div className='property-details__description-section'>
              <h3 className='property-details__section-title'>About this Property</h3>
              <div className='property-details__description'>
                {cleanDescription.split('\n').map((line, idx) => (
                  line.trim() ? <p key={idx} style={{ marginBottom: '0.5em' }}>{line}</p> : <br key={idx} />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='property-details__actions'>
              <button
                className='property-details__action-btn property-details__action-btn--enquiry'
                onClick={() => setShowEnquiryModal(true)}
              >
                📩 Enquiry Now
              </button>
              <button
                className='property-details__action-btn property-details__action-btn--visit'
                onClick={() => setShowBookVisitModal(true)}
              >
                📅 Book a Site Visit
              </button>
              <button
                className='property-details__action-btn property-details__action-btn--share'
                onClick={handleShare}
              >
                ↪️ Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === Sticky Bottom Action Bar (mobile only) === */}
      <div className='property-details__sticky-bar'>
        <button className='property-details__sticky-btn property-details__sticky-btn--call' onClick={handleCall}>
          <span className='property-details__sticky-btn-icon'>📞</span>
          Call
        </button>
        <button className='property-details__sticky-btn property-details__sticky-btn--whatsapp' onClick={handleWhatsApp}>
          <span className='property-details__sticky-btn-icon'>💬</span>
          WhatsApp
        </button>
        <button className='property-details__sticky-btn property-details__sticky-btn--enquiry' onClick={() => setShowEnquiryModal(true)}>
          <span className='property-details__sticky-btn-icon'>📩</span>
          Enquiry
        </button>
        <button className='property-details__sticky-btn property-details__sticky-btn--visit' onClick={() => setShowBookVisitModal(true)}>
          <span className='property-details__sticky-btn-icon'>📅</span>
          Site Visit
        </button>
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
      {showShareModal && (
        <ShareModal 
          property={property} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </section>
  );
}

export default PropertyDetails;
