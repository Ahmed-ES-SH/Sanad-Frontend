/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaShoppingCart,
  FaTimes,
  FaUpload,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import Img from "../../_global/Img";
import FormInput from "./_actionbtns/FormInput";
import { getTranslations } from "@/app/helpers/helpers";
import { useRouter } from "next/navigation";

// Types
interface FormData {
  projectTitle: string;
  projectDescription: string;
  projectDuration: string;
  image: File | null;
}

interface FormErrors {
  projectTitle?: string;
  projectDescription?: string;
  projectDuration?: string;
}

// Dropdown Component
const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}> = ({ label, value, onChange, options, error, required }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-surface-700 font-display">
        {label} {required && <span className="text-accent-rose">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`surface-input w-full ${
          error ? "border-red-500 bg-red-50/50" : ""
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      >
        <option value="">Select duration...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
          id={`${label}-error`}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Image Upload Component
const ImageUpload: React.FC<{
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeImage = () => {
    onImageSelect(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Project Image (Optional)
      </label>

      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <FaUpload className="text-3xl text-gray-400" />
            <span className="text-gray-500">Click to upload an image</span>
            <span className="text-xs text-gray-400">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        </div>
      ) : (
        <div className="relative">
          <Img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
            aria-label="Remove image"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// Success Message Component
const SuccessMessage: React.FC = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-8"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
      className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
    >
      <FaCheck className="text-2xl text-green-600" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Request Submitted!
    </h3>
    <p className="text-gray-600">
      Thank you for your service request. We'll get back to you soon.
    </p>
  </motion.div>
);

// Main Modal Component
const ServiceRequestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  local: "en" | "ar";
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    projectTitle: "",
    projectDescription: "",
    projectDuration: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const durationOptions = [
    { value: "1-7", label: "1-7 days" },
    { value: "1-2", label: "1-2 weeks" },
    { value: "2-4", label: "2-4 weeks" },
    { value: "1-3", label: "1-3 months" },
    { value: "3+", label: "3+ months" },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    }

    if (!formData.projectDuration) {
      newErrors.projectDuration = "Project duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSuccess(true);

    // Reset form
    setFormData({
      projectTitle: "",
      projectDescription: "",
      projectDuration: "",
      image: null,
    });
    setErrors({});

    // Auto close after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999999] bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="surface-card-elevated w-full max-w-2xl max-h-[90vh] relative overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <h2
                id="modal-title"
                className="heading-md text-primary font-display"
              >
                Request Service
              </h2>
              {!isLoading && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {showSuccess ? (
                <SuccessMessage />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput
                    label="Project Title"
                    value={formData.projectTitle}
                    onChange={(value) =>
                      setFormData({ ...formData, projectTitle: value })
                    }
                    error={errors.projectTitle}
                    required
                    placeholder="Enter your project title"
                  />

                  <FormInput
                    label="Project Description"
                    value={formData.projectDescription}
                    onChange={(value) =>
                      setFormData({ ...formData, projectDescription: value })
                    }
                    error={errors.projectDescription}
                    required
                    multiline
                    placeholder="Describe your project requirements"
                  />

                  <FormSelect
                    label="Project Duration"
                    value={formData.projectDuration}
                    onChange={(value) =>
                      setFormData({ ...formData, projectDuration: value })
                    }
                    options={durationOptions}
                    error={errors.projectDuration}
                    required
                  />

                  <ImageUpload
                    onImageSelect={(file) =>
                      setFormData({ ...formData, image: file })
                    }
                    selectedImage={formData.image}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="surface-btn-primary w-full py-4 gap-3"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        Submit Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Component
export default function ActionButtons({
  local = "en",
}: {
  local: "en" | "ar";
}) {
  const router = useRouter();
  const { servicePage } = getTranslations(local);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactSupport = () => {
    // You can implement navigation logic here
    router.push(`/${local}/contact`);
    // For Next.js routing: router.push(`/${local}/contact`);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6 mt-12 mb-8 mx-auto w-fit">
        {/* Request Service Button */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="surface-btn-primary min-w-[200px] gap-3"
        >
          <FaShoppingCart className="text-lg" />
          <span className="font-display">{servicePage.orderService}</span>
        </motion.button>

        {/* Contact Support Button */}
        <motion.button
          onClick={handleContactSupport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="surface-btn-secondary min-w-[200px] gap-3"
        >
          <FaEnvelope className="text-lg" />
          <span className="font-display">{servicePage.contactbtn}</span>
        </motion.button>
      </div>

      {/* Modal */}
      <ServiceRequestModal
        local={local}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
