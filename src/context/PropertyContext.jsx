import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabaseIfEmpty } from '../utils/dbSeeder';
import {
  properties as fallbackProperties,
  filterConfig as fallbackFilterConfig,
  locations as fallbackLocations,
  priceRanges as fallbackPriceRanges,
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

  // Keep latest search criteria accessible inside listener callbacks
  const searchCriteriaRef = useRef({
    searchTerm: '',
    category: null,
    subFilter: null,
    nestedFilter: null,
    location: 'All Locations',
    minPrice: 0,
    maxPrice: Infinity,
  });
  const [searchCriteria, setSearchCriteriaState] = useState(searchCriteriaRef.current);

  const setSearchCriteria = (criteria) => {
    searchCriteriaRef.current = criteria;
    setSearchCriteriaState(criteria);
  };

  // Manual re-fetch (used for the refreshData context value)
  const setupListeners = () => {/* handled in useEffect */};

  useEffect(() => {
    let unsubProperties = null;
    let unsubLocations = null;
    let cancelled = false;

    const init = async () => {
      setLoading(true);

      try {
        // 1. Seed database if completely empty (no-op if already seeded)
        await seedDatabaseIfEmpty();

        // 2. Fetch static config (filterConfig tree + priceRanges) once
        const configDocRef = doc(db, 'config', 'filters');
        const configDocSnap = await getDoc(configDocRef);

        if (configDocSnap.exists()) {
          const configData = configDocSnap.data();
          if (!cancelled) {
            setFilterConfig(configData.filterConfig);
            setPriceRanges(configData.priceRanges);
          }
        } else {
          throw new Error("Configuration document 'config/filters' not found");
        }

        // 3. Real-time listener: properties collection
        const propertiesQuery = query(
          collection(db, 'properties'),
          orderBy('createdAt', 'desc')
        );
        unsubProperties = onSnapshot(
          propertiesQuery,
          (snapshot) => {
            if (cancelled) return;
            const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setProperties(list);
            setFilteredProperties(list);
            setLoading(false);
          },
          (err) => {
            if (cancelled) return;
            console.warn('Firestore properties listener error:', err);
            setError(err.message);
            setProperties(fallbackProperties);
            setFilteredProperties(fallbackProperties);
            setLoading(false);
          }
        );

        // 4. Real-time listener: locations collection
        unsubLocations = onSnapshot(
          collection(db, 'locations'),
          (snapshot) => {
            if (cancelled) return;
            const activeNames = snapshot.docs
              .map((d) => d.data())
              .filter((loc) => loc.status !== 'inactive' && loc.locationName)
              .map((loc) => loc.locationName);
            setLocations(['All Locations', ...activeNames]);
          },
          (err) => {
            if (cancelled) return;
            console.warn('Firestore locations listener error:', err);
            setLocations(fallbackLocations);
          }
        );

        if (!cancelled) setError(null);
      } catch (err) {
        if (cancelled) return;
        console.warn('Firestore init failed. Falling back to local data:', err);
        setError(err.message);
        setProperties(fallbackProperties);
        setFilteredProperties(fallbackProperties);
        setFilterConfig(fallbackFilterConfig);
        setLocations(fallbackLocations);
        setPriceRanges(fallbackPriceRanges);
        setLoading(false);
      }
    };

    init();

    // Cleanup: unsubscribe real-time listeners on unmount
    return () => {
      cancelled = true;
      if (unsubProperties) unsubProperties();
      if (unsubLocations) unsubLocations();
    };
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
      refreshData: () => {}, // no-op: real-time listeners keep data always current
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
