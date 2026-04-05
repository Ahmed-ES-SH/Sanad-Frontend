"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiShoppingCart, FiX, FiLoader } from "react-icons/fi";
import { ServicePackage } from "@/app/constants/servicesData";
import { useRouter } from "next/navigation";

interface ServiceOrderCTAProps {
  packages?: ServicePackage[];
  local: "en" | "ar";
  translations: Record<string, string>;
  serviceTitle: { en: string; ar: string };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectDescription: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  projectDescription?: string;
}

export default function ServiceOrderCTA({ packages, local, translations, serviceTitle }: ServiceOrderCTAProps) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    projectDescription: "",
    image: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOrderClick = (packageIndex: number) => {
    setSelectedPackage(packageIndex);
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = local === "en" ? "Name is required" : "الاسم مطلوب";
    if (!formData.email.trim()) newErrors.email = local === "en" ? "Email is required" : "البريد مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = local === "en" ? "Invalid email" : "بريد غير صالح";
    if (!formData.projectDescription.trim()) newErrors.projectDescription = local === "en" ? "Description is required" : "الوصف مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "", projectDescription: "", image: null });
      setErrors({});
    }, 2500);
  };

  if (!packages || packages.length === 0) {
    return (
      <section id="order-section" className="c-container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-card-elevated p-12 text-center"
        >
          <h2 className="display-sm text-surface-900 font-display mb-4">
            {translations.orderService}
          </h2>
          <p className="body-lg text-surface-500 mb-8">
            {local === "en" ? "Contact us to discuss your project requirements" : "تواصل معنا لمناقشة متطلبات مشروعك"}
          </p>
          <button
            onClick={() => router.push(`/${local}/contact`)}
            className="surface-btn-primary inline-flex items-center gap-3"
          >
            <FiShoppingCart />
            <span>{translations.contactbtn}</span>
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="order-section" className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-surface-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-amber/10" />
      
      <div className="relative c-container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-primary to-accent-amber" />
            <span className="caption-xs font-semibold text-primary uppercase tracking-wider">
              {translations.choosePackage}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-primary to-accent-amber" />
          </div>
          <h2 className="display-sm md:display-md text-white font-display mb-4">
            {local === "en" ? "Choose Your Plan" : "اختر خطتك"}
          </h2>
          <p className="body-lg text-surface-400 max-w-2xl mx-auto">
            {translations.packageDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                pkg.isPopular
                  ? "bg-gradient-primary text-white shadow-2xl scale-105 z-10"
                  : "surface-card hover:shadow-surface-md"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-surface-900 text-white text-xs font-semibold uppercase tracking-wider">
                    {translations.popular}
                  </span>
                </div>
              )}

              <h3 className={`heading-lg font-display mb-2 ${pkg.isPopular ? "text-white" : "text-surface-900"}`}>
                {pkg.name[local]}
              </h3>
              <div className="mb-6">
                <span className={`display-sm font-display ${pkg.isPopular ? "text-white" : "text-primary"}`}>
                  {pkg.price[local]}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features[local].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      pkg.isPopular ? "bg-white/20" : "bg-primary/10"
                    }`}>
                      <FiCheck className={`text-xs ${pkg.isPopular ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className={`body-sm ${pkg.isPopular ? "text-white/90" : "text-surface-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleOrderClick(index)}
                className={`w-full py-3.5 rounded-xl font-display transition-all duration-300 ${
                  pkg.isPopular
                    ? "bg-white text-primary hover:bg-surface-50"
                    : "surface-btn-primary"
                }`}
              >
                {translations.getStarted}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="surface-card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isSuccess ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6"
                  >
                    <FiCheck className="text-4xl text-white" />
                  </motion.div>
                  <h3 className="heading-lg text-surface-900 font-display mb-2">
                    {local === "en" ? "Request Submitted!" : "تم إرسال الطلب!"}
                  </h3>
                  <p className="body-lg text-surface-500">
                    {local === "en" ? "We'll contact you within 24 hours." : "سنتواصل معك خلال 24 ساعة."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-surface-200">
                    <div>
                      <h3 className="heading-md text-surface-900 font-display">
                        {local === "en" ? "Order Service" : "طلب الخدمة"}
                      </h3>
                      {selectedPackage !== null && (
                        <p className="body-sm text-primary mt-1">
                          {packages[selectedPackage]?.name[local]} — {packages[selectedPackage]?.price[local]}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors"
                    >
                      <FiX className="text-surface-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Full Name" : "الاسم الكامل"} <span className="text-accent-rose">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`surface-input w-full ${errors.name ? "border-accent-rose" : ""}`}
                        placeholder={local === "en" ? "Your name" : "اسمك"}
                      />
                      {errors.name && <p className="text-accent-rose text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Email" : "البريد الإلكتروني"} <span className="text-accent-rose">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`surface-input w-full ${errors.email ? "border-accent-rose" : ""}`}
                        placeholder={local === "en" ? "your@email.com" : "بريدك@الإلكتروني.com"}
                      />
                      {errors.email && <p className="text-accent-rose text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Phone (Optional)" : "الهاتف (اختياري)"}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="surface-input w-full"
                        placeholder={local === "en" ? "+966 5XX XXX XXX" : "+966 5XX XXX XXX"}
                      />
                    </div>

                    <div>
                      <label className="block body-sm font-medium text-surface-700 mb-2">
                        {local === "en" ? "Project Description" : "وصف المشروع"} <span className="text-accent-rose">*</span>
                      </label>
                      <textarea
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        rows={4}
                        className={`surface-input w-full resize-none ${errors.projectDescription ? "border-accent-rose" : ""}`}
                        placeholder={local === "en" ? "Tell us about your project..." : "أخبرنا عن مشروعك..."}
                      />
                      {errors.projectDescription && <p className="text-accent-rose text-sm mt-1">{errors.projectDescription}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="surface-btn-primary w-full py-4 gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>{local === "en" ? "Submitting..." : "جاري الإرسال..."}</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart />
                          <span>{translations.getStarted}</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
