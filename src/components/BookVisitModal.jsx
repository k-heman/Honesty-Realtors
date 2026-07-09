import { useState } from 'react';
import '../styles/Modal.css';

const WHATSAPP_NUMBER = '918523802251';

/**
 * BookVisitModal Component
 * Modal form for booking a site visit with fields:
 * Name, Email, Date, Time, Mobile Number, OTP (placeholder).
 * On submit, redirects to WhatsApp with property and visit details.
 */
function BookVisitModal({ property, onClose }) {
  // Default date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    visitDate: defaultDate,
    visitTime: '10:00',
    mobile: '',
    otp: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format date for display
    const dateObj = new Date(formData.visitDate + 'T' + formData.visitTime);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = dateObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Build WhatsApp message
    const text = encodeURIComponent(
      `📅 *Book a Site Visit*\n\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `*Visit Details:*\n` +
      `Date: ${formattedDate}\n` +
      `Time: ${formattedTime}\n\n` +
      `*Visitor Details:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Mobile: ${formData.mobile}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    onClose();
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className='modal-overlay' onClick={handleBackdropClick}>
      <div className='modal'>
        <button className='modal__close' onClick={onClose} aria-label='Close modal'>
          ✕
        </button>
        <div className='modal__header'>
          <span className='modal__header-icon'>📅</span>
          <h2 className='modal__title'>Book a Site Visit</h2>
          <p className='modal__subtitle'>
            Schedule a visit to <strong>{property.title}</strong>
          </p>
        </div>

        <form className='modal__form' onSubmit={handleSubmit}>
          <div className='modal__field'>
            <label htmlFor='visit-name'>Full Name</label>
            <input
              type='text'
              id='visit-name'
              name='name'
              placeholder='Enter your name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal__field'>
            <label htmlFor='visit-email'>Email Address</label>
            <input
              type='email'
              id='visit-email'
              name='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Site Visit Date & Time */}
          <div className='modal__field-group'>
            <div className='modal__field'>
              <label htmlFor='visit-date'>📆 Preferred Date</label>
              <input
                type='date'
                id='visit-date'
                name='visitDate'
                value={formData.visitDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>
            <div className='modal__field'>
              <label htmlFor='visit-time'>🕐 Preferred Time</label>
              <input
                type='time'
                id='visit-time'
                name='visitTime'
                value={formData.visitTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='modal__field'>
            <label htmlFor='visit-mobile'>Mobile Number</label>
            <input
              type='tel'
              id='visit-mobile'
              name='mobile'
              placeholder='+91 XXXXX XXXXX'
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal__field'>
            <label htmlFor='visit-otp'>OTP Verification</label>
            <div className='modal__otp-row'>
              <input
                type='text'
                id='visit-otp'
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

          <button type='submit' className='modal__submit modal__submit--visit'>
            📅 Confirm Site Visit
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookVisitModal;
