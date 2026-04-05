"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { getTranslations } from "@/app/helpers/helpers";

interface TargetAudienceProps {
  audience: {
    en: string;
    ar: string;
  };

  local: "en" | "ar";
}

export default function TargetAudience({
  audience,
  local,
}: TargetAudienceProps) {
  const { servicePage } = getTranslations(local);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="surface-card p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-violet/10">
          <FaUsers className="text-accent-violet text-xl" />
        </div>
        <h3 className="heading-sm text-primary font-display">
          {servicePage.targetAudience}
        </h3>
      </div>
      <p className="text-surface-600 body-lg pl-14">
        {audience[local]}
      </p>
    </motion.div>
  );
}
