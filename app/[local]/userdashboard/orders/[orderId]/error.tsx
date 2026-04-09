"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion } from "framer-motion";
import { FiAlertCircle, FiRefreshCw, FiHome } from "react-icons/fi";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OrderTrackingError({ error, reset }: ErrorProps) {
  const { local } = useVariables();
  
  // Determine error message based on error type
  const getErrorMessage = () => {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return local === "ar" 
        ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت."
        : "Unable to connect to the server. Please check your internet connection.";
    }
    if (error.message.includes("404") || error.message.includes("not found")) {
      return local === "ar"
        ? "الطلب غير موجود أو تم حذفه."
        : "Order not found or has been removed.";
    }
    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return local === "ar"
        ? "يرجى تسجيل الدخول مرة أخرى للوصول إلى هذا الطلب."
        : "Please log in again to access this order.";
    }
    // Default message
    return local === "ar"
      ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      : "An unexpected error occurred. Please try again.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <FiAlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-on-surface text-center mb-3">
          {local === "ar" ? "عذراً، حدث خطأ" : "Something went wrong"}
        </h1>

        {/* Error Message */}
        <p className="text-on-surface-variant text-center mb-8 leading-relaxed">
          {getErrorMessage()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            {local === "ar" ? "حاول مرة أخرى" : "Try again"}
          </button>
          
          <a
            href={local === "ar" ? "/ar/userdashboard/orders" : "/en/userdashboard/orders"}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-lowest text-on-surface rounded-lg font-medium hover:bg-surface-bright transition-colors ring-1 ring-outline-variant/15"
          >
            <FiHome className="w-4 h-4" />
            {local === "ar" ? "العودة للطلبات" : "Back to Orders"}
          </a>
        </div>

        {/* Error Reference */}
        {error.digest && (
          <p className="text-xs text-on-surface-variant/60 text-center mt-6">
            {local === "ar" ? `المرجع: ${error.digest}` : `Reference: ${error.digest}`}
          </p>
        )}
      </motion.div>
    </div>
  );
}