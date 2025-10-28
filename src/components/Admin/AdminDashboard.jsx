import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ArrowRight, 
  Clock, CheckCircle, XCircle, Activity, TrendingUp,
  ChevronUp, Zap, Target, AlertCircle
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
    recentRequests: [],
    last24h: {
      users: 0,
      reports: 0,
      requests: 0,
      contacts: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined,
        },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => [
    {
      id: 'users',
      label: 'Total Users',
      value: dashboardData.totalUsers,
      icon: Users,
      color: 'indigo',
      link: '/admin/users',
      change: dashboardData.last24h?.users || 0,
      gradient: 'from-indigo-600 to-indigo-400'
    },
    {
      id: 'reports',
      label: 'Total Reports',
      value: dashboardData.totalReports,
      icon: FileText,
      color: 'emerald',
      link: '/admin/reports',
      change: dashboardData.last24h?.reports || 0,
      gradient: 'from-emerald-600 to-emerald-400'
    },
    {
      id: 'requests',
      label: 'Support Requests',
      value: dashboardData.totalRequests,
      icon: MessageSquare,
      color: 'amber',
      link: '/admin/requests',
      badge: dashboardData.pendingRequests > 0 ? `${dashboardData.pendingRequests} pending` : null,
      change: dashboardData.last24h?.requests || 0,
      gradient: 'from-amber-600 to-amber-400'
    },
    {
      id: 'contacts',
      label: 'Contact Messages',
      value: dashboardData.totalContacts,
      icon: Mail,
      color: 'violet',
      link: '/admin/contacts',
      badge: dashboardData.unreadContacts > 0 ? `${dashboardData.unreadContacts} unread` : null,
      change: dashboardData.last24h?.contacts || 0,
      gradient: 'from-violet-600 to-violet-400'
    }
  ], [dashboardData]);

  const last24hStats = useMemo(() => [
    {
      label: 'New Users',
      value: dashboardData.last24h?.users || 0,
      icon: Users,
      color: 'indigo',
      trend: 'up'
    },
    {
      label: 'New Reports',
      value: dashboardData.last24h?.reports || 0,
      icon: FileText,
      color: 'emerald',
      trend: 'up'
    },
    {
      label: 'New Requests',
      value: dashboardData.last24h?.requests || 0,
      icon: MessageSquare,
      color: 'violet',
      trend: 'up'
    },
    {
      label: 'New Messages',
      value: dashboardData.last24h?.contacts || 0,
      icon: Mail,
      color: 'cyan',
      trend: 'up'
    }
  ], [dashboardData.last24h]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 h-full overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Last 24 Hours Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="group relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Last 24 Hours Activity</h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {last24hStats.map((stat, index) => (
                <Activity24Card key={stat.label} stat={stat} delay={0.15 + index * 0.05} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} variants={itemVariants} />
          ))}
        </motion.div>

        {/* Analytics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Requests */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Recent Support Requests</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Latest submissions from users</p>
                </div>
              </div>
              <Link to="/admin/requests" className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {dashboardData.recentRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent support requests</p>
                </div>
              ) : (
                dashboardData.recentRequests.slice(0, 5).map((request, index) => (
                  <RequestRowEnhanced key={request._id || index} request={request} index={index} />
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Access & Stats */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
          >
            {/* Quick Access Card */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900">Quick Access</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Navigate to key areas</p>
              </div>
              
              <div className="p-4 space-y-2">
                <QuickAccessLink icon={Users} label="Users" path="/admin/users" color="indigo" />
                <QuickAccessLink icon={FileText} label="Reports" path="/admin/reports" color="emerald" />
                <QuickAccessLink icon={MessageSquare} label="Requests" path="/admin/requests" color="amber" />
                <QuickAccessLink icon={Mail} label="Contacts" path="/admin/contacts" color="violet" />
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">System Status</h4>
                  <p className="text-xs text-emerald-700">All systems operational</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <StatusItem label="API Server" status="online" />
                <StatusItem label="Database" status="online" />
                <StatusItem label="Cache" status="online" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-1">Loading Dashboard</h3>
      <p className="text-slate-500 text-sm">Fetching the latest data...</p>
    </div>
  </div>
);

const Activity24Card = ({ stat, delay }) => {
  const colorMap = {
    indigo: 'bg-white/15',
    emerald: 'bg-white/15',
    violet: 'bg-white/15',
    cyan: 'bg-white/15'
  };

  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`${colorMap[stat.color]} backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/20`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        {stat.trend === 'up' && <ChevronUp className="w-4 h-4 text-emerald-300" />}
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
    </motion.div>
  );
};

const StatCard = ({ stat, variants }) => {
  const colorMap = {
    indigo: { accent: 'bg-indigo-100', text: 'text-indigo-600' },
    emerald: { accent: 'bg-emerald-100', text: 'text-emerald-600' },
    amber: { accent: 'bg-amber-100', text: 'text-amber-600' },
    violet: { accent: 'bg-violet-100', text: 'text-violet-600' }
  };

  const Icon = stat.icon;
  const colors = colorMap[stat.color];
  const changePercent = stat.value > 0 ? Math.round((stat.change / stat.value) * 100) : 0;

  return (
    <motion.div
      variants={variants}
      className="group relative bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.accent} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.text}`} />
          </div>
          {changePercent > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50"
            >
              <TrendingUp size={12} />
              +{changePercent}%
            </motion.div>
          )}
        </div>

        {/* Content */}
        <h3 className="text-slate-600 text-sm font-semibold mb-2">{stat.label}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value.toLocaleString()}</p>
          {stat.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.accent} ${colors.text}`}>
              {stat.badge}
            </span>
          )}
        </div>

        {/* CTA Link */}
        <Link
          to={stat.link}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          style={{ color: colors.text.replace('text-', '') }}
        >
          <span>View Details</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Bottom accent line */}
      <div className={`h-1 w-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
};

const RequestRowEnhanced = ({ request, index }) => {
  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Clock },
      resolved: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
      approved: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
      rejected: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: XCircle }
    };
    return statusMap[status] || { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: AlertCircle };
  };

  const statusConfig = getStatusConfig(request.status);
  const Icon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-2">
            {request.subject || 'Support Request'}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600">
            <span className="truncate font-medium">{request.user?.firstName} {request.user?.lastName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} whitespace-nowrap`}>
          <Icon size={12} />
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </div>
      </div>
    </motion.div>
  );
};

const QuickAccessLink = ({ icon: Icon, label, path, color }) => {
  const colorMap = {
    indigo: 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700',
    emerald: 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700',
    amber: 'hover:bg-amber-50 text-amber-600 hover:text-amber-700',
    violet: 'hover:bg-violet-50 text-violet-600 hover:text-violet-700'
  };

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${colorMap[color]}`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{label}</span>
      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-emerald-800">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
      <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">{status}</span>
    </div>
  </div>
);

export default AdminDashboard;