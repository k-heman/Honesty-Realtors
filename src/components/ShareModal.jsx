import React from 'react';
import '../styles/Modal.css';

export default function ShareModal({ property, onClose }) {
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  const shareText = `Check out this amazing property: ${property.title} in ${property.location} - ${property.price}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      alert('Property link copied successfully.');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    onClose();
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + propertyUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(propertyUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`
  };

  return (
    <div className='modal-overlay' onClick={handleOverlayClick}>
      <div className='modal-content' style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>&times;</button>
        <h2 className='modal-title'>Share Property</h2>
        <p className='modal-subtitle' style={{ textAlign: 'center' }}>{property.title}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className='btn' style={{ background: '#25D366', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Share on WhatsApp
          </a>
          <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className='btn' style={{ background: '#1877F2', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Share on Facebook
          </a>
          <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className='btn' style={{ background: '#1DA1F2', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Share on Twitter/X
          </a>
          <a href={shareLinks.telegram} target="_blank" rel="noreferrer" className='btn' style={{ background: '#0088cc', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Share on Telegram
          </a>
          <button onClick={copyToClipboard} className='btn btn--outline' style={{ width: '100%' }}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
