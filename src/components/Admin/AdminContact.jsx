import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare, 
  Search, 
  Eye, 
  Globe,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import Toast from '../common/Toast';

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await axios.get(`${baseURL}/api/admin/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': localStorage.getItem('adminAuth') === 'true' ? 'true' : undefined
        }
      });
      setContacts(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error fetching contact submissions',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thisWeekCount = contacts.filter(c => 
    new Date(c.createdAt) > new Date(Date.now() - 7*24*60*60*1000)
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Modern Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{contacts.length}</div>
              <div className="text-sm font-medium text-blue-700">Total Submissions</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {contacts.filter(c => c.user).length}
              </div>
              <div className="text-sm font-medium text-green-700">Registered Users</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">{thisWeekCount}</div>
              <div className="text-sm font-medium text-purple-700">This Week</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading contacts...</p>
              </div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 inline-block">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No contacts found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No contact submissions yet'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact._id}
                    contact={contact}
                    selectedContact={selectedContact}
                    onToggleDetails={setSelectedContact}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
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

const ContactCard = ({ contact, selectedContact, onToggleDetails, variants }) => {
  const isExpanded = selectedContact === contact._id;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      layout
      variants={variants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Left Side - Contact Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
            >
              {contact.name?.[0]?.toUpperCase()}
            </motion.div>

            {/* Details */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                {contact.user && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    User
                  </span>
                )}
              </div>

              {/* Contact Details */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.country && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{contact.country}</span>
                  </div>
                )}
              </div>

              {/* Timestamp - CHANGED from submittedAt to createdAt */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(contact.createdAt)}</span>
              </div>

              {/* Message Preview (when not expanded) */}
              {!isExpanded && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-2">
                  {contact.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggleDetails(isExpanded ? null : contact._id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span>{isExpanded ? 'Hide Message' : 'View Message'}</span>
          </motion.button>
        </div>

        {/* Expanded Message Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Full Message
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>

              {/* User Additional Info */}
              {contact.user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Registered User Details
                  </h4>
                  <p className="text-green-700 text-sm">
                    <span className="font-medium">{contact.user.firstName} {contact.user.lastName}</span>
                    {' • '}
                    <span className="text-green-600">{contact.user.email}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminContact;
