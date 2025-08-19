import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/Header";

export default function SignInForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add sign-in logic here
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate('/signup', { 
      state: { direction: 'forward' }
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
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">Sign in to access your account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
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

                <div>
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="mr-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-6">
              <motion.p 
                className="text-sm text-gray-600"
                whileHover={{ scale: 1.02 }}
              >
                Don't have an account?{" "}
                <motion.a
                  href="/signup"
                  onClick={handleSignUpClick}
                  className="text-blue-600 hover:underline inline-block"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Sign up here
                </motion.a>
              </motion.p>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block w-1/2 bg-blue-50 p-12">
          <div className="h-full flex items-center justify-center">
            <img
              src="/signin.png"
              alt="Sign In Illustration"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
