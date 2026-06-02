import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PropertyGrid from './components/PropertyGrid';
import Footer from './components/Footer';
import { PropertyProvider } from './context/PropertyContext';
import './index.css';

/**
 * App Component
 * Main application layout combining all sections wrapped in PropertyProvider
 */
function App() {
  return (
    <PropertyProvider>
      <div className='app'>
        <Header />
        <main>
          <HeroSection />
          <PropertyGrid />
        </main>
        <Footer />
      </div>
    </PropertyProvider>
  );
}

export default App;
