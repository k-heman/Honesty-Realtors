import { useState } from 'react';
import '../styles/Modal.css';

const WHATSAPP_NUMBER = '918523802251';

/**
 * EnquiryModal Component
 * Modal form for property enquiry with fields:
 * Name, Email, Mobile Number, and message text box.
 * On submit, redirects to WhatsApp with property details and user info.
 */
function EnquiryModal({ property, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build WhatsApp message
    const text = encodeURIComponent(
      `🏠 *Property Enquiry*\n\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `I am ${formData.name}\n` +
      `*My Mobile:* ${formData.countryCode} ${formData.mobile}\n` +
      `*I have Enquiry on this property:*\n` +
      `*Message:*\n${formData.message || 'N/A'}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    onClose();
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className='modal-overlay' onClick={handleBackdropClick}>
      <div className='modal'>
        <button className='modal__close' onClick={onClose} aria-label='Close modal'>
          ✕
        </button>
        <div className='modal__header'>
          <span className='modal__header-icon'>📩</span>
          <h2 className='modal__title'>Enquiry Now</h2>
          <p className='modal__subtitle'>
            Interested in <strong>{property.title}</strong>? Fill in your details below.
          </p>
        </div>

        <form className='modal__form' onSubmit={handleSubmit}>
          <div className='modal__field'>
            <label htmlFor='enquiry-name'>Full Name</label>
            <input
              type='text'
              id='enquiry-name'
              name='name'
              placeholder='Enter your name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal__field'>
            <label htmlFor='enquiry-email'>Email Address</label>
            <input
              type='email'
              id='enquiry-email'
              name='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal__field'>
            <label htmlFor='enquiry-mobile'>Mobile Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                style={{ width: '100px', cursor: 'pointer' }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                type='tel'
                id='enquiry-mobile'
                name='mobile'
                placeholder='10 digit number'
                value={formData.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if(val.length <= 10) handleChange({ target: { name: 'mobile', value: val } });
                }}
                maxLength={10}
                required
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className='modal__field'>
            <label htmlFor='enquiry-message'>Your Enquiry</label>
            <textarea
              id='enquiry-message'
              name='message'
              placeholder='Tell us what you are looking for...'
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <button type='submit' className='modal__submit modal__submit--enquiry'>
            📩 Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}

export default EnquiryModal;
