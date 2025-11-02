import React, { useMemo } from 'react';
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
  Star,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const CatalogHeader = React.memo(({
  searchTerm,
  setSearchTerm,
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
  const { translate } = useTranslation();
  const sortOptions = useMemo(() => [
    { value: 'recent', label: translate('mostRecent') },
    { value: 'old', label: translate('oldestFirst') },
    { value: 'name', label: translate('companyName') },
    { value: 'popular', label: translate('mostPopular') }
  ], [translate]);

  const isMobile = useMemo(() => window.innerWidth <= 768, []);
  const hasActiveFilters = searchTerm || sortBy !== 'recent';

  return (
    <>
      {/* Hero Section - Redesigned */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20 mt-8"
            >
              <Sparkles className="h-4 w-4" />
              {translate('premiumInvestmentResearch')}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 tracking-tight">
              {translate('researchReportsCatalog')}
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              {translate('accessPremiumInsights')}
            </p>
            
            {/* Quick Stats - Redesigned */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              >
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">{totalReports}</div>
                  <div className="text-blue-100 text-xs">{translate('totalReports')}</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              >
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">{sampleReportsCount}</div>
                  <div className="text-blue-100 text-xs">{translate('freeSamples')}</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              >
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">{translate('expertAnalysis').split(' ')[0]}</div>
                  <div className="text-blue-100 text-xs">{translate('expertAnalysis').split(' ')[1]}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter Section - Redesigned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            {/* Search Bar - Enhanced */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="text"
                placeholder={translate('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 text-base placeholder:text-gray-400 hover:border-gray-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters Row - Redesigned */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              {/* Left Side Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Sort Options */}
                <div className="relative flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-9 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort Order */}
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium"
                >
                  {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  <span className="hidden sm:inline">{sortOrder === 'desc' ? translate('desc') : translate('asc')}</span>
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearFilters}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl text-sm font-medium transition-all"
                  >
                    {translate('clearAll')}
                  </motion.button>
                )}
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-3 justify-between lg:justify-end">
                {/* Results Count */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {filteredResults} {filteredResults === 1 ? translate('result') : translate('results')}
                  </span>
                </div>

                {/* View Mode Toggle */}
                {!isMobile && setViewMode && (
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-sm text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={translate('gridView')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={translate('listView')}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});

CatalogHeader.displayName = 'CatalogHeader';

export default CatalogHeader;
