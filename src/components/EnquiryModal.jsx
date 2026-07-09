import { useState } from 'react';
import '../styles/Modal.css';

const WHATSAPP_NUMBER = '918523802251';

/**
 * EnquiryModal Component
 * Modal form for property enquiry with fields:
 * Name, Email, Mobile Number, OTP (placeholder), and message text box.
 * On submit, redirects to WhatsApp with property details and user info.
 */
function EnquiryModal({ property, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: '',
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
      `*Enquirer Details:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Mobile: ${formData.mobile}\n\n` +
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
            <input
              type='tel'
              id='enquiry-mobile'
              name='mobile'
              placeholder='+91 XXXXX XXXXX'
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal__field'>
            <label htmlFor='enquiry-otp'>OTP Verification</label>
            <div className='modal__otp-row'>
              <input
                type='text'
                id='enquiry-otp'
                name='otp'
                placeholder='Enter OTP'
                value={formData.otp}
                onChange={handleChange}
                maxLength='6'
                className='modal__otp-input'
              />
              <button type='button' className='modal__otp-btn' disabled>
                Send OTP
              </button>
            </div>
            <span className='modal__field-hint'>OTP verification coming soon</span>
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
