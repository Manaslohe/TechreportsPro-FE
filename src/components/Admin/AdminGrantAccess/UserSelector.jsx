import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, Check, ChevronDown } from 'lucide-react';

const UserSelector = ({ users, selectedUser, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Memoized user display name
  const getUserDisplayName = useCallback((user) => {
    return `${user.firstName} ${user.lastName}`;
  }, []);

  // Optimized handlers
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleUserSelect = useCallback((user) => {
    onSelectUser(user);
    setIsOpen(false);
    setSearchTerm('');
  }, [onSelectUser]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Select User *
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full flex items-center justify-between px-4 py-3 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <span className={selectedUser ? 'text-slate-900' : 'text-slate-500'}>
              {selectedUser ? getUserDisplayName(selectedUser) : 'Choose a user...'}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* User List */}
              <div className="overflow-y-auto max-h-48">
                {filteredUsers.length === 0 ? (
                  <div className="p-3 text-center text-slate-500 text-sm">
                    {searchTerm ? 'No users found' : 'No users available'}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.button
                      key={user._id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      whileHover={{ backgroundColor: 'rgb(241, 245, 249)' }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {getUserDisplayName(user)}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {selectedUser?._id === user._id && (
                        <Check className="w-4 h-4 text-indigo-600" />
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(UserSelector);
