// FAQ Section Component
"use client";
import { faqData, FAQItem as FAQItemType } from "@/app/constants/faqData";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "./ContactPage";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

interface props {
  item: FAQItemType;
  index: number;
}

// FAQ Item Component
function FAQItem({ item, index }: props) {
  const { local } = useVariables();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-surface-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-5 text-left flex items-center justify-between hover:bg-surface-50 transition-colors duration-200"
        whileHover={{ backgroundColor: "var(--surface-50)" }}
      >
        <h3 className="heading-sm font-display text-surface-900 pr-4">
          {item.question[local]}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <FiChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-surface-400'}`} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // ease-out-expo
            className="overflow-hidden"
          >
            <div className="px-8 pb-6">
              <p className="body text-surface-600 leading-relaxed">
                {item.answer[local]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const { local } = useVariables();
  const { contactPage } = getTranslations(local);
  return (
    <motion.section
      className="w-full max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center mb-16" variants={itemVariants}>
        <h2 className="display-sm font-display text-surface-900 mb-4">
          {contactPage.faqTitle}
        </h2>
        <p className="body text-surface-600 max-w-2xl mx-auto">
          {contactPage.faqDescription}
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <FAQItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
