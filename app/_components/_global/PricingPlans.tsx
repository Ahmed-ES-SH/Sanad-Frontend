"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { FiCheck, FiStar } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";

interface PricingFeature {
  name: { en: string; ar: string };
  included: boolean;
}

interface PricingPlan {
  name: { en: string; ar: string };
  monthlyPrice: number;
  yearlyPrice: number;
  description: { en: string; ar: string };
  isPopular?: boolean;
  features: PricingFeature[];
  buttonText: { en: string; ar: string };
}

export default function PricingPlans() {
  const { local } = useVariables();
  const { pricing } = getTranslations(local);
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const plans: PricingPlan[] = [
    {
      name: {
        en: "Basic Plan",
        ar: "الخطة الأساسية",
      },
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: {
        en: "Perfect for growing businesses with moderate IT needs",
        ar: "مثالية للشركات المتنامية ذات الاحتياجات التقنية المتوسطة",
      },
      features: [
        {
          name: { en: "Software installation", ar: "تثبيت البرامج" },
          included: true,
        },
        {
          name: {
            en: "Basic troubleshooting",
            ar: "استكشاف الأخطاء وإصلاحها الأساسية",
          },
          included: true,
        },
        { name: { en: "Remote support", ar: "دعم عن بُعد" }, included: true },
        {
          name: { en: "Essential IT support", ar: "دعم تقني أساسي" },
          included: true,
        },
      ],
      buttonText: {
        en: "Get Started",
        ar: "ابدأ الآن",
      },
    },
    {
      name: {
        en: "Business Plan",
        ar: "خطة الأعمال",
      },
      monthlyPrice: 399,
      yearlyPrice: 3990,
      description: {
        en: "Perfect for growing businesses with moderate IT needs",
        ar: "مثالية للشركات المتنامية ذات الاحتياجات التقنية المتوسطة",
      },
      isPopular: true,
      features: [
        {
          name: { en: "Software installation", ar: "تثبيت البرامج" },
          included: true,
        },
        {
          name: {
            en: "Basic troubleshooting",
            ar: "استكشاف الأخطاء وإصلاحها الأساسية",
          },
          included: true,
        },
        { name: { en: "Remote support", ar: "دعم عن بُعد" }, included: true },
        {
          name: { en: "Essential IT support", ar: "دعم تقني أساسي" },
          included: true,
        },
      ],
      buttonText: {
        en: "Get Started",
        ar: "ابدأ الآن",
      },
    },
    {
      name: {
        en: "Enterprise Plan",
        ar: "خطة المؤسسات",
      },
      monthlyPrice: 199,
      yearlyPrice: 1990,
      description: {
        en: "Perfect for growing businesses with moderate IT needs",
        ar: "مثالية للشركات المتنامية ذات الاحتياجات التقنية المتوسطة",
      },
      features: [
        {
          name: { en: "Software installation", ar: "تثبيت البرامج" },
          included: true,
        },
        {
          name: {
            en: "Basic troubleshooting",
            ar: "استكشاف الأخطاء وإصلاحها الأساسية",
          },
          included: true,
        },
        { name: { en: "Remote support", ar: "دعم عن بُعد" }, included: true },
        {
          name: { en: "Essential IT support", ar: "دعم تقني أساسي" },
          included: true,
        },
      ],
      buttonText: {
        en: "Get Started",
        ar: "ابدأ الآن",
      },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const priceVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  return (
    <div dir={directionMap[local]} className="min-h-screen   px-6">
      <div className="c-container border-t border-gray-200 py-2">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block bg-primary-blue text-white px-6 py-2 rounded-full text-sm font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {pricing.title}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl lg:text-5xl font-bold text-primary-red underline mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {pricing.subtitle}
          </motion.h1>

          {/* Toggle Switch */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span
              className={`text-lg font-medium transition-colors ${
                !isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {pricing.monthly}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 bg-primary-blue rounded-full p-1 transition-colors"
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isYearly ? (local == "en" ? 32 : -32) : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
            <span
              className={`text-lg font-medium transition-colors ${
                isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {pricing.yearly}
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name[local]}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-3xl p-8 border-2 transition-all duration-300 ${
                plan.isPopular
                  ? "bg-primary-blue border-primary-blue text-white shadow-2xl"
                  : "bg-white border-gray-200 hover:border-primary-blue shadow-lg hover:shadow-xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <FiStar className="w-4 h-4" />
                    {pricing.popular}
                  </div>
                </motion.div>
              )}

              {/* Plan Name */}
              <h3
                className={`text-2xl font-bold mb-6 ${
                  plan.isPopular ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name[local]}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isYearly ? "yearly" : "monthly"}
                    variants={priceVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex items-baseline gap-2"
                  >
                    <span
                      className={`text-5xl font-bold ${
                        plan.isPopular ? "text-white" : "text-primary-blue"
                      }`}
                    >
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span
                      className={`text-lg ${
                        plan.isPopular ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {pricing.per} {isYearly ? pricing.year : pricing.month}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description */}
              <p
                className={`mb-8 leading-relaxed ${
                  plan.isPopular ? "text-white" : "text-gray-600"
                }`}
              >
                {plan.description[local]}
              </p>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 mb-8 ${
                  plan.isPopular
                    ? "bg-white text-primary-blue hover:bg-gray-50 shadow-lg"
                    : "bg-primary-blue text-white hover:bg-primary-blue shadow-lg hover:shadow-xl"
                }`}
              >
                {plan.buttonText[local]}
              </motion.button>

              {/* Features */}
              <div>
                <h4
                  className={`font-bold text-lg mb-4 ${
                    plan.isPopular ? "text-white" : "text-gray-900"
                  }`}
                >
                  {pricing.features}
                </h4>
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.name[local]}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 * featureIndex + 0.6,
                        duration: 0.4,
                      }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          plan.isPopular ? "bg-green-400" : "bg-green-100"
                        }`}
                      >
                        <FiCheck
                          className={`w-4 h-4 ${
                            plan.isPopular ? "text-green-900" : "text-green-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`${
                          plan.isPopular ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {feature.name[local]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
