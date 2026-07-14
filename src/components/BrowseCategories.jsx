import { useProperties } from '../context/PropertyContext';
import '../styles/HomeSections.css';

const categoriesList = [
  { name: 'Flats', type: 'Flat', icon: '🏢' },
  { name: 'Independent Houses', type: 'Independent House', icon: '🏠' },
  { name: 'Villas', type: 'Villa', icon: '🏡' },
  { name: 'Plots', type: 'Plot', icon: '🌳' },
  { name: 'Agriculture Land', type: 'Farm House', icon: '🚜' }
];

export default function BrowseCategories() {
  const { properties, triggerSearch } = useProperties();

  const handleCategoryClick = (catName) => {
    triggerSearch({
      searchTerm: '',
      category: catName,
      subFilter: null,
      nestedFilter: null,
      location: 'All Locations',
      minPrice: 0,
      maxPrice: Infinity
    });
    const grid = document.getElementById('properties');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  const getPropCount = (type) => {
    return properties.filter(p => {
       const pType = (p.type || '').toLowerCase();
       const tType = type.toLowerCase();
       return pType === tType || pType === tType.replace(/s$/, '');
    }).length;
  };

  return (
    <section className="home-sections__wrapper section-browse-categories">
      <div className="home-sections__container">
        <h2 className="property-grid-section__heading">Browse by Property Category</h2>
        <p className="property-grid-section__subheading">
          Explore different property types across Hyderabad.
        </p>
        
        <div className="browse-categories__grid">
          {categoriesList.map(cat => {
            const count = getPropCount(cat.type);
            return (
               <div key={cat.name} className="browse-categories__card" onClick={() => handleCategoryClick(cat.name)}>
                  <div className="browse-categories__icon">{cat.icon}</div>
                  <h3 className="browse-categories__name">{cat.name}</h3>
                  <p className="browse-categories__count">{count} Properties</p>
               </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
