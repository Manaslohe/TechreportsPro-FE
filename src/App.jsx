import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Contact from './components/Contact/Contact';
import Header from './components/Home/Header';
import SignupForm from './components/SignupForm';
import SignInForm from './components/SignInForm';
import './App.css';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <Router>
      <ScrollToTop />
      <Header handleNavigation={handleNavigation} />
      <AnimatePresence mode="wait">
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/signin" element={<SignInForm />} />
          </Routes>
        </div>
      </AnimatePresence>
    </Router>
  );
}

export default App;
