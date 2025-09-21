import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Home from './Home/Hero';
import WhyChooseUs from './Home/WhyChooseUs';
import ExpertAnalysis from './Home/ExpertAnalysis';
import ReportDetails from './Home/ReportDetails';
import Pricing from './Home/Pricing';
import Footer from './Home/Footer';

export default function LandingPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Home />
      <WhyChooseUs />
      <ExpertAnalysis />
      <ReportDetails />
      <Pricing />
      <Footer />
      <div
        className={`fixed bottom-6 right-6 transition-opacity duration-300 ${
          showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="group relative p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Back to Top
          </span>
        </button>
      </div>
    </div>
  );
}