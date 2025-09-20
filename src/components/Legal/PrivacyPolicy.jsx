import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Link2, UserCheck, Clock, Mail, Phone, Lock } from "lucide-react";

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "How Information is Collected",
      content: [
        "We collect information about users through contact forms, newsletter subscriptions and user registration forms, along with other means.",
        "Your information could also be collected via forum postings, content posted on the sites etc.",
        "The website uses cookies to better understand user behaviour and help provide seamless services to the users.",
        "If you refer a friend to use our service, their name, email address and phone number will be saved with us.",
        "Market Minds Research does not store your bank details, credit/debit card details or passwords other than site login passwords."
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "How Information is Used",
      content: [
        "Your email address and phone number remain secure with Market Minds Research and these details will be used strictly for sending you recommendations as well as occasional offers from us.",
        "If you choose to terminate your account with the website, some of your data like posts, comments etc. may remain with us anonymously and will no longer be attributed to you.",
        "All such information remains obscured in our aggregated data sets.",
        "We use your information to improve our services, personalize your experience, and provide customer support.",
        "Your data helps us analyze market trends and develop better research methodologies."
      ]
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: "Links, Websites and Offers",
      content: [
        "The website may contain links and offers from partners, sponsors, and advertisers.",
        "Market Minds Research is not responsible for your communication with these websites and isn't responsible for any action, whether good or unfortunate, occurring on a third-party platform.",
        "We recommend reviewing the privacy policies of any third-party websites you visit through our links.",
        "External links are provided for convenience and do not constitute an endorsement of the content or policies of those sites."
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All data transmission is encrypted using secure protocols (SSL/TLS).",
        "Access to your personal information is restricted to authorized personnel only.",
        "We regularly update our security practices to protect against unauthorized access, alteration, disclosure, or destruction of your data.",
        "In the event of a data breach, we will notify affected users within 72 hours as required by applicable laws."
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information at any time.",
        "You can opt-out of marketing communications by clicking the unsubscribe link in our emails.",
        "You can request a copy of all data we hold about you.",
        "You have the right to data portability - we can provide your data in a machine-readable format.",
        "You can lodge a complaint with relevant data protection authorities if you believe your rights have been violated."
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Data Retention",
      content: [
        "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy.",
        "Account information is retained for the duration of your active account plus 3 years after account closure.",
        "Marketing data is retained until you opt-out or for a maximum of 5 years.",
        "Legal and compliance data may be retained for longer periods as required by applicable laws.",
        "Anonymous and aggregated data may be retained indefinitely for research and analytical purposes."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 lg:py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Shield className="w-12 h-12 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </motion.div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Market Minds Research - Your Privacy, Our Priority
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-blue-200"
          >
            Last updated: January 2025
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                At Market Minds Research, we value our relationship with you. Therefore, we take utmost care in protecting your personal information and data which we collect. This policy outlines the types of information Market Minds Research collects and how that information is used.
              </p>
            </div>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-600" />
                Contact Us About Privacy
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email us at</p>
                    <a href="mailto:privacy@marketminds.com" className="text-blue-600 font-semibold hover:underline">
                      privacy@marketminds.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Call us at</p>
                    <a href="tel:+916264799001" className="text-blue-600 font-semibold hover:underline">
                      +91 6264799001
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">Important:</strong> By continuing to use this website, you agree to our privacy policy. 
                  If you have any questions or concerns about how we handle your data, please don't hesitate to contact us.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              This privacy policy is effective as of January 2025 and may be updated from time to time. 
              We will notify users of any significant changes via email or website notice.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
