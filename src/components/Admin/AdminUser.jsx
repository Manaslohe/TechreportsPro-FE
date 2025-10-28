import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, FileText, Search, Download, ChevronDown, TrendingUp, Users, ShoppingCart, Clock } from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined
        }
      });
      setUsers(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error fetching users',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeBuyers: users.filter(u => u.purchasedReports?.length > 0).length,
    reportsSold: users.reduce((acc, u) => acc + (u.purchasedReports?.length || 0), 0),
    newThisMonth: users.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length
  }), [users]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 border-b border-slate-200/50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-indigo-50/30 w-full sm:w-72 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                color="indigo"
              />
              <StatCard
                icon={ShoppingCart}
                label="Active Buyers"
                value={stats.activeBuyers}
                color="emerald"
              />
              <StatCard
                icon={TrendingUp}
                label="Reports Sold"
                value={stats.reportsSold}
                color="amber"
              />
              <StatCard
                icon={Clock}
                label="New This Month"
                value={stats.newThisMonth}
                color="violet"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingState />
          ) : (
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      selectedUser={selectedUser}
                      onToggleDetails={setSelectedUser}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-200/30 hover:border-indigo-300/50',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200/30 hover:border-emerald-300/50',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-200/30 hover:border-amber-300/50',
    violet: 'from-violet-500/10 to-violet-500/5 border-violet-200/30 hover:border-violet-300/50'
  };

  const iconColorMap = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    violet: 'text-violet-600'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-default group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className={`${iconColorMap[color]} w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:opacity-100 transition-opacity`} />
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin" />
      <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
    </div>
  </div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-center items-center py-16 sm:py-20"
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-700 font-semibold text-lg mb-1">No users found</h3>
      <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
    </div>
  </motion.div>
);

const UserCard = React.memo(({ user, selectedUser, onToggleDetails }) => {
  const isExpanded = selectedUser === user._id;

  const handleToggle = useCallback(() => {
    onToggleDetails(isExpanded ? null : user._id);
  }, [isExpanded, user._id, onToggleDetails]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div
        className="p-4 sm:p-6 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 text-base sm:text-lg line-clamp-1">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-col gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span className="whitespace-nowrap">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium border border-indigo-200/50">
                  {user.purchasedReports?.length || 0} Reports
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium border border-emerald-200/50">
                  {user.paymentRequests?.filter(p => p.status === 'approved').length || 0} Payments
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 flex-shrink-0 ml-auto lg:ml-0"
          >
            <span className="hidden sm:inline">Details</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
              {/* Purchased Reports */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Purchased Reports
                </h4>
                {user.purchasedReports?.length > 0 ? (
                  <div className="grid gap-2 sm:gap-3">
                    {user.purchasedReports.map((report) => (
                      <div key={report._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors group">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm line-clamp-1">{report.title}</span>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded transition-colors flex-shrink-0 ml-2">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No reports purchased yet</p>
                )}
              </div>

              {/* Payment History */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm sm:text-base">Payment History</h4>
                {user.paymentRequests?.length > 0 ? (
                  <div className="overflow-hidden">
                    <div className="hidden sm:block border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs sm:text-sm text-slate-600 bg-slate-100/50 border-b border-slate-200">
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Report</th>
                            <th className="px-4 py-3 font-semibold">Amount</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {user.paymentRequests.map((payment) => (
                            <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-700">{new Date(payment.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm text-slate-700">{payment.report?.title || 'Unknown'}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-slate-900">₹{payment.amount}</td>
                              <td className="px-4 py-3">
                                <PaymentStatusBadge status={payment.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="sm:hidden space-y-2.5">
                      {user.paymentRequests.map((payment) => (
                        <div key={payment._id} className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <span className="font-medium text-sm text-slate-900 line-clamp-2 flex-1">{payment.report?.title || 'Unknown'}</span>
                            <PaymentStatusBadge status={payment.status} />
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                            <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                            <span className="font-semibold text-slate-900">₹{payment.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No payment history</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

UserCard.displayName = 'UserCard';

const PaymentStatusBadge = ({ status }) => {
  const statusMap = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200/50'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusMap[status] || statusMap.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default AdminUser;
