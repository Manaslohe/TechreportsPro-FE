import React, { useState, useCallback, useMemo } from 'react';
import { Crown, FileText, Upload, X, Sparkles, Gem } from 'lucide-react';

const AccessTypeSelector = ({
  grantType,
  selectedPlan,
  selectedReport,
  screenshot,
  subscriptionPlans,
  reports,
  onTypeChange,
  onPlanSelect,
  onReportSelect,
  onScreenshotChange
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Memoized drag handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onScreenshotChange]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onScreenshotChange]);

  // Optimized plan selection with deselection
  const handlePlanClick = useCallback((plan) => {
    if (selectedPlan?.id === plan.id) {
      onPlanSelect(null); // Deselect if already selected
    } else {
      onPlanSelect(plan);
    }
  }, [selectedPlan, onPlanSelect]);

  // Optimized report selection with deselection
  const handleReportClick = useCallback((report) => {
    if (selectedReport?._id === report._id) {
      onReportSelect(null); // Deselect if already selected
    } else {
      onReportSelect(report);
    }
  }, [selectedReport, onReportSelect]);

  // Memoized report type badge
  const getReportTypeBadge = useMemo(() => {
    return (reportType) => {
      const badges = {
        free: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sparkles, label: 'Free' },
        premium: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Crown, label: 'Premium' },
        bluechip: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Gem, label: 'Bluechip' }
      };
      
      const badge = badges[reportType] || badges.premium;
      const Icon = badge.icon;
      
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
          <Icon size={12} />
          {badge.label}
        </span>
      );
    };
  }, []);

  // Memoized filtered reports for better performance
  const memoizedReports = useMemo(() => reports, [reports]);
  const memoizedPlans = useMemo(() => subscriptionPlans, [subscriptionPlans]);

  return (
    <>
      {/* Step 2: Select Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Step 2: Select Access Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTypeChange('subscription')}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              grantType === 'subscription'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Crown className={`w-6 h-6 mx-auto mb-2 ${grantType === 'subscription' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-900">Subscription</p>
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('report')}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              grantType === 'report'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <FileText className={`w-6 h-6 mx-auto mb-2 ${grantType === 'report' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-900">Report</p>
          </button>
        </div>
      </div>

      {/* Step 3: Select Plan/Report */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Step 3: Select {grantType === 'subscription' ? 'Plan' : 'Report'}
          {(selectedPlan || selectedReport) && (
            <span className="text-xs text-slate-500 ml-2">(Click again to deselect)</span>
          )}
        </label>
        
        {grantType === 'subscription' ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memoizedPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => handlePlanClick(plan)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02] ${
                  selectedPlan?.id === plan.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{plan.name} Plan</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {plan.duration} month{plan.duration > 1 ? 's' : ''} • {plan.totalReports} reports
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-indigo-600">₹{plan.price}</p>
                    {selectedPlan?.id === plan.id && (
                      <span className="text-xs text-indigo-600 font-medium mt-1">Selected ✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memoizedReports.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                No reports available
              </div>
            ) : (
              memoizedReports.map((report) => (
                <button
                  key={report._id}
                  type="button"
                  onClick={() => handleReportClick(report)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02] ${
                    selectedReport?._id === report._id
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 line-clamp-1">{report.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-600">{report.sector}</p>
                        {selectedReport?._id === report._id && (
                          <span className="text-xs text-indigo-600 font-medium">Selected ✓</span>
                        )}
                      </div>
                    </div>
                    {getReportTypeBadge(report.reportType || 'premium')}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Step 4: Upload Payment Proof */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Step 4: Upload Payment Proof
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-105'
              : screenshot
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {screenshot ? (
            <div className="space-y-3">
              <img
                src={screenshot}
                alt="Payment proof"
                className="max-w-full max-h-48 object-contain rounded-lg mx-auto shadow-sm"
              />
              <div className="flex gap-2 justify-center">
                <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onScreenshotChange(null)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700 mb-2">
                Drop image here or click to select
              </p>
              <label className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(AccessTypeSelector);
