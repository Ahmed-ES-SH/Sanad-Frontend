"use client";
import React from "react";
import { easeOut, motion } from "framer-motion";
import { FiTarget, FiSettings, FiTrendingUp } from "react-icons/fi";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";

interface WorkStep {
  number: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: React.ReactNode;
}

export default function HowWeWork() {
  const { local } = useVariables();
  const { howWeWork } = getTranslations(local);

  const workSteps: WorkStep[] = [
    {
      number: "1",
      title: {
        en: "Understand Your Needs",
        ar: "فهم احتياجاتك",
      },
      description: {
        en: "We begin every project by carefully understanding your unique business goals, challenges, and audience. This deep discovery process ensures we create a solution that's not only relevant but also built around your specific needs and expectations.",
        ar: "نبدأ كل مشروع بفهم دقيق لأهدافك التجارية الفريدة، وتحدياتك، وجمهورك المستهدف. تضمن هذه المرحلة من الاكتشاف العميق إنشاء حل مناسب ومصمم خصيصًا لتلبية احتياجاتك وتوقعاتك.",
      },
      icon: <FiTarget className="w-8 h-8 text-primary-blue" />,
    },
    {
      number: "2",
      title: {
        en: "Design Tailored Solutions",
        ar: "تصميم حلول مخصصة",
      },
      description: {
        en: "Our team transforms insights into strategic, creative, and scalable solutions. Every element is customized to align with your vision, ensuring the final product is both impactful and functional—designed to solve real problems and deliver measurable results.",
        ar: "يقوم فريقنا بتحويل الرؤى إلى حلول استراتيجية وإبداعية وقابلة للتوسع. يتم تخصيص كل عنصر ليتماشى مع رؤيتك، مما يضمن أن يكون المنتج النهائي مؤثرًا وفعالًا، ومصممًا لحل المشكلات الحقيقية وتحقيق نتائج قابلة للقياس.",
      },
      icon: <FiSettings className="w-8 h-8 text-primary-blue" />,
    },
    {
      number: "3",
      title: {
        en: "Deliver And Support",
        ar: "التسليم والدعم",
      },
      description: {
        en: "We focus on delivering high-quality, on-time results with a seamless process. Post-launch, we remain committed through ongoing support, improvements, and optimization—ensuring your investment continues to perform and adapt to evolving business needs.",
        ar: "نركز على تقديم نتائج عالية الجودة وفي الوقت المحدد من خلال عملية سلسة. بعد الإطلاق، نظل ملتزمين بالدعم المستمر، والتحسينات، والتطوير لضمان استمرار أداء استثمارك وتكيفه مع الاحتياجات المتغيرة للأعمال.",
      },
      icon: <FiTrendingUp className="w-8 h-8 text-primary-blue" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <div
      dir={directionMap[local]}
      className="min-h-screen bg-linear-to-br from-gray-50 to-white"
    >
      <div className="c-container ">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Image and title */}
          <motion.div className="relative h-full" variants={imageVariants}>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-full">
              <Img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Business professionals collaborating"
                className="w-full h-full max-lg:h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* How We Work badge */}
              <motion.div
                className="absolute top-6 left-6 bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {howWeWork.sectionTitle}
              </motion.div>

              {/* Title overlay */}
              <div className="absolute bottom-8 left-6 right-6">
                <motion.h1
                  className="text-4xl lg:text-5xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {howWeWork.sectionSubtitle}
                </motion.h1>
              </div>
            </div>
          </motion.div>

          {/* Right side - Steps */}
          <motion.div className="space-y-8" variants={containerVariants}>
            {workSteps.map((step) => (
              <motion.div
                key={step.number}
                className="group"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-linear-to-r from-sky-50 to-sky-100/50 p-8 rounded-2xl border border-sky-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start max-lg:flex-col gap-6">
                    {/* Number */}
                    <motion.div
                      className="shrink-0"
                      variants={numberVariants}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-16 h-16 bg-linear-to-br from-primary-blue to-sky-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {step.icon}
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-blue transition-colors">
                          {step.title[local]}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description[local]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
