"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";

interface ContactInfo {
  icon: React.ReactNode;
  title: { en: string; ar: string };
  details: string[];
}

interface infoCardType {
  info: ContactInfo;
  index: number;
}

// Contact Info Data
const contactInfo: ContactInfo[] = [
  {
    icon: <FiPhone className="w-6 h-6" />,
    title: { en: "Phone", ar: "الهاتف" },
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  },
  {
    icon: <FiMail className="w-6 h-6" />,
    title: { en: "Email", ar: "البريد الإلكتروني" },
    details: ["hello@company.com", "support@company.com"],
  },
  {
    icon: <FiMapPin className="w-6 h-6" />,
    title: { en: "Office", ar: "المكتب" },
    details: ["123 Business Street", "Suite 100, City, ST 12345"],
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    title: { en: "Hours", ar: "ساعات العمل" },
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Weekend: By Appointment"],
  },
];

// Contact Info Component
function ContactInfoCard({ info, index }: infoCardType) {
  const { local } = useVariables();
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-surface-sm hover:shadow-surface-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary shadow-sm">
          {info.icon}
        </div>
        <div>
          <h3 className="heading-sm font-display text-surface-900 mb-2">
            {info.title[local]}
          </h3>
          <div className="space-y-1">
            {info.details.map((detail, idx) => (
              <p key={idx} className="body-sm text-surface-600">
                {detail}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContactInfo() {
  const { local } = useVariables();
  const { contactPage } = getTranslations(local);
  return (
    <motion.div
      dir={directionMap[local]}
      className="space-y-8"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="mb-10">
        <h2 className="heading-lg font-display text-surface-900 mb-3">
          {contactPage.contactTitle}
        </h2>
        <p className="body text-surface-600">{contactPage.contactHelperText}</p>
      </div>

      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <ContactInfoCard
            key={`${info} + ${index}`}
            info={info}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
