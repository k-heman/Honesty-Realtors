import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className, onClick, style }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.05, rootMargin: '100px' }); // Pre-load slightly before scrolling into view

    if (imgRef.current) observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, []);

  const baseStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-navy-light)',
    ...style
  };

  const imgStyle = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.8s ease-out, filter 0.8s ease-out',
    opacity: isLoaded ? 1 : 0,
    filter: isLoaded ? 'blur(0)' : 'blur(15px)',
  };

  return (
    <div ref={imgRef} className={className} style={baseStyle} onClick={onClick}>
      {/* CSS Shimmer for loading state */}
      {!isLoaded && !error && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          animation: 'shimmer 1.5s infinite',
        }} />
      )}

      {/* Actual Image Lazy Loaded */}
      {inView && !error && (
        <img
          src={src} // Will support WebP naturally if URL provides it
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setIsLoaded(true);
          }}
          style={imgStyle}
        />
      )}
      
      {/* Empty State Premium Placeholder */}
      {error && (
         <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           color: 'var(--color-text-secondary)',
           gap: '8px'
         }}>
           <span style={{ fontSize: '2.5rem', opacity: 0.8 }}>📷</span>
           <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>No Image Available</span>
         </div>
      )}
    </div>
  );
}
