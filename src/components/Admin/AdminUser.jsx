import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, FileText, Search, Download, Eye, ChevronDown, Filter } from 'lucide-react';
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
      const response = await axios.get('/api/admin/users', {
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

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage and view user information</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.purchasedReports?.length > 0).length}
              </div>
              <div className="text-sm text-green-600">Active Buyers</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {users.reduce((acc, u) => acc + (u.purchasedReports?.length || 0), 0)}
              </div>
              <div className="text-sm text-purple-600">Reports Sold</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-orange-600">New This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  selectedUser={selectedUser}
                  onToggleDetails={setSelectedUser}
                />
              ))}
            </AnimatePresence>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 inline-block">
                <User className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-500 font-medium">No users found</h3>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </div>
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

const UserCard = ({ user, selectedUser, onToggleDetails }) => {
  const isExpanded = selectedUser === user._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        className="p-6 cursor-pointer"
        onClick={() => onToggleDetails(isExpanded ? null : user._id)}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {user.purchasedReports?.length || 0} Reports
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  {user.paymentRequests?.filter(p => p.status === 'approved').length || 0} Payments
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from toggling
              onToggleDetails(isExpanded ? null : user._id);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t space-y-6"
        >
          {/* Purchased Reports */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Purchased Reports
            </h4>
            {user.purchasedReports?.length > 0 ? (
              <div className="grid gap-3">
                {user.purchasedReports.map((report) => (
                  <div key={report._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{report.title}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reports purchased yet</p>
            )}
          </div>

          {/* Payment History */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment History</h4>
            {user.paymentRequests?.length > 0 ? (
              <div className="overflow-hidden">
                <div className="hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Report</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.paymentRequests.map((payment) => (
                        <tr key={payment._id} className="border-b last:border-b-0">
                          <td className="py-3 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 text-sm">{payment.report?.title || 'Unknown Report'}</td>
                          <td className="py-3 text-sm font-medium">₹{payment.amount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'approved' ? 'bg-green-100 text-green-600' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden space-y-3">
                  {user.paymentRequests.map((payment) => (
                    <div key={payment._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{payment.report?.title || 'Unknown Report'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'approved' ? 'bg-green-100 text-green-600' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium">₹{payment.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No payment history</p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminUser;
