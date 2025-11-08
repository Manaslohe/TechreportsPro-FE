import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const RequestPreview = ({ selectedUser, grantType, selectedPlan, selectedReport, screenshot }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Preview</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Selected User</p>
          {selectedUser ? (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {selectedUser.firstName[0]}{selectedUser.lastName[0]}
              </div>
              <div>
                <p className="font-medium text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-slate-600">{selectedUser.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No user selected</p>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Access Type</p>
          <p className="font-medium text-slate-900 capitalize mt-2">{grantType}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Selected Item</p>
          {grantType === 'subscription' && selectedPlan ? (
            <div className="mt-2">
              <p className="font-medium text-slate-900">{selectedPlan.name} Plan</p>
              <p className="text-sm text-slate-600 mt-1">
                ₹{selectedPlan.price} • {selectedPlan.duration} month{selectedPlan.duration > 1 ? 's' : ''}
              </p>
            </div>
          ) : grantType === 'report' && selectedReport ? (
            <div className="mt-2">
              <p className="font-medium text-slate-900">{selectedReport.title}</p>
              <p className="text-sm text-slate-600 mt-1">{selectedReport.sector}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No {grantType} selected</p>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Payment Proof</p>
          {screenshot ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-2" />
          ) : (
            <p className="text-sm text-slate-400 mt-2">No image uploaded</p>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">Approval Required</p>
            <p className="text-sm text-amber-700">
              This request will be sent for approval. The user will get access only after you approve it from the Requests section.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestPreview;
