import React, { useState } from 'react';
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getReportTypeBadge = (reportType) => {
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
            className={`p-4 rounded-lg border-2 transition-all ${
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
            className={`p-4 rounded-lg border-2 transition-all ${
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
        </label>
        
        {grantType === 'subscription' ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {subscriptionPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => onPlanSelect(plan)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPlan?.id === plan.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{plan.name} Plan</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {plan.duration} month{plan.duration > 1 ? 's' : ''} • {plan.totalReports} reports
                    </p>
                  </div>
                  <p className="font-bold text-indigo-600">₹{plan.price}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reports.map((report) => (
              <button
                key={report._id}
                type="button"
                onClick={() => onReportSelect(report)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedReport?._id === report._id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 line-clamp-1">{report.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{report.sector}</p>
                  </div>
                  {getReportTypeBadge(report.reportType || 'premium')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 4: Upload Payment Proof */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Step 4: Upload Payment Proof
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
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
                className="max-w-full max-h-48 object-contain rounded-lg mx-auto"
              />
              <button
                type="button"
                onClick={() => onScreenshotChange(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Remove
              </button>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccessTypeSelector;
