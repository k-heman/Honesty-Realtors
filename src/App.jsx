import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PropertyGrid from './components/PropertyGrid';
import Footer from './components/Footer';
import './index.css';

/**
 * App Component
 * Main application layout combining all sections:
 * - Header (sticky navbar)
 * - HeroSection (hero banner with filter card)
 * - PropertyGrid (featured property listings)
 * - Footer (contact and links)
 */
function App() {
  return (
    <div className='app'>
      <Header />
      <main>
        <HeroSection />
        <PropertyGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
