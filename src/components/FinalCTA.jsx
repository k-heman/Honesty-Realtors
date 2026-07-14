import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import BookVisitModal from './BookVisitModal';
import '../styles/FinalCTA.css';

export default function FinalCTA() {
  const { settings } = useSettings();
  const [showModal, setShowModal] = useState(false);

  // A generic property placeholder for general enquiries
  const generalProperty = {
    title: 'General Property Enquiry',
    location: 'Hyderabad',
    price: 'TBD'
  };

  return (
    <section className="final-cta">
      <div className="final-cta__container">
        <h2 className="final-cta__heading">Still Looking for Your Dream Property?</h2>
        <p className="final-cta__subheading">
          Our property experts are ready to help you find the perfect property in Hyderabad.
        </p>

        <div className="final-cta__actions">
          <a href={`tel:${settings?.phone || '+918523802251'}`} className="final-cta__btn">
            📞 Call Now
          </a>
          <a 
            href={`https://wa.me/${settings?.whatsapp || '918523802251'}?text=Hello%20Honesty%20Realtor%2C%0AI%20am%20looking%20for%20a%20property%20in%20Hyderabad.`} 
            target="_blank" 
            rel="noreferrer" 
            className="final-cta__btn final-cta__btn--whatsapp"
          >
            💬 WhatsApp
          </a>
          <button className="final-cta__btn final-cta__btn--gold" onClick={() => setShowModal(true)}>
            📅 Book Site Visit
          </button>
        </div>
      </div>
      
      {showModal && (
        <BookVisitModal 
          property={generalProperty} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </section>
  );
}
