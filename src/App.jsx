import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PropertyGrid from './components/PropertyGrid';
import PropertyDetails from './components/PropertyDetails';
import Footer from './components/Footer';
import { PropertyProvider } from './context/PropertyContext';
import './index.css';

/**
 * HomePage Component
 * Landing page layout with hero and property grid
 */
function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertyGrid />
    </>
  );
}

/**
 * App Component
 * Main application layout with routing, wrapped in PropertyProvider
 */
function App() {
  return (
    <PropertyProvider>
      <div className='app'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/property/:id' element={<PropertyDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PropertyProvider>
  );
}

export default App;
