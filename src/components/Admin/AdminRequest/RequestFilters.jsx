import React, { useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';

const RequestFilters = React.memo(({
  searchQuery,
  filter,
  onSearchChange,
  onFilterChange
}) => {
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleFilterChange = useCallback((e) => {
    onFilterChange(e.target.value);
  }, [onFilterChange]);

  const clearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-indigo-50/30 transition-all duration-200"
          placeholder="Search by user or report title..."
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="text-slate-400 w-4 h-4 flex-shrink-0" />
        <select 
          value={filter} 
          onChange={handleFilterChange}
          className="flex-1 sm:flex-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
});

RequestFilters.displayName = 'RequestFilters';

export default RequestFilters;
