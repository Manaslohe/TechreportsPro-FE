import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  SortAsc, 
  SortDesc, 
  X, 
  Grid3X3, 
  List,
  FileText,
  Gift,
  Star
} from 'lucide-react';

const CatalogHeader = ({
  searchTerm,
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  clearFilters,
  totalReports,
  sampleReportsCount,
  filteredResults
}) => {
  const sectors = ['all', 'Technology', 'Banking', 'Healthcare', 'Energy', 'Market Analysis', 'FMCG', 'Auto'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'old', label: 'Oldest First' },
    { value: 'name', label: 'Company Name' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const isMobile = window.innerWidth <= 768; // Check if the screen size is mobile

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 lg:py-20"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Reports Catalog
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover premium investment insights, market analysis, and expert research reports
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{totalReports} Total Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>{sampleReportsCount} Free Samples</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Expert Analysis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reports by title, description, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sector Filter */}
              <div className="relative">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sectors</option>
                  {sectors.slice(1).map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Clear Filters */}
              {(searchTerm || selectedSector !== 'all' || sortBy !== 'recent') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}

              {/* View Mode Toggle */}
              {!isMobile && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {filteredResults} results
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogHeader;
