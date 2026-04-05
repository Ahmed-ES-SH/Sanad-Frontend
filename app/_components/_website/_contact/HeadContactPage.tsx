// Header Component
"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion } from "framer-motion";

export default function HeadContactPage() {
  const { local } = useVariables();
  const { contactPage } = getTranslations(local);
  return (
    <motion.header
      className="text-center py-20 bg-gradient-to-b from-primary-50/50 to-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="display-lg font-display text-surface-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {contactPage.contactTitle}
        </motion.h1>
        <motion.p
          className="body-lg text-surface-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {contactPage.contactDescription}
        </motion.p>
      </div>
    </motion.header>
  );
}
