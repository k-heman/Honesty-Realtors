import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Modal.css';

const WHATSAPP_NUMBER = '918523802251';

/**
 * EnquiryModal Component
 * Modal form for property enquiry with fields:
 * Name, Email, Mobile Number, OTP (placeholder), and message text box.
 * On submit, redirects to WhatsApp with property details and user info.
 */
function EnquiryModal({ property, onClose }) {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: '',
    message: '',
  });

  const [otpStep, setOtpStep] = useState(0); // 0: enter mobile, 1: enter otp, 2: verified
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setOtpError('Please enter a valid mobile number');
      return;
    }
    
    setIsLoading(true);
    setOtpError('');
    
    let phoneNumber = formData.mobile.trim();
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+91' + phoneNumber.replace(/\D/g, ''); 
    }

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

    // Build WhatsApp message
    const text = encodeURIComponent(
      `🏠 *Property Enquiry*\n\n` +
      `*Property:* ${property.title}\n` +
      `*Location:* ${property.location}\n` +
      `*Price:* ${property.price}\n\n` +
      `I am ${formData.name}\n` +
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
