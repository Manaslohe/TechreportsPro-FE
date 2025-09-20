import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Contact from './components/Contact/Contact';
import Header from './components/Home/Header';
import SignupForm from './components/SignupForm';
import SignInForm from './components/SignInForm';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLayout from './components/Admin/AdminLayout';
import AdminReport from './components/Admin/AdminReport';
import Catalog from './components/Catalog/Catalog';
import PaymentForm from './components/PaymentForm'; // Import the PaymentForm component
import PdfViewer from './components/Report/PdfViewer';
import './App.css';
import axios from 'axios';
import AdminRequest from './components/Admin/AdminRequest';
import AdminContact from './components/Admin/AdminContact';
import AdminUser from './components/Admin/AdminUser';
import { TranslationProvider } from './contexts/TranslationContext';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';

axios.defaults.baseURL = 'https://techbe-zeta.vercel.app'; // Update with your backend URL
axios.defaults.headers.post['Content-Type'] = 'application/json';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const UserProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Changed from 'userAuth' to 'authToken'
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const AdminLoginRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : children;
};

function App() {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Ignore routes starting with "/uploads"
  if (location.pathname.startsWith('/uploads')) {
    window.location.href = `http://localhost:5000${location.pathname}`;
    return null;
  }

  return (
    <TranslationProvider>
      <>
        <ScrollToTop />
        {!isAdminRoute && <Header handleNavigation={handleNavigation} />}
        <AnimatePresence mode="wait">
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route
                path="/admin/login"
                element={
                  <AdminLoginRoute>
                    <AdminLogin />
                  </AdminLoginRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="reports" element={<AdminReport />} />
                <Route path="requests" element={<AdminRequest />} />
                <Route path="contacts" element={<AdminContact />} /> {/* New route */}
                <Route path="users" element={<AdminUser />} /> {/* New route for AdminUser */}
              </Route>
              <Route 
                path="/payment/:reportId" 
                element={
                  <UserProtectedRoute>
                    <PaymentForm />
                  </UserProtectedRoute>
                } 
              />
              <Route
                path="/report/view/:reportId"
                element={
                  <UserProtectedRoute>
                    <PdfViewer />
                  </UserProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AnimatePresence>
      </>
    </TranslationProvider>
  );
}

export default App;
