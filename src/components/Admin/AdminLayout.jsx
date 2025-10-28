import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin');
    }
    // Close sidebar on route change
    setSidebarOpen(false);
  }, [navigate, location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return { title: 'Admin Dashboard', subtitle: 'Monitor platform activity and key metrics' };
      case '/admin/users':
        return { title: 'User Management', subtitle: 'Manage and view user information' };
      case '/admin/reports':
        return { title: 'Reports', subtitle: 'View and manage technical reports' };
      case '/admin/requests':
        return { title: 'Payment Requests', subtitle: 'Review and manage payment verifications' };
      case '/admin/contacts':
        return { title: 'Contact Messages', subtitle: 'View and respond to user messages' };
      default:
        return { title: 'Admin Panel', subtitle: 'Manage the platform' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <AdminSidebar isOpen={false} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area - adjusted for desktop sidebar */}
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
