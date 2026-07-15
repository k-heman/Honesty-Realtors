import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try {
      const stored = localStorage.getItem('honesty_realtor_compare');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error reading compare list from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('honesty_realtor_compare', JSON.stringify(compareList));
    } catch (error) {
      console.warn('Error saving compare list to localStorage:', error);
    }
  }, [compareList]);

  const toggleCompare = (propertyId) => {
    setCompareList((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      if (prev.length >= MAX_COMPARE) {
        alert('You can compare up to 3 properties maximum.');
        return prev;
      }
      return [...prev, propertyId];
    });
  };

  const removeFromCompare = (propertyId) => {
    setCompareList((prev) => prev.filter(id => id !== propertyId));
  };

  const isComparing = (propertyId) => compareList.includes(propertyId);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, removeFromCompare, isComparing, MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
