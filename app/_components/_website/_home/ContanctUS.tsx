"use client";
import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  FaUserAlt,
  FaEnvelope,
  FaPhone,
  FaRegCommentDots,
} from "react-icons/fa";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";

//////////////////////////////////////////////////////
///////  Form field configuration with icon components.
///////  Labels and placeholders come from translations.
//////////////////////////////////////////////////////
const fieldIcons = [
  { id: "name", type: "text" as const, icon: <FaUserAlt /> },
  { id: "email", type: "email" as const, icon: <FaEnvelope /> },
  { id: "phone", type: "tel" as const, icon: <FaPhone /> },
];

export default function ContactUS() {
  const { local } = useVariables();
  const { contactusSection } = getTranslations(local);
  const shouldReduceMotion = useReducedMotion();
  const isRTL = local === "ar";

  const inputVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <section
      id="contactus"
      dir={directionMap[local]}
      className="page-bg relative py-16 lg:py-24"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="c-container">
        <div className="max-w-2xl mb-12">
          <motion.h2
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : isRTL ? 30 : -30,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[2.25rem] lg:text-[3.5rem] font-bold text-surface-900 leading-[1.15] tracking-tight mb-4"
          >
            {contactusSection.contactUs}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[1.125rem] text-surface-600 leading-relaxed"
          >
            {contactusSection.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 surface-card-elevated overflow-hidden border-none shadow-surface-xl">
          {/* Left Image Section */}
          <div className="lg:col-span-2 relative overflow-hidden h-[300px] lg:h-auto">
            <Img
              src="/contact-bg.jpg"
              alt={contactusSection.imageAlt}
              className="w-full h-full object-cover grayscale-20 brightness-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-linear-to-t from-surface-900/60 to-transparent" />
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3 p-6 lg:p-12 relative bg-white/40 backdrop-blur-sm">
            <form className="space-y-6" action="#">
              {/* Name Field */}
              <motion.div
                custom={0}
                variants={inputVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <label
                  className="text-sm font-semibold text-surface-700 ms-1"
                  htmlFor="name"
                >
                  {contactusSection.nameLabel}
                </label>
                <div className="flex items-center surface-input group focus-within:ring-2 focus-within:ring-primary/20">
                  <FaUserAlt className="text-surface-400 me-3 text-lg transition-colors group-focus-within:text-primary" />
                  <input
                    id="name"
                    type="text"
                    placeholder={contactusSection.namePlaceholder}
                    className="w-full bg-transparent text-sm outline-none text-surface-900 placeholder:text-surface-400 h-10"
                    required
                  />
                </div>
              </motion.div>

              {/* Email & Phone Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {fieldIcons
                  .filter((f) => f.id !== "name")
                  .map(({ id, type, icon }, i) => {
                    const labelKey =
                      `${id}Label` as keyof typeof contactusSection;
                    const placeholderKey =
                      `${id}Placeholder` as keyof typeof contactusSection;

                    return (
                      <motion.div
                        key={id}
                        custom={i + 1}
                        variants={inputVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-2"
                      >
                        <label
                          className="text-sm font-semibold text-surface-700 ms-1"
                          htmlFor={id}
                        >
                          {contactusSection[labelKey] as string}
                        </label>
                        <div className="flex items-center surface-input group focus-within:ring-2 focus-within:ring-primary/20">
                          {React.cloneElement(icon, {
                            className:
                              "text-surface-400 me-3 text-lg transition-colors group-focus-within:text-primary",
                          } as React.ComponentProps<typeof FaEnvelope>)}
                          <input
                            id={id}
                            type={type}
                            placeholder={
                              contactusSection[placeholderKey] as string
                            }
                            className="w-full bg-transparent text-sm outline-none text-surface-900 placeholder:text-surface-400 h-10"
                            required
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Message Field */}
              <motion.div
                custom={4}
                variants={inputVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <label
                  className="text-sm font-semibold text-surface-700 ms-1"
                  htmlFor="message"
                >
                  {contactusSection.messageLabel}
                </label>
                <div className="flex items-start surface-input group focus-within:ring-2 focus-within:ring-primary/20 pt-4">
                  <FaRegCommentDots className="text-surface-400 me-3 mt-1 text-lg transition-colors group-focus-within:text-primary" />
                  <textarea
                    id="message"
                    placeholder={contactusSection.messagePlaceholder}
                    className="w-full h-32 bg-transparent text-sm resize-none outline-none text-surface-900 placeholder:text-surface-400"
                    required
                  ></textarea>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                custom={5}
                variants={inputVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="pt-4"
              >
                <button
                  type="submit"
                  className="surface-btn-primary px-10 h-12 w-full sm:w-fit"
                >
                  {contactusSection.sendMessage}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
