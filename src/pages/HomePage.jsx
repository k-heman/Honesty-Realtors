import HeroSection from '../components/HeroSection';
import PropertyGrid from '../components/PropertyGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import BrowseCategories from '../components/BrowseCategories';
import FeaturedLocalities from '../components/FeaturedLocalities';
import Testimonials from '../components/Testimonials';
import { useSEO } from '../hooks/useSEO';

export default function HomePage() {
  useSEO({
    title: 'Honesty Realtor | Trusted Real Estate in Hyderabad',
    description: 'Find verified properties including flats, villas, plots and independent houses in Hyderabad.',
    url: window.location.origin,
    schema: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Honesty Realtor",
      "image": `${window.location.origin}/images/honestylogo.jpeg`,
      "url": window.location.origin,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    }
  });

  return (
    <>
      <HeroSection />
      <PropertyGrid />
      <WhyChooseUs />
      <BrowseCategories />
      <FeaturedLocalities />
      <Testimonials />
    </>
  );
}
