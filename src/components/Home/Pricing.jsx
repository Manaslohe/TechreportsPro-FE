import { useState, useEffect, useRef } from 'react';
import { Check, Star, Calendar, TrendingUp } from 'lucide-react';

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: 'Monthly',
      price: '₹399',
      period: '/month',
      popular: false,
      gradient: 'from-blue-500 to-blue-600',
      delay: 0
    },
    {
      name: 'Quarterly',
      price: '₹499',
      period: '/3 months',
      popular: false,
      gradient: 'from-blue-600 to-blue-700',
      delay: 100
    },
    {
      name: '6 Months',
      price: '₹899',
      period: '/6 months',
      popular: true,
      gradient: 'from-blue-700 to-blue-800',
      delay: 200
    },
    {
      name: 'Yearly',
      price: '₹1,399',
      period: '/year',
      popular: false,
      gradient: 'from-blue-800 to-blue-900',
      delay: 300,
      badge: 'Best Value'
    }
  ];

  const features = [
    '5 Premium Reports per month',
    '1 Bluechip/Large Cap Report',
    'Expert Market Analysis',
    'Weekly Market Updates',
    'Priority Support',
    'Mobile & Desktop Access'
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Subscriptions & Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-blue-600 ml-3">Investment Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get premium market insights and expert analysis with our flexible subscription plans
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${plan.delay}ms` }}
            >
              <div className={`relative h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="w-4 h-4  text-nowrap fill-current" />
                      <span className='text-nowrap'>Most Popular</span>
                    </div>
                  </div>
                )}
                
                {plan.badge && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.gradient} rounded-t-2xl p-6 text-white`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-80 ml-1">{plan.period}</span>
                  </div>
                </div>

                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full bg-gradient-to-r ${plan.gradient} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Report Section */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>One-Time Purchase</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Individual Report
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Need just one report? Get premium market analysis and expert insights for a single stock or sector.
                </p>
                <ul className="space-y-4">
                  {['Comprehensive Stock Analysis', 'Market Trend Insights', 'Risk Assessment', 'Price Target Recommendations'].map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="text-5xl font-bold mb-2">₹299</div>
                  <div className="text-xl opacity-90 mb-6">per report</div>
                  <button className="w-full bg-white text-blue-700 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors duration-300">
                    Buy Single Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Notice */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              📊 Reports are uploaded every Saturday night
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
