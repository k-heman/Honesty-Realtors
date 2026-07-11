import { useState } from 'react';
import '../styles/Modal.css';

const WEBHOOK_URL =
  'https://workflow.ccbp.in/webhook-test/a7dd7e3a-8f7e-4af9-8913-10518c362f2f';
const WHATSAPP_NUMBER = '918523802251';

/**
 * BookVisitModal Component
 * Sends lead data to n8n webhook + WhatsApp message to admin.
 */
function BookVisitModal({ property, onClose }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    visitDate: defaultDate,
    visitTime: '10:00',
    countryCode: '+91',
    mobile: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts editing again
    if (statusMsg.text) setStatusMsg({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ text: '', type: '' });

    // Format date & time
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

    const payload = {
      formType: 'Site Visit',
      fullName: formData.name,
      email: formData.email,
      preferredDate: formattedDate,
      preferredTime: formattedTime,
      mobileNumber: `${formData.countryCode} ${formData.mobile}`,
      property: {
        title: property.title,
        location: property.location,
        price: property.price,
      },
    };

    // Fire WhatsApp message immediately (in parallel with webhook)
    const whatsappText = encodeURIComponent(
      `Hello...!\n I am ${formData.name}\n` +
      `*I want to book a site visit for this property:*\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `*Visit Details:*\n` +
      `Date: ${formattedDate}\n` +
      `Time: ${formattedTime}\n\n` +
      `*Email:* ${formData.email}\n` +
      `*Mobile:* ${formData.countryCode} ${formData.mobile}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`, '_blank');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'HonestyRealtorSecret2026!',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setStatusMsg({ text: 'Site visit submitted successfully!', type: 'success' });

      // Clear form & auto-close after a short delay
      setFormData({
        name: '',
        email: '',
        visitDate: defaultDate,
        visitTime: '10:00',
        countryCode: '+91',
        mobile: '',
      });
      setTimeout(() => onClose(), 2500);
    } catch (error) {
      console.error('Webhook fetch error:', error);

      if (error instanceof TypeError) {
        // CORS failure or network down
        setStatusMsg({
          text: 'Network error: Unable to reach the server. Please check your connection or try again later.',
          type: 'error',
        });
      } else {
        setStatusMsg({
          text: `Failed to send request (${error.message}). Please try again later.`,
          type: 'error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className='modal__field'>
            <label htmlFor='visit-mobile'>Mobile Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                style={{ width: '100px', cursor: 'pointer' }}
                disabled={isSubmitting}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                type='tel'
                id='visit-mobile'
                name='mobile'
                placeholder='10 digit number'
                value={formData.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) handleChange({ target: { name: 'mobile', value: val } });
                }}
                maxLength={10}
                required
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Inline status message */}
          {statusMsg.text && (
            <p
              className='modal__status-msg'
              style={{
                color: statusMsg.type === 'success' ? '#16a34a' : '#dc2626',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'center',
                margin: '4px 0 0',
                padding: '6px 0',
              }}
            >
              {statusMsg.type === 'success' ? '✅' : '❌'} {statusMsg.text}
            </p>
          )}

          <button
            type='submit'
            className='modal__submit modal__submit--visit'
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Sending...' : '📅 Confirm Site Visit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookVisitModal;
