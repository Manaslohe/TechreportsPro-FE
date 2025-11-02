import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, KeyRound, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import Toast from "./common/Toast";
import { useTranslation } from "../contexts/TranslationContext";

const apiBaseUrl = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_REACT_APP_API_BASE_URL_PRODUCTION 
  : import.meta.env.VITE_REACT_APP_API_BASE_URL;

export default function ForgotPassword({ isOpen, onClose }) {
  const { translate } = useTranslation();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${apiBaseUrl}/api/users/forgot-password`, { email });
      setToast({
        show: true,
        message: "OTP sent to your email!",
        type: "success"
      });
      setStep(2);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || "Error sending OTP",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/verify-otp`, { 
        email: email.trim(), 
        otp: otp.trim() 
      });
      console.log('Verify OTP response:', response.data); // Debug log
      setToast({
        show: true,
        message: "OTP verified successfully!",
        type: "success"
      });
      setStep(3);
    } catch (error) {
      console.error('Verify OTP error:', error.response || error); // Debug log
      setToast({
        show: true,
        message: error.response?.data?.error || "Invalid OTP",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToast({
        show: true,
        message: "Passwords do not match",
        type: "error"
      });
      return;
    }

    if (newPassword.length < 6) {
      setToast({
        show: true,
        message: "Password must be at least 6 characters",
        type: "error"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/reset-password`, {
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      });
      console.log('Reset password response:', response.data); // Debug log

      setToast({
        show: true,
        message: "Password reset successfully!",
        type: "success"
      });

      setTimeout(() => {
        onClose();
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error.response || error); // Debug log
      setToast({
        show: true,
        message: error.response?.data?.error || "Error resetting password",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <KeyRound className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {step === 1 && "Forgot Password?"}
                      {step === 2 && "Verify OTP"}
                      {step === 3 && "Reset Password"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {step === 1 && "Enter your email to receive an OTP"}
                      {step === 2 && "Enter the OTP sent to your email"}
                      {step === 3 && "Create your new password"}
                    </p>

                    {/* Progress indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === step ? "w-8 bg-blue-600" : "w-2 bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step 1: Email */}
                  {step === 1 && (
                    <motion.form
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleRequestOtp}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Send OTP
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* Step 2: OTP Verification */}
                  {step === 2 && (
                    <motion.form
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleVerifyOtp}
                      className="space-y-6"
                    >
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-blue-800 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>
                            We've sent a 6-digit OTP to <strong>{email}</strong>. Please check your inbox.
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Enter OTP
                        </label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-2xl tracking-widest font-mono"
                            placeholder="000000"
                            maxLength="6"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 h-12 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading || otp.length !== 6}
                          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              Verify
                              <CheckCircle className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}

                  {/* Step 3: New Password */}
                  {step === 3 && (
                    <motion.form
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleResetPassword}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-11 w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-500 text-sm flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Passwords do not match
                        </p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Reset Password
                            <CheckCircle className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
