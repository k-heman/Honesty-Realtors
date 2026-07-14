// src/components/common/EmptyState.jsx
import React from 'react';

export default function EmptyState({ icon, title, description, actionText, onAction }) {
  return (
    <div className='empty-state' style={{
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6)',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px dashed rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-4)',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <div className='empty-state__icon' style={{ fontSize: '3rem' }} aria-hidden="true">{icon || '🔍'}</div>
      <h3 className='empty-state__title' style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        color: 'var(--color-navy)',
        marginTop: 'var(--space-2)'
      }}>{title}</h3>
      {description && (
        <p className='empty-state__description' style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--lh-relaxed)',
          marginBottom: 'var(--space-2)'
        }}>
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button 
          className='empty-state__btn' 
          onClick={onAction}
          style={{
            padding: 'var(--space-2) var(--space-6)',
            background: 'transparent',
            color: 'var(--color-gold)',
            border: '1.5px solid var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'var(--fw-semibold)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'all var(--transition-base)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--color-gold)';
            e.currentTarget.style.color = 'var(--color-navy)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 169, 81, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-gold)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
