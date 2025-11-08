import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, FileText, Image, CheckCircle } from 'lucide-react';

const RequestPreview = ({ selectedUser, grantType, selectedPlan, selectedReport, screenshot }) => {
  // Early return if no data to preview
  if (!selectedUser && !selectedPlan && !selectedReport && !screenshot) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Request Preview</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">
            Fill out the form to see preview
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Request Preview</h2>
      
      <div className="space-y-4">
        {/* User Info */}
        {selectedUser && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Selected User</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {selectedUser.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grant Type & Details */}
        {(selectedPlan || selectedReport) && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              {grantType === 'subscription' ? (
                <CreditCard className="w-4 h-4 text-slate-600" />
              ) : (
                <FileText className="w-4 h-4 text-slate-600" />
              )}
              <span className="text-sm font-medium text-slate-700">
                {grantType === 'subscription' ? 'Subscription Plan' : 'Report Access'}
              </span>
            </div>
            
            {selectedPlan && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{selectedPlan.name}</span>
                  <span className="font-bold text-indigo-600">₹{selectedPlan.price}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <p>{selectedPlan.duration} month{selectedPlan.duration > 1 ? 's' : ''} access</p>
                  <p>{selectedPlan.totalReports} reports included</p>
                </div>
              </div>
            )}
            
            {selectedReport && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{selectedReport.title}</span>
                  <span className="font-bold text-indigo-600">₹555</span>
                </div>
                <p className="text-sm text-slate-600">{selectedReport.category}</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Proof */}
        {screenshot && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Image className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Payment Proof</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Screenshot uploaded</span>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-2">Request Summary</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p>• User: {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Not selected'}</p>
            <p>• Type: {grantType === 'subscription' ? 'Subscription Access' : 'Single Report Access'}</p>
            <p>• Amount: ₹{grantType === 'subscription' ? selectedPlan?.price || 0 : 555}</p>
            <p>• Payment Proof: {screenshot ? 'Uploaded' : 'Not uploaded'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(RequestPreview);
