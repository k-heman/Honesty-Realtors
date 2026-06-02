import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabaseIfEmpty } from '../utils/dbSeeder';
import { 
  properties as fallbackProperties, 
  filterConfig as fallbackFilterConfig, 
  locations as fallbackLocations, 
  priceRanges as fallbackPriceRanges 
} from '../data/properties';

// Create the Context
const PropertyContext = createContext();

// Category to property type map helper
const categoryToTypeMap = {
  "Flats": "Flat",
  "Independent Houses": "Independent House",
  "Villas": "Villa",
  "Agriculture Land": "Farm House",
  "Plots": "Plot"
};

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filterConfig, setFilterConfig] = useState(null);
  const [locations, setLocations] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter state
  const [searchCriteria, setSearchCriteria] = useState({
    searchTerm: '',
    category: null,
    subFilter: null,
    nestedFilter: null,
    location: 'All Locations',
    minPrice: 0,
    maxPrice: Infinity
  });

  // Fetch data from Firestore
  const fetchFirebaseData = async () => {
    setLoading(true);
    try {
      // 1. Try to seed database if empty
      await seedDatabaseIfEmpty();

      // 2. Fetch properties
      const propertiesColRef = collection(db, 'properties');
      const propertiesSnapshot = await getDocs(propertiesColRef);
      const propertiesList = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 3. Fetch configuration
      const configDocRef = doc(db, 'config', 'filters');
      const configDocSnap = await getDoc(configDocRef);
      
      if (configDocSnap.exists()) {
        const configData = configDocSnap.data();
        setFilterConfig(configData.filterConfig);
        setLocations(configData.locations);
        setPriceRanges(configData.priceRanges);
      } else {
        throw new Error("Configuration document 'config/filters' not found");
      }

      setProperties(propertiesList);
      setFilteredProperties(propertiesList);
      setError(null);
    } catch (err) {
      console.warn("Firestore fetch failed. Falling back to local data source:", err);
      setError(err.message);
      
      // Fallback to static local data
      setProperties(fallbackProperties);
      setFilteredProperties(fallbackProperties);
      setFilterConfig(fallbackFilterConfig);
      setLocations(fallbackLocations);
      setPriceRanges(fallbackPriceRanges);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  // Filter application function
  const executeFilterSearch = (criteria) => {
    if (properties.length === 0) return;

    const results = properties.filter((prop) => {
      // 0. Search Term Filter
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase().trim();
        const titleMatch = (prop.title || '').toLowerCase().includes(term);
        const locationMatch = (prop.location || '').toLowerCase().includes(term);
        const typeMatch = (prop.type || '').toLowerCase().includes(term);
        const bhkMatch = (prop.bhk || '').toLowerCase().includes(term);
        const priceMatch = (prop.price || '').toLowerCase().includes(term);
        const descMatch = (prop.description || '').toLowerCase().includes(term);
        
        // Loose match for categories like "villa", "flats", "independent houses"
        const categoryMatch = 
          (term.includes('flat') && (prop.type || '').toLowerCase() === 'flat') ||
          (term.includes('villa') && (prop.type || '').toLowerCase() === 'villa') ||
          (term.includes('house') && (prop.type || '').toLowerCase() === 'independent house') ||
          (term.includes('farm') && (prop.type || '').toLowerCase() === 'farm house');

        if (!titleMatch && !locationMatch && !typeMatch && !bhkMatch && !priceMatch && !descMatch && !categoryMatch) {
          return false;
        }
      }

      // 1. Category Filter
      if (criteria.category) {
        const type = categoryToTypeMap[criteria.category] || criteria.category;
        const propTypeLower = (prop.type || '').toLowerCase();
        const typeLower = type.toLowerCase();
        
        const matchesCategory = 
          propTypeLower === typeLower ||
          propTypeLower === typeLower.replace(/s$/, '') ||
          (typeLower === 'agriculture land' && propTypeLower === 'farm house');
        
        if (!matchesCategory) return false;
      }

      // 2. Sub Filter (e.g. BHK or acreage)
      if (criteria.subFilter) {
        if (criteria.subFilter.includes('BHK')) {
          if (prop.bhk !== criteria.subFilter) return false;
        } else if (criteria.subFilter.includes('Acres')) {
          const descLower = (prop.description || '').toLowerCase();
          const areaLower = (prop.area || '').toLowerCase();
          const hasAcre = descLower.includes('acre') || areaLower.includes('acre');
          
          if (criteria.subFilter === '1-2 Acres' && !hasAcre && prop.type === 'Farm House') {
            // Keep the default farmhouse matching for demo
          } else if (!hasAcre && !areaLower.includes('5,000')) {
            return false;
          }
        } else {
          // Custom tag e.g. Duplex, Triplex
          const descLower = (prop.description || '').toLowerCase();
          const titleLower = (prop.title || '').toLowerCase();
          if (!descLower.includes(criteria.subFilter.toLowerCase()) && !titleLower.includes(criteria.subFilter.toLowerCase())) {
            return false;
          }
        }
      }

      // 3. Nested Filter
      if (criteria.nestedFilter) {
        if (criteria.nestedFilter === 'New Flats') {
          if (!prop.isNew) return false;
        } else if (criteria.nestedFilter === 'Resale Flats (With Furniture)') {
          if (prop.isNew) return false;
        }
      }

      // 4. Location Filter
      if (criteria.location && criteria.location !== 'All Locations') {
        if (prop.location.toLowerCase() !== criteria.location.toLowerCase()) return false;
      }

      // 5. Budget Filter (Manual price range)
      const minBound = criteria.minPrice !== undefined ? criteria.minPrice : 0;
      const maxBound = criteria.maxPrice !== undefined ? criteria.maxPrice : Infinity;
      const val = prop.priceValue;
      if (val < minBound || val > maxBound) return false;

      return true;
    });

    setFilteredProperties(results);
  };

  // Trigger search with current or new criteria
  const triggerSearch = (criteria = searchCriteria) => {
    setSearchCriteria(criteria);
    executeFilterSearch(criteria);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultCriteria = {
      searchTerm: '',
      category: null,
      subFilter: null,
      nestedFilter: null,
      location: 'All Locations',
      minPrice: 0,
      maxPrice: Infinity
    };
    setSearchCriteria(defaultCriteria);
    setFilteredProperties(properties);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      filteredProperties,
      filterConfig,
      locations,
      priceRanges,
      loading,
      error,
      searchCriteria,
      setSearchCriteria,
      triggerSearch,
      resetFilters,
      refreshData: fetchFirebaseData
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
