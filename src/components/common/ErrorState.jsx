// src/components/common/ErrorState.jsx
import React from 'react';

export default function ErrorState({ title, description, retryAction }) {
  return (
    <div className='error-state' style={{
      textAlign: 'center',
      padding: 'var(--space-10) var(--space-6)',
      background: 'rgba(239, 68, 68, 0.05)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-3)',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <div className='error-state__icon' style={{ fontSize: '2.5rem' }} aria-hidden="true">⚠️</div>
      <h3 className='error-state__title' style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-lg)',
        color: '#dc2626',
        fontWeight: 'bold',
        margin: 0
      }}>{title || 'Unable to load content'}</h3>
      <p className='error-state__description' style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        lineHeight: 'var(--lh-relaxed)'
      }}>
        {description || 'Please check your connection and try again.'}
      </p>
      {retryAction && (
        <button 
          onClick={retryAction}
          style={{
            marginTop: '10px',
            padding: 'var(--space-2) var(--space-5)',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'var(--fw-semibold)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          aria-label="Retry loading data"
        >
          ↻ Retry
        </button>
      )}
    </div>
  );
}
