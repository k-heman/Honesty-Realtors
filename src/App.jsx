import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FinalCTA from './components/FinalCTA';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTop from './components/common/ScrollToTop';
import { PropertyProvider } from './context/PropertyContext';
import { SettingsProvider } from './context/SettingsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import FloatingCompareButton from './components/FloatingCompareButton';
import './index.css';

// Lazy loaded routes mapping to reduce main bundle size initially
const HomePage = lazy(() => import('./pages/HomePage'));
const PropertyDetails = lazy(() => import('./components/PropertyDetails'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Global suspense fallback maintaining UX perfectly matched to the property skeletons
const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <div className='spinner'></div>
    <span style={{ color: 'var(--color-gold)', marginTop: '20px', fontWeight: 'bold' }}>Loading page...</span>
  </div>
);

/**
 * App Component
 * Main application layout with routing, wrapped in contexts.
 */
function App() {
  return (
    <SettingsProvider>
      <PropertyProvider>
        <FavoritesProvider>
          <CompareProvider>
            <div className='app'>
              <ScrollToTop />
              <Header />
              <main>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/property/:id' element={<PropertyDetails />} />
                    <Route path='/favorites' element={<FavoritesPage />} />
                    <Route path='/compare' element={<ComparePage />} />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <FinalCTA />
              <FloatingWhatsApp />
              <FloatingCompareButton />
              <ScrollToTopButton />
              <Footer />
            </div>
          </CompareProvider>
        </FavoritesProvider>
      </PropertyProvider>
    </SettingsProvider>
  );
}

export default App;
