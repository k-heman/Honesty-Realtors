import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  const navigate = useNavigate();

  useSEO({
    title: 'Page Not Found | Honesty Realtor',
    description: 'The page you are looking for does not exist.',
    url: window.location.href,
  });

  return (
    <section style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-4)',
      background: 'var(--color-light-gray)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }} aria-hidden="true">🏠</div>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-5xl)',
        color: 'var(--color-navy)',
        marginBottom: 'var(--space-2)'
      }}>Oops!</h1>
      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-8)'
      }}>
        This property or page doesn't exist.
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: 'var(--color-white)',
            color: 'var(--color-navy)',
            border: '2px solid var(--color-navy)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--fw-bold)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label="Navigate back to home"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Back Home
        </button>
        <button 
          onClick={() => { navigate('/'); setTimeout(() => window.scrollTo({top: 500, behavior:'smooth'}), 100); }}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: 'var(--gradient-gold)',
            color: 'var(--color-navy)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--fw-bold)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label="Browse all properties"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(200,169,81,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Browse Properties
        </button>
      </div>
    </section>
  );
}
