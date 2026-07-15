import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import { useSEO } from '../hooks/useSEO';
import '../styles/PropertyGrid.css';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Your Favorite Properties | Honesty Realtor',
    description: 'View your favorited properties in Hyderabad.',
    url: window.location.href,
  });

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div style={{ minHeight: '80vh', padding: 'var(--space-20) 0', background: 'var(--gradient-section)' }}>
      <div className='property-grid-section__container'>
        <h2 className='property-grid-section__heading'>Your Favorites</h2>
        <p className='property-grid-section__subheading'>
          Properties you have saved for later
        </p>

        {loading ? (
          <div className='property-grid-loading-message'>
            <div className='spinner'></div>
            <span>Loading...</span>
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className='property-grid-empty'>
            <div className='property-grid-empty__icon'>❤️</div>
            <h3 className='property-grid-empty__title'>No Favorite Properties Yet</h3>
            <p className='property-grid-empty__description'>
              You haven't added any properties to your favorites. Browse our collection and click the heart icon to save them here.
            </p>
            <button className='property-grid-empty__btn' onClick={() => navigate('/')}>
              Browse Properties
            </button>
          </div>
        ) : (
          <div className='property-grid'>
            {favoriteProperties.map((property) => (
              <div key={property.id} className='property-grid__item visible'>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
