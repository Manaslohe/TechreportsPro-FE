import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ArrowRight, User, Calendar, 
  Clock, CheckCircle, BarChart2, TrendingUp, AlertTriangle, Activity,
  LayoutDashboard, PieChart, ChevronUp, Award
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
    last24h: {
      users: 0,
      reports: 0,
      requests: 0,
      contacts: 0
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
     

        {/* Last 24 Hours Activity Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-8 overflow-hidden"
        >
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <Activity size={22} className="text-white" />
              <h2 className="text-lg md:text-xl font-semibold text-white">Last 24 Hours Activity</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Users size={18} className="text-blue-100" />
                    <span className="text-xs text-blue-100 bg-blue-500/30 px-2 py-0.5 rounded-full">Users</span>
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-bold mb-1">{dashboardData.last24h?.users || 0}</p>
                  <p className="text-blue-100 text-xs">New registrations</p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <Users size={60} className="text-white" />
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <FileText size={18} className="text-indigo-100" />
                    <span className="text-xs text-indigo-100 bg-indigo-500/30 px-2 py-0.5 rounded-full">Reports</span>
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-bold mb-1">{dashboardData.last24h?.reports || 0}</p>
                  <p className="text-indigo-100 text-xs">New technical reports</p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <FileText size={60} className="text-white" />
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare size={18} className="text-purple-100" />
                    <span className="text-xs text-purple-100 bg-purple-500/30 px-2 py-0.5 rounded-full">Requests</span>
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-bold mb-1">{dashboardData.last24h?.requests || 0}</p>
                  <p className="text-purple-100 text-xs">New support requests</p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <MessageSquare size={60} className="text-white" />
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Mail size={18} className="text-cyan-100" />
                    <span className="text-xs text-cyan-100 bg-cyan-500/30 px-2 py-0.5 rounded-full">Contacts</span>
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-bold mb-1">{dashboardData.last24h?.contacts || 0}</p>
                  <p className="text-cyan-100 text-xs">New contact messages</p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-10">
                  <Mail size={60} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overall Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {/* Users Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-600">
                  <ChevronUp size={14} />
                  <span>{Math.round((dashboardData.last24h?.users / dashboardData.totalUsers) * 100 || 0)}%</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm mb-1">Total Users</h3>
              <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalUsers}</p>
              <p className="text-xs text-slate-500 mb-4">Platform registered users</p>
              <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Manage users
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-blue-600"></div>
          </motion.div>

          {/* Reports Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <FileText size={20} className="text-emerald-600" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-600">
                  <ChevronUp size={14} />
                  <span>{Math.round((dashboardData.last24h?.reports / dashboardData.totalReports) * 100 || 0)}%</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm mb-1">Total Reports</h3>
              <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalReports}</p>
              <p className="text-xs text-slate-500 mb-4">Technical reports generated</p>
              <Link to="/admin/reports" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                View reports
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-emerald-600"></div>
          </motion.div>

          {/* Support Requests Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <MessageSquare size={20} className="text-amber-600" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-600">
                  <ChevronUp size={14} />
                  <span>{Math.round((dashboardData.last24h?.requests / dashboardData.totalRequests) * 100 || 0)}%</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm mb-1">Support Requests</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-slate-800">{dashboardData.totalRequests}</p>
                {dashboardData.pendingRequests > 0 && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {dashboardData.pendingRequests} pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-4">Support requests received</p>
              <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors">
                Handle requests
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-amber-600"></div>
          </motion.div>

          {/* Contact Messages Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-100 rounded-lg">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-600">
                  <ChevronUp size={14} />
                  <span>{Math.round((dashboardData.last24h?.contacts / dashboardData.totalContacts) * 100 || 0)}%</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm mb-1">Contact Messages</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-slate-800">{dashboardData.totalContacts}</p>
                {dashboardData.unreadContacts > 0 && (
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                    {dashboardData.unreadContacts} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-4">Contact form submissions</p>
              <Link to="/admin/contacts" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors">
                Read messages
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="h-1 w-full bg-purple-600"></div>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Support Requests */}
          <motion.div 
            variants={itemVariants}
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
                      <h4 className="font-medium text-slate-800">{request.subject || "Support Request"}</h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={12} />
                      <span className="font-medium">{request.user?.firstName} {request.user?.lastName}</span>
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
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-slate-700" />
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
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <PieChart size={12} className="text-emerald-500" />
                        <span className="font-medium text-emerald-600">{report.views || 0} views</span>
                      </div>
                      {report.category && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{report.category}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Users Section */}
        <motion.div 
          variants={itemVariants}
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
                    key={user.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-medium text-slate-800 truncate">{user.firstName} {user.lastName}</h4>
                      <p className="text-xs text-slate-500 truncate">{user.email || "No email provided"}</p>
                    </div>
                    <span className="ml-auto text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
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