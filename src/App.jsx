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
import AdminGrantAccess from './components/Admin/AdminGrantAccess'; // This now imports from index.jsx
import { TranslationProvider } from './contexts/TranslationContext';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsAndConditions from './components/Legal/TermsAndConditions';
import Dashboard from './components/Dashboard';
import PlanSelection from './components/PlanSelection'; // If you have this component

// Use environment variable for backend URL (standardize)
const envBase =
  import.meta.env.VITE_REACT_APP_API_BASE_URL // primary (used in other components)
  || import.meta.env.VITE_API_BASE_URL;       // legacy fallback

const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const defaultBase = isLocal ? 'http://localhost:5000' : 'https://techbe-zeta.vercel.app';

// Always resolve to a non-localhost base on production
axios.defaults.baseURL = envBase || defaultBase;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.withCredentials = true; // Uncomment only if you use cookies

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
              <Route path="/terms-and-conditions" element={
                <div className="min-h-screen bg-gray-50 py-12">
                  <div className="max-w-4xl mx-auto p-4">
                    <TermsAndConditions isOpen={true} onClose={() => window.history.back()} />
                  </div>
                </div>
              } />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/catalog" element={<Catalog />} />

              {/* User Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <UserProtectedRoute>
                    <Dashboard />
                  </UserProtectedRoute>
                }
              />

              {/* Plan Selection Page */}
              <Route
                path="/plans"
                element={
                  <UserProtectedRoute>
                    <PlanSelection />
                  </UserProtectedRoute>
                }
              />

              {/* Payment for Plan or Report */}
              <Route
                path="/payment/:type/:id"
                element={
                  <UserProtectedRoute>
                    <PaymentForm />
                  </UserProtectedRoute>
                }
              />

              {/* Payment for legacy route (single report) */}
              <Route 
                path="/payment/:reportId" 
                element={
                  <UserProtectedRoute>
                    <PaymentForm />
                  </UserProtectedRoute>
                } 
              />

              {/* PDF Viewer */}
              <Route
                path="/report/view/:id"
                element={
                  <UserProtectedRoute>
                    <PdfViewer />
                  </UserProtectedRoute>
                }
              />

              {/* Admin routes */}
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
                <Route path="contacts" element={<AdminContact />} />
                <Route path="users" element={<AdminUser />} />
                <Route path="grant-access" element={<AdminGrantAccess />} /> {/* New route for AdminGrantAccess */}
              </Route>
            </Routes>
          </div>
        </AnimatePresence>
      </>
    </TranslationProvider>
  );
}

export default App;
