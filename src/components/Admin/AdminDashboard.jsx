import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DashboardStats from './AdminDashboard/DashboardStats';
import ActivityCard from './AdminDashboard/ActivityCard';
import QuickAccessPanel from './AdminDashboard/QuickAccessPanel';

// Memoized loading component
const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-1">Loading Dashboard</h3>
      <p className="text-slate-500 text-sm">Fetching the latest data...</p>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalContacts: 0,
    unreadContacts: 0,
    recentRequests: [],
    last24h: {
      users: 0,
      reports: 0,
      requests: 0,
      contacts: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Memoized API config
  const apiConfig = useMemo(() => {
    const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined,
    };
    return { baseURL, headers };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const { baseURL, headers } = apiConfig;
      const response = await axios.get(`${baseURL}/api/admin/dashboard`, { headers });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiConfig]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }), []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 h-full overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Last 24 Hours Activity Card */}
        <ActivityCard 
          dashboardData={dashboardData} 
          itemVariants={itemVariants}
        />

        {/* Main Stats Grid */}
        <DashboardStats 
          dashboardData={dashboardData}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />

        {/* Quick Access & Recent Activity */}
        <QuickAccessPanel 
          dashboardData={dashboardData}
          itemVariants={itemVariants}
        />
      </div>
    </div>
  );
};

export default React.memo(AdminDashboard);