import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ArrowRight, User, Calendar, 
  Clock, CheckCircle, BarChart2, TrendingUp, AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalContacts: 0,
    unreadContacts: 0,
    recentUsers: [],
    recentRequests: [],
    popularReports: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined,
        },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock size={10} />
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle size={10} />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">Loading Dashboard</h3>
          <p className="text-slate-500">Fetching the latest data for you...</p>
        </div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
      

        {/* Summary Stats Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-8 p-5 md:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 size={22} className="text-white" />
            <h2 className="text-lg md:text-xl font-semibold text-white">Platform Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div key="users-stat" className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Total Users</p>
              <p className="text-white text-2xl font-bold">{dashboardData.totalUsers}</p>
            </div>
            <div key="reports-stat" className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Total Reports</p>
              <p className="text-white text-2xl font-bold">{dashboardData.totalReports}</p>
            </div>
            <div key="requests-stat" className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Support Requests</p>
              <div className="flex items-center gap-2">
                <p className="text-white text-2xl font-bold">{dashboardData.totalRequests}</p>
                {dashboardData.pendingRequests > 0 && (
                  <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                    {dashboardData.pendingRequests} pending
                  </span>
                )}
              </div>
            </div>
            <div key="contacts-stat" className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Contact Messages</p>
              <div className="flex items-center gap-2">
                <p className="text-white text-2xl font-bold">{dashboardData.totalContacts}</p>
                {dashboardData.unreadContacts > 0 && (
                  <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                    {dashboardData.unreadContacts} unread
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Users Card */}
          <motion.div 
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <h3 className="text-slate-700 font-medium">Users</h3>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalUsers}</p>
              <p className="text-sm text-slate-500 mb-4">Registered platform users</p>
              <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Manage users
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-blue-600"></div>
          </motion.div>

          {/* Reports Card */}
          <motion.div 
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <FileText size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-slate-700 font-medium">Reports</h3>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalReports}</p>
              <p className="text-sm text-slate-500 mb-4">Technical reports generated</p>
              <Link to="/admin/reports" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                View reports
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-emerald-600"></div>
          </motion.div>

          {/* Support Requests Card */}
          <motion.div 
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <MessageSquare size={20} className="text-amber-600" />
                </div>
                <h3 className="text-slate-700 font-medium">Support</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-slate-800">{dashboardData.totalRequests}</p>
                {dashboardData.pendingRequests > 0 && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {dashboardData.pendingRequests} pending
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4">Support requests received</p>
              <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors">
                Handle requests
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-amber-600"></div>
          </motion.div>

          {/* Contact Messages Card */}
          <motion.div 
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-purple-100 rounded-lg">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <h3 className="text-slate-700 font-medium">Messages</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-slate-800">{dashboardData.totalContacts}</p>
                {dashboardData.unreadContacts > 0 && (
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                    {dashboardData.unreadContacts} unread
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4">Contact form submissions</p>
              <Link to="/admin/contacts" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors">
                Read messages
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-purple-600"></div>
          </motion.div>
        </div>

        {/* Main Content Area - Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Support Requests */}
          <motion.div 
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-800">Recent Support Requests</h3>
              </div>
              <Link to="/admin/requests" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboardData.recentRequests.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                    <MessageSquare className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500">No recent support requests</p>
                </div>
              ) : (
                dashboardData.recentRequests.map((request, index) => (
                  <motion.div 
                    key={request.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-800">{request.subject}</h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={12} />
                      <span className="font-medium">{request.userName}</span>
                      <span className="text-slate-300">•</span>
                      <Calendar size={12} />
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Popular Reports Section */}
          <motion.div 
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-800">Popular Reports</h3>
              </div>
              <Link to="/admin/reports" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboardData.popularReports.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                    <FileText className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500">No popular reports available</p>
                </div>
              ) : (
                dashboardData.popularReports.map((report, index) => (
                  <motion.div 
                    key={report.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-medium text-slate-800 mb-1">{report.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="font-medium text-emerald-600">{report.views} views</span>
                      <span className="text-slate-300">•</span>
                      <span>{report.category}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Users Section */}
        <motion.div 
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-slate-700" />
              <h3 className="font-semibold text-slate-800">Recently Joined Users</h3>
            </div>
            <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all users</Link>
          </div>
          <div className="p-5">
            {dashboardData.recentUsers.length === 0 ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                  <User className="text-slate-400" size={24} />
                </div>
                <p className="text-slate-500">No recent users</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentUsers.map((user, index) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-medium text-slate-800 truncate">{user.name || "Unknown User"}</h4>
                      <p className="text-xs text-slate-500 truncate">{user.email || "No email provided"}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;