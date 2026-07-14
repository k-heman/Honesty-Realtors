import { useProperties } from '../context/PropertyContext';
import '../styles/HomeSections.css';

const localitiesList = [
  { name: 'Tellapur', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80' },
  { name: 'Kokapet', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80' },
  { name: 'Narsingi', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&q=80' },
  { name: 'Financial District', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80' },
  { name: 'Pragathi Nagar', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80' },
  { name: 'Kompally', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80' }
];

export default function FeaturedLocalities() {
  const { properties, triggerSearch } = useProperties();

  const handleLocalityClick = (locName) => {
    triggerSearch({
      searchTerm: '',
      category: null,
      subFilter: null,
      nestedFilter: null,
      location: locName,
      minPrice: 0,
      maxPrice: Infinity
    });
    const grid = document.getElementById('properties');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  const getPropCount = (loc) => {
    return properties.filter((p) => p.location?.toLowerCase() === loc.toLowerCase()).length;
  };

  return (
    <section className="home-sections__wrapper section-featured-localities">
      <div className="home-sections__container">
        <h2 className="property-grid-section__heading">Explore Popular Localities</h2>
        <p className="property-grid-section__subheading">
          Discover premium properties across Hyderabad's fastest growing locations.
        </p>
        
        <div className="featured-localities__grid">
          {localitiesList.map(loc => {
             const count = getPropCount(loc.name);
             return (
               <div key={loc.name} className="featured-localities__card" onClick={() => handleLocalityClick(loc.name)}>
                  <img src={loc.image} alt={loc.name} className="featured-localities__img" />
                  <div className="featured-localities__overlay"></div>
                  <div className="featured-localities__content">
                     <h3 className="featured-localities__name">{loc.name}</h3>
                     <span className="featured-localities__count">{count} Properties</span>
                  </div>
               </div>
             )
          })}
        </div>
      </div>
    </section>
  );
}
