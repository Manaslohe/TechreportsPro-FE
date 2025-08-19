import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/Header";

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.phone && formData.email;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    console.log("Form submitted:", formData);
    // Add form submission logic here
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const renderStepContent = () => (
    <AnimatePresence mode="wait" custom={step}>
      <motion.div
        key={step}
        custom={step}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Set Password</h3>
            <div>
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {!passwordMatch && (
                <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
              )}
            </div>
            <div className="mt-6">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mr-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline mx-1">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate('/signin', { 
      state: { direction: 'back' }
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Header handleNavigation={(path) => window.location.href = path} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3
        }}
        className="max-w-7xl w-full mx-auto bg-white rounded-2xl shadow-xl flex overflow-hidden relative min-h-[600px]"
      >
        {/* Left Column - Form */}
        <div className="w-full lg:w-1/2 p-12">
          <div className="max-w-md mx-auto pt-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 1 && "Personal Information"}
              {step === 2 && "Set Your Password"}
            </h2>
            <p className="text-gray-600 mb-8">
              Step {step} of 2
            </p>

            {/* Form content with increased spacing */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStepContent()}
              
              {/* Navigation buttons - adjusted spacing and size */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium ml-auto"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </form>

            {/* Add login link */}
            <div className="text-center mt-4">
              <motion.p 
                className="text-sm text-gray-600"
                whileHover={{ scale: 1.02 }}
              >
                Already have an account?{" "}
                <motion.a
                  href="/signin"
                  onClick={handleSignInClick}
                  className="text-blue-600 hover:underline inline-block"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Login here
                </motion.a>
              </motion.p>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block w-1/2 bg-blue-50 p-12">
          <div className="h-full flex items-center justify-center">
            <img
              src="/signup.png"
              alt="Signup Illustration"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

