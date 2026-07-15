import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useProperties } from '../context/PropertyContext';
import { useSEO } from '../hooks/useSEO';
import LazyImage from '../components/LazyImage';
import '../styles/ComparePage.css';
import { stripHtml } from '../utils/stripHtml';

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSEO({
    title: 'Compare Properties | Honesty Realtor',
    description: 'Compare selected properties side-by-side.',
    url: window.location.href,
  });

  const compareProperties = properties.filter((p) => compareList.includes(p.id));

  if (loading) {
    return (
      <div className="compare-page__loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (compareProperties.length < 2) {
    return (
      <div className="compare-page__empty">
        <span className="compare-page__empty-icon">⚖️</span>
        <h2>Select properties to compare</h2>
        <p>Please select at least 2 properties to see a comparison.</p>
        <button onClick={() => navigate('/')} className="compare-page__btn">
          Browse Properties
        </button>
      </div>
    );
  }

  const renderRow = (label, key, renderFn = (val) => val || '-') => {
    // Check if values differ across properties
    const values = compareProperties.map(p => p[key]);
    const allSame = values.every(val => val === values[0]);
    
    return (
      <tr key={key} className={!allSame ? 'compare-table__row--diff' : ''}>
        <td className="compare-table__label">
          {label} {!allSame && <span title="Difference detected" style={{color: 'var(--color-gold)'}}>•</span>}
        </td>
        {compareProperties.map((p) => (
          <td key={`${p.id}-${key}`} className={`compare-table__value ${!allSame ? 'highlight-diff' : ''}`}>
            {renderFn(p[key], p)}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="compare-page">
      <div className="compare-page__container">
        <h1 className="compare-page__title">Compare Properties</h1>
        
        <div className="compare-page__table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-table__label compare-table__label--header">Features</th>
                {compareProperties.map((p) => (
                  <th key={p.id} className="compare-table__property-header">
                    <button 
                      className="compare-table__remove-btn" 
                      onClick={() => removeFromCompare(p.id)}
                      title="Remove from comparison"
                    >
                      ✕
                    </button>
                    <div className="compare-table__img-container">
                      <LazyImage src={p.image} alt={p.title} className="compare-table__img" />
                    </div>
                    <h3 className="compare-table__prop-title">{p.title}</h3>
                    <div className="compare-table__prop-price">{p.price}</div>
                    <button 
                      className="compare-page__btn compare-page__btn--small"
                      onClick={() => navigate(`/property/${p.id}`)}
                    >
                      View Details
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow('Location', 'location')}
              {renderRow('Type', 'type')}
              {renderRow('Category', 'category')}
              {renderRow('Area', 'area')}
              {renderRow('Bedrooms', 'bhk')}
              {renderRow('Facing', 'facing')}
              {renderRow('Status', 'status')}
              {renderRow('Approval', 'approval')}
              {renderRow('Amenities', 'amenities', (val) => {
                if (!val) return '-';
                const arr = Array.isArray(val) ? val : val.split(',');
                return (
                  <ul className="compare-table__list">
                    {arr.map((a, i) => a.trim() && <li key={i}>{a.trim()}</li>)}
                  </ul>
                );
              })}
              {renderRow('Video Available', 'youtubeLink', (val) => val ? '✅ Yes' : '❌ No')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
