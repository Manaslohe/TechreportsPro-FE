import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Link2, UserCheck, Clock, Mail, Phone, Lock } from "lucide-react";
import { useTranslation } from "../../contexts/TranslationContext";

const PrivacyPolicy = () => {
  const { translate } = useTranslation();

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
      title: translate("howInformationCollected"),
      content: [
        translate("infoCollectedContactForms"),
        translate("infoCollectedCookies"),
        translate("infoCollectedReferFriend"),
        translate("infoCollectedNoBankDetails")
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: translate("howInformationUsed"),
      content: [
        translate("infoUsedSecure"),
        translate("infoUsedAccountTermination"),
        translate("infoUsedImproveServices"),
        translate("infoUsedAnalyzeTrends")
      ]
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: translate("linksWebsitesOffers"),
      content: [
        translate("linksExternal"),
        translate("linksNotResponsible"),
        translate("linksReviewPolicies"),
        translate("linksConvenience")
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: translate("dataSecurity"),
      content: [
        translate("securityMeasures"),
        translate("securityEncryption"),
        translate("securityRestrictedAccess"),
        translate("securityRegularUpdates"),
        translate("securityBreachNotification")
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: translate("yourRights"),
      content: [
        translate("rightsAccessUpdateDelete"),
        translate("rightsOptOut"),
        translate("rightsRequestData"),
        translate("rightsDataPortability"),
        translate("rightsLodgeComplaint")
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: translate("dataRetention"),
      content: [
        translate("retentionNecessary"),
        translate("retentionAccountInfo"),
        translate("retentionMarketingData"),
        translate("retentionLegalCompliance"),
        translate("retentionAnonymousData")
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
            <h1 className="text-4xl md:text-5xl font-bold">{translate("privacyPolicyTitle")}</h1>
          </motion.div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {translate("privacyPolicySubtitle")}
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-blue-200"
          >
            {translate("lastUpdated", { date: "January 2025" })}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{translate("commitmentTitle")}</h2>
              <p className="text-gray-700 leading-relaxed">
                {translate("commitmentDescription")}
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
                {translate("contactUsPrivacy")}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">{translate("emailUsAt")}</p>
                    <a href="mailto:info.marketmindsresearch@gmail.com" className="text-blue-600 font-semibold hover:underline">
                      info.marketmindsresearch@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">{translate("callUsAt")}</p>
                    <a href="tel:+917987090461" className="text-blue-600 font-semibold hover:underline">
                      +91 7987090461
                    </a>
                    <p className="text-sm text-gray-600">{translate("callUsAt")} (Mon-Fri 9AM-6PM IST)</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">{translate("important")}:</strong> {translate("privacyPolicyAgreement")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {translate("privacyPolicyEffectiveDate", { date: "January 2025" })}
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
