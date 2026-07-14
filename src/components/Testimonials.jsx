import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Testimonials.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // Calculate if we've reached the end
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const cardWidth = scrollRef.current.firstChild.offsetWidth;
            const gap = 24; // var(--space-6) matches 24px usually
            scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
          }
        }
      }, 3500);
    }
    
    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  const handleManualNav = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth;
      const gap = 24;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -(cardWidth + gap) : (cardWidth + gap), behavior: 'smooth' });
    }
  };

  const getAvatarFallback = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 5;
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < r ? 'star filled' : 'star'}>★</span>
    ));
  };

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="testimonials__container">
          <h2 className="property-grid-section__heading">What Our Clients Say</h2>
          <div className="testimonials__carousel" style={{ marginTop: '40px' }}>
            <div className='property-card-skeleton' style={{ minWidth: '30%', height: '200px' }} />
            <div className='property-card-skeleton' style={{ minWidth: '30%', height: '200px' }} />
            <div className='property-card-skeleton' style={{ minWidth: '30%', height: '200px' }} />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section">
        <div className="testimonials__container" style={{ textAlign: 'center' }}>
          <h2 className="property-grid-section__heading">What Our Clients Say</h2>
          <p className="property-grid-section__subheading" style={{ marginBottom: 0 }}>
            Real experiences from families who found their dream property with Honesty Realtor.
          </p>
          <div style={{ padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '8px' }}>No Testimonials Yet</h3>
            <p>Customer reviews will appear here.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials__container">
        <h2 className="property-grid-section__heading">What Our Clients Say</h2>
        <p className="property-grid-section__subheading">
          Real experiences from families who found their dream property with Honesty Realtor.
        </p>

        <div className="testimonials__wrapper" 
             onMouseEnter={() => setIsHovered(true)} 
             onMouseLeave={() => setIsHovered(false)}
             onTouchStart={() => setIsHovered(true)}
             onTouchEnd={() => setIsHovered(false)}>
          
          <button className="testimonials__nav-btn left" onClick={() => handleManualNav('left')} aria-label="Previous">‹</button>
          
          <div className="testimonials__carousel" ref={scrollRef}>
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-card__header">
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.customerName} className="testimonial-card__avatar" />
                  ) : (
                    <div className="testimonial-card__avatar-fallback">
                      {getAvatarFallback(t.customerName)}
                    </div>
                  )}
                  <div className="testimonial-card__info">
                    <h3 className="testimonial-card__name">{t.customerName || 'Anonymous'}</h3>
                    <div className="testimonial-card__stars">{renderStars(t.rating)}</div>
                  </div>
                </div>
                <p className="testimonial-card__review">"{t.review}"</p>
              </div>
            ))}
          </div>

          <button className="testimonials__nav-btn right" onClick={() => handleManualNav('right')} aria-label="Next">›</button>
        </div>
      </div>
    </section>
  );
}
