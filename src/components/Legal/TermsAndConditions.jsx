import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const TermsAndConditions = ({ isOpen, onClose }) => {
  const { translate, language } = useTranslation();

  useEffect(() => {
    // Trigger re-render when language changes
  }, [language]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 flex items-center justify-between sticky top-0 z-[10001]">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-bold">{translate("termsAndConditionsTitle")}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                {translate("termsIntroduction")}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("mailingListTitle")}</h3>
                  <p className="text-gray-700">
                    {translate("mailingListDescription")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("accessToReportsTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("accessToReportsPoint1")}</li>
                    <li>{translate("accessToReportsPoint2")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("subscriptionPaymentTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("subscriptionPaymentPoint1")}</li>
                    <li>{translate("subscriptionPaymentPoint2")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("disclaimerLiabilityTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("disclaimerLiabilityPoint1")}</li>
                    <li>{translate("disclaimerLiabilityPoint2")}</li>
                    <li>{translate("disclaimerLiabilityPoint3")}</li>
                    <li>{translate("disclaimerLiabilityPoint4")}</li>
                    <li>{translate("disclaimerLiabilityPoint5")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("intellectualPropertyTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("intellectualPropertyPoint1")}</li>
                    <li>{translate("intellectualPropertyPoint2")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("userAccountsSecurityTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("userAccountsSecurityPoint1")}</li>
                    <li>{translate("userAccountsSecurityPoint2")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("restrictionsTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("restrictionsPoint1")}</li>
                    <li>{translate("restrictionsPoint2")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("thirdPartyLinksTitle")}</h3>
                  <p className="text-gray-700">
                    {translate("thirdPartyLinksDescription")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("limitedLiabilityTitle")}</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>{translate("limitedLiabilityPoint1")}</li>
                    <li>{translate("limitedLiabilityPoint2")}</li>
                    <li>{translate("limitedLiabilityPoint3")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("indemnificationTitle")}</h3>
                  <p className="text-gray-700">
                    {translate("indemnificationDescription")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{translate("modificationOfTermsTitle")}</h3>
                  <p className="text-gray-700">
                    {translate("modificationOfTermsDescription")}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                  <p className="text-blue-800 font-medium">
                    {translate("termsAgreement")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 z-[10001]">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translate("close")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsAndConditions;
