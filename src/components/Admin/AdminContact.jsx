import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User, Calendar, MessageSquare, Search, Filter, Eye, Archive } from 'lucide-react';
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
      const response = await axios.get('/api/admin/contacts', {
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries and feedback</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
              <div className="text-sm text-blue-600">Total Submissions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.user).length}
              </div>
              <div className="text-sm text-green-600">From Registered Users</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {contacts.filter(c => new Date(c.submittedAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-purple-600">This Week</div>
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
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  selectedContact={selectedContact}
                  onToggleDetails={setSelectedContact}
                />
              ))}
            </AnimatePresence>
          )}

          {!loading && filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 inline-block">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-500 font-medium">No contacts found</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No contact submissions yet'}
                </p>
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

const ContactCard = ({ contact, selectedContact, onToggleDetails }) => {
  const isExpanded = selectedContact === contact._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        className="p-6 cursor-pointer"
        onClick={() => onToggleDetails(isExpanded ? null : contact._id)}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
              {contact.name?.[0]?.toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(contact.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
              {contact.subject && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {contact.subject}
                  </span>
                </div>
              )}
              {contact.user && (
                <div className="flex items-center gap-2 text-green-600 text-xs mt-1">
                  <User className="w-3 h-3" />
                  <span>Registered User</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from toggling
              onToggleDetails(isExpanded ? null : contact._id);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4" />
            <span>{isExpanded ? 'Hide Message' : 'View Message'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t"
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Message
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>

          {contact.user && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">User Information</h4>
              <p className="text-green-700 text-sm">
                {contact.user.firstName} {contact.user.lastName} ({contact.user.email})
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminContact;
