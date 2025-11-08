import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ArrowRight, 
  Clock, CheckCircle, XCircle, Target, AlertCircle
} from 'lucide-react';

const RequestRowEnhanced = React.memo(({ request, index }) => {
  const getStatusConfig = useCallback((status) => {
    const statusMap = {
      pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Clock },
      resolved: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
      approved: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
      rejected: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: XCircle }
    };
    return statusMap[status] || { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: AlertCircle };
  }, []);

  const statusConfig = useMemo(() => getStatusConfig(request.status), [request.status, getStatusConfig]);
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
});

RequestRowEnhanced.displayName = 'RequestRowEnhanced';

const QuickAccessLink = React.memo(({ icon: Icon, label, path, color }) => {
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
});

QuickAccessLink.displayName = 'QuickAccessLink';

const StatusItem = React.memo(({ label, status }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-emerald-800">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
      <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">{status}</span>
    </div>
  </div>
));

StatusItem.displayName = 'StatusItem';

const QuickAccessPanel = React.memo(({ dashboardData, itemVariants }) => {
  const quickAccessItems = useMemo(() => [
    { icon: Users, label: "Users", path: "/admin/users", color: "indigo" },
    { icon: FileText, label: "Reports", path: "/admin/reports", color: "emerald" },
    { icon: MessageSquare, label: "Requests", path: "/admin/requests", color: "amber" },
    { icon: Mail, label: "Contacts", path: "/admin/contacts", color: "violet" }
  ], []);

  const systemStatusItems = useMemo(() => [
    { label: "API Server", status: "online" },
    { label: "Database", status: "online" },
    { label: "Cache", status: "online" }
  ], []);

  return (
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
            {quickAccessItems.map((item) => (
              <QuickAccessLink 
                key={item.path}
                icon={item.icon} 
                label={item.label} 
                path={item.path} 
                color={item.color} 
              />
            ))}
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
            {systemStatusItems.map((item) => (
              <StatusItem key={item.label} label={item.label} status={item.status} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

QuickAccessPanel.displayName = 'QuickAccessPanel';

export default QuickAccessPanel;
