import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

const UserSelector = ({ users, selectedUser, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Step 1: Select User
      </label>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 w-full"
        />
      </div>
      
      {selectedUser ? (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
            </div>
            <div>
              <p className="font-medium text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              <p className="text-sm text-slate-600">{selectedUser.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectUser(null)}
            className="p-1 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-2">
          {filteredUsers.slice(0, 5).map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => onSelectUser(user)}
              className="w-full p-3 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-600 truncate">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSelector;
