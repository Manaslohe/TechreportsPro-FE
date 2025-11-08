import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import axios from 'axios';
import Toast from '../../common/Toast';
import UserSelector from './UserSelector';
import AccessTypeSelector from './AccessTypeSelector';
import RequestPreview from './RequestPreview';

const AdminGrantAccess = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form state
  const [selectedUser, setSelectedUser] = useState(null);
  const [grantType, setGrantType] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [screenshot, setScreenshot] = useState(null);

  const subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: 355, duration: 1, totalReports: 7, premiumReports: 6, bluechipReports: 1 },
    { id: 'plus', name: 'Plus', price: 855, duration: 3, totalReports: 21, premiumReports: 18, bluechipReports: 3 },
    { id: 'pro', name: 'Pro', price: 1255, duration: 6, totalReports: 42, premiumReports: 36, bluechipReports: 6 },
    { id: 'elite', name: 'Elite', price: 2555, duration: 12, totalReports: 84, premiumReports: 72, bluechipReports: 12 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'x-admin-auth': 'true'
      };

      const [usersRes, reportsRes] = await Promise.all([
        axios.get(`${baseURL}/api/admin/users`, { headers }),
        axios.get(`${baseURL}/api/reports`, { headers })
      ]);

      setUsers(usersRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      setToast({
        show: true,
        message: 'Error fetching data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setToast({ show: true, message: 'Please select a user', type: 'error' });
      return;
    }

    if (grantType === 'subscription' && !selectedPlan) {
      setToast({ show: true, message: 'Please select a subscription plan', type: 'error' });
      return;
    }

    if (grantType === 'report' && !selectedReport) {
      setToast({ show: true, message: 'Please select a report', type: 'error' });
      return;
    }

    if (!screenshot) {
      setToast({ show: true, message: 'Please upload payment proof', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      
      const payloadData = {
        userId: selectedUser._id,
        paymentType: grantType === 'subscription' ? 'subscription' : 'report',
        amount: grantType === 'subscription' ? selectedPlan.price : 555,
        screenshotData: screenshot,
        isAdminGrant: true
      };

      if (grantType === 'subscription') {
        payloadData.subscriptionPlan = {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          duration: selectedPlan.duration,
          reportsIncluded: selectedPlan.totalReports,
          premiumReports: selectedPlan.premiumReports,
          bluechipReports: selectedPlan.bluechipReports
        };
      } else {
        payloadData.reportId = selectedReport._id;
      }

      await axios.post(`${baseURL}/api/admin/grant-access`, payloadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'x-admin-auth': 'true'
        }
      });

      setToast({
        show: true,
        message: 'Request submitted for approval successfully',
        type: 'success'
      });

      resetForm();
      
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Error submitting request',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedPlan(null);
    setSelectedReport(null);
    setScreenshot(null);
    setGrantType('subscription');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin" />
          <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 border-b border-slate-200/50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Submit for Approval</h1>
                <p className="text-sm text-slate-600">Create access requests for users (requires approval)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-indigo-600" />
                Access Request Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <UserSelector
                  users={users}
                  selectedUser={selectedUser}
                  onSelectUser={setSelectedUser}
                />

                <AccessTypeSelector
                  grantType={grantType}
                  selectedPlan={selectedPlan}
                  selectedReport={selectedReport}
                  screenshot={screenshot}
                  subscriptionPlans={subscriptionPlans}
                  reports={reports}
                  onTypeChange={setGrantType}
                  onPlanSelect={setSelectedPlan}
                  onReportSelect={setSelectedReport}
                  onScreenshotChange={setScreenshot}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Approval'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Preview Section */}
            <RequestPreview
              selectedUser={selectedUser}
              grantType={grantType}
              selectedPlan={selectedPlan}
              selectedReport={selectedReport}
              screenshot={screenshot}
            />
          </div>
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

export default AdminGrantAccess;
