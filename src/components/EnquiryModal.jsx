import { useState } from 'react';
import '../styles/Modal.css';

const WEBHOOK_URL = '/api/webhook';
const WHATSAPP_NUMBER = '918523802251';

/**
 * EnquiryModal Component
 * Sends lead data to n8n webhook + WhatsApp message to admin.
 */
function EnquiryModal({ property, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (statusMsg.text) setStatusMsg({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ text: '', type: '' });

    const payload = {
      formType: 'General Enquiry',
      fullName: formData.name,
      email: formData.email,
      mobileNumber: `${formData.countryCode} ${formData.mobile}`,
      message: formData.message,
      property: {
        title: property.title,
        location: property.location,
        price: property.price,
      },
    };

    // Fire WhatsApp message immediately (in parallel with webhook)
    const whatsappText = encodeURIComponent(
      `🏠 *Property Enquiry*\n\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `I am ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Mobile:* ${formData.countryCode} ${formData.mobile}\n` +
      `*Enquiry:*\n${formData.message || 'N/A'}`
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

      setStatusMsg({ text: 'Enquiry submitted successfully!', type: 'success' });

      // Clear form & auto-close after a short delay
      setFormData({
        name: '',
        email: '',
        countryCode: '+91',
        mobile: '',
        message: '',
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                id='enquiry-mobile'
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
              disabled={isSubmitting}
            />
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
            className='modal__submit modal__submit--enquiry'
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Sending...' : '📩 Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EnquiryModal;
