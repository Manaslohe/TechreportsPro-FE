import React from "react";
import { CheckCircle, FileText, BarChart, Activity, Shield, TrendingUp } from "lucide-react";

const ReportDetails = () => {
  const leftDetails = [
    "20+ Years Industry Experience",
    "500+ Companies Analyzed",
    "Proven Analytical Framework"
  ];

  const rightDetails = [
    { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, text: "Executive Summary & Key Findings" },
    { icon: <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, text: "Detailed Financial Analysis" },
    { icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, text: "Operational Performance Metrics" },
    { icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, text: "SWOT Analysis & Risk Assessment" },
    { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, text: "Future Projections & Scenarios" }
  ];

  return (
    <section className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-20">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Expert Analysis You Can Trust
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              With over two decades of experience in financial analysis and business intelligence, our reports provide the deep insights you need to make critical business decisions.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {leftDetails.map((detail, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content with Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-lg">
              <img
                src="/Finance.png"
                alt="Finance Analysis"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-lg blur-xl opacity-50 -z-10"></div>
            </div>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 text-center">
            What's Included in Each Report
          </h3>
          
          {/* Mobile: Single Column */}
          <div className="block sm:hidden space-y-4">
            {rightDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md"
              >
                <div className="flex-shrink-0 mt-0.5">{detail.icon}</div>
                <p className="text-sm text-slate-700 leading-relaxed">{detail.text}</p>
              </div>
            ))}
          </div>

          {/* Tablet: 2 Columns */}
          <div className="hidden sm:block lg:hidden">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {rightDetails.slice(0, 4).map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0">{detail.icon}</div>
                  <p className="text-sm text-slate-700">{detail.text}</p>
                </div>
              ))}
            </div>
            {/* Center the last card on tablet */}
            <div className="flex justify-center">
              <div className="w-1/2 px-2">
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">{rightDetails[4].icon}</div>
                  <p className="text-sm text-slate-700">{rightDetails[4].text}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: 3 Columns with centered last two cards */}
          <div className="hidden lg:block">
            {/* First row: 3 cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {rightDetails.slice(0, 3).map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0">{detail.icon}</div>
                  <p className="text-slate-700">{detail.text}</p>
                </div>
              ))}
            </div>
            
            {/* Second row: 2 centered cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-6 max-w-4xl">
                {rightDetails.slice(3, 5).map((detail, index) => (
                  <div
                    key={index + 3}
                    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-shrink-0">{detail.icon}</div>
                    <p className="text-slate-700">{detail.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportDetails;