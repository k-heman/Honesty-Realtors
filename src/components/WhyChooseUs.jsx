import '../styles/HomeSections.css';

export default function WhyChooseUs() {
  return (
    <section className="home-sections__wrapper section-why-choose-us">
      <div className="home-sections__container">
        <h2 className="property-grid-section__heading">Why Choose Honesty Realtor</h2>
        <p className="property-grid-section__subheading">
          Helping families find verified properties with complete transparency and expert guidance.
        </p>
        
        <div className="why-choose-us__grid">
          <div className="why-choose-us__card">
             <div className="why-choose-us__icon">🛡️</div>
             <h3 className="why-choose-us__title">Verified Properties</h3>
             <p className="why-choose-us__text">Every listed property is verified before being published.</p>
          </div>
          <div className="why-choose-us__card">
             <div className="why-choose-us__icon">🤝</div>
             <h3 className="why-choose-us__title">Transparent Deals</h3>
             <p className="why-choose-us__text">No hidden charges or misleading information.</p>
          </div>
          <div className="why-choose-us__card">
             <div className="why-choose-us__icon">🚗</div>
             <h3 className="why-choose-us__title">Free Site Visits</h3>
             <p className="why-choose-us__text">Visit shortlisted properties with expert guidance.</p>
          </div>
          <div className="why-choose-us__card">
             <div className="why-choose-us__icon">🏦</div>
             <h3 className="why-choose-us__title">Home Loan Assistance</h3>
             <p className="why-choose-us__text">We help buyers throughout the loan approval process.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
