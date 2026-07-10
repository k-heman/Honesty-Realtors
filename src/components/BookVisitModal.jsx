import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Modal.css';

const WHATSAPP_NUMBER = '918523802251';

/**
 * BookVisitModal Component
 * Modal form for booking a site visit with fields:
 * Name, Email, Date, Time, Mobile Number, OTP (placeholder).
 * On submit, redirects to WhatsApp with property and visit details.
 */
function BookVisitModal({ property, onClose }) {
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved');
        }
      });
    }
  }, []);

  // Default date = tomorrow
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
    otp: '',
  });

  const [otpStep, setOtpStep] = useState(0); // 0: enter mobile, 1: enter otp, 2: verified
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setIsLoading(true);
    setOtpError('');
    
    const phoneNumber = `${formData.countryCode}${formData.mobile}`;

    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOtpStep(1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setOtpStep(0);
        setIsLoading(false);
        setOtpError('Failed to send OTP. Check number format or try again later.');
      });
  };

  const handleVerifyOtp = () => {
    if (!formData.otp || !window.confirmationResult) {
      setOtpError('Please enter OTP');
      return;
    }
    
    setIsLoading(true);
    setOtpError('');

    window.confirmationResult.confirm(formData.otp)
      .then((result) => {
        setOtpStep(2);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setOtpError('Invalid OTP. Please check and try again.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otpStep !== 2) {
      setOtpError('Please verify your mobile number with OTP first.');
      return;
    }

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
      `Hello...!\n I am ${formData.name}\n` +
      `*I want to book a site visit for this property:*\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `*Visit Details:*\n` +
      `Date: ${formattedDate}\n` +
      `Time: ${formattedTime}\n\n` +
      `My Mobile Number\n` +
      `${formData.countryCode} ${formData.mobile}`
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
                id='visit-mobile'
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
                required
              />
              <button 
                type='button' 
                className='modal__otp-btn'
                onClick={otpStep === 0 ? handleSendOtp : handleVerifyOtp}
                disabled={isLoading || otpStep === 2}
                style={otpStep === 2 ? { backgroundColor: '#4caf50', color: '#fff', border: 'none' } : {}}
              >
                {isLoading ? (otpStep === 0 ? 'Sending...' : 'Verifying...') : 
                 otpStep === 0 ? 'Send OTP' : 
                 otpStep === 1 ? 'Verify OTP' : 
                 '✅ Verified'}
              </button>
            </div>
            <div id='recaptcha-container'></div>
            {otpError && <span className='modal__field-hint' style={{ color: 'red' }}>{otpError}</span>}
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
