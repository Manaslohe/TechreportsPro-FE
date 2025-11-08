import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ArrowRight, TrendingUp
} from 'lucide-react';

const StatCard = React.memo(({ stat, variants }) => {
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
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5 sm:p-6">
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

        <h3 className="text-slate-600 text-sm font-semibold mb-2">{stat.label}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value.toLocaleString()}</p>
          {stat.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.accent} ${colors.text}`}>
              {stat.badge}
            </span>
          )}
        </div>

        <Link
          to={stat.link}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
          style={{ color: colors.text.replace('text-', '') }}
        >
          <span>View Details</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className={`h-1 w-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

const DashboardStats = React.memo(({ dashboardData, containerVariants, itemVariants }) => {
  // Memoized stats array
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

  return (
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
  );
});

DashboardStats.displayName = 'DashboardStats';

export default DashboardStats;
