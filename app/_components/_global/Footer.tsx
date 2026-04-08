"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCheck,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { useState } from "react";
import Img from "./Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "./LocalLink";
import { usePathname } from "next/navigation";

//////////////////////////////////////////////////////
///////  Social media icon configuration with their
///////  respective translation keys for accessibility labels.
//////////////////////////////////////////////////////
const socialIcons = [
  { icon: <FaFacebookF className="size-5" />, translationKey: "facebook" },
  { icon: <FaInstagram className="size-5" />, translationKey: "instagram" },
  { icon: <FaTwitter className="size-5" />, translationKey: "twitter" },
  { icon: <FaLinkedinIn className="size-5" />, translationKey: "linkedIn" },
];

//////////////////////////////////////////////////////
///////  Ordered list of footer section keys to maintain
///////  consistent rendering order across locales.
//////////////////////////////////////////////////////
const sectionOrder = [
  "services",
  "company",
  "helpfulLinks",
  "legal",
  "downloads",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function Footer() {
  const { local } = useVariables();
  const { footerLines } = getTranslations(local);

  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (pathname.includes(`/${local}/dashboard`)) return null;

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setFormState("error");
      setErrorMessage("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setFormState("error");
      setErrorMessage(
        "Please enter a valid email address",
      );
      return;
    }

    setFormState("loading");

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormState("success");
      setEmail("");
    } catch {
      setFormState("error");
      setErrorMessage(
        "Something went wrong. Please try again.",
      );
    }
  };

  const isRtl = local === "ar";
  const currentYear = new Date().getFullYear();

  return (
    <footer
      dir={directionMap[local]}
      className="w-full bg-stone-900 border-t border-stone-800"
    >
      {/* Newsletter Section */}
      <div className="c-container py-8">
        <div className="xl:w-[90%] xl:mx-auto">
          <div className="max-lg:flex-col max-lg:items-start max-lg:gap-6 flex items-start justify-between gap-8">
            {/* Brand Section */}
            <div className="flex items-start gap-3 max-lg:w-full">
              <div className="text-orange-500 shrink-0">
                <Img
                  src="/sanad-logo.png"
                  className="w-16 object-contain"
                  alt="Sanad"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-stone-100">
                  {footerLines.heading}
                </h2>
                <p className="mt-3 text-stone-400 max-w-md">
                  {footerLines.description}
                </p>
              </div>
            </div>

            {/* Email Subscription */}
            <form
              onSubmit={handleSubscribe}
              className="w-full max-lg:w-full lg:w-auto"
              noValidate
            >
              <div className="flex items-center max-lg:flex-col max-lg:gap-3 max-lg:items-stretch">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="email"
                    id="UserEmail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formState === "error") {
                        setFormState("idle");
                        setErrorMessage("");
                      }
                    }}
                    placeholder={footerLines.emailPlaceholder}
                    name="email"
                    autoComplete="email"
                    aria-invalid={formState === "error"}
                    aria-describedby={
                      formState === "error" ? "email-error" : undefined
                    }
                    className={`w-full h-[48px] px-4 text-sm outline-none transition-colors duration-200 bg-stone-100 text-stone-900 placeholder:text-stone-500 border-2 ${
                      formState === "error"
                        ? "border-rose-500"
                        : formState === "success"
                          ? "border-emerald-500"
                          : "border-stone-100 focus:border-orange-500"
                    } ${
                      isRtl
                        ? "lg:rounded-r-md"
                        : "lg:rounded-l-md"
                    }`}
                    disabled={formState === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className={`h-[48px] px-6 text-sm font-bold uppercase tracking-wide text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ${
                    isRtl
                      ? "lg:rounded-l-md"
                      : "lg:rounded-r-md"
                  } max-lg:rounded-md`}
                >
                  {formState === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      <span>{footerLines.subscribeButton}</span>
                    </span>
                  ) : formState === "success" ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaCheck />
                      <span>
                        {"Subscribed!"}
                      </span>
                    </span>
                  ) : (
                    footerLines.subscribeButton
                  )}
                </button>
              </div>
              {formState === "error" && errorMessage && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-rose-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <FaExclamationCircle className="shrink-0" />
                  <span>{errorMessage}</span>
                </p>
              )}
              {formState === "success" && (
                <p
                  className="mt-2 text-sm text-emerald-400 flex items-center gap-1.5"
                  role="status"
                >
                  <FaCheck className="shrink-0" />
                  <span>
                    {"Successfully subscribed!"}
                  </span>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="c-container pt-8 pb-6">
        <div className="xl:w-[90%] xl:mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
            {sectionOrder.map((sectionKey) => {
              const section =
                footerLines.sections[
                  sectionKey as keyof typeof footerLines.sections
                ];

              if (!section) return null;

              return (
                <div key={sectionKey}>
                  <p className="text-sm font-semibold text-stone-200 uppercase tracking-wider">
                    {section.title}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {Object.entries(section.links).map(
                      ([linkKey, linkText]) => (
                        <li key={linkKey}>
                          <LocalLink
                            href="#"
                            className="text-sm text-stone-400 hover:text-orange-400 transition-colors duration-200"
                          >
                            {linkText as string}
                          </LocalLink>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Social Icons */}
          <div className="mt-10 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <ul className="flex items-center gap-5">
              {socialIcons.map(({ icon, translationKey }, idx) => (
                <li key={idx}>
                  <LocalLink
                    href="#"
                    className="flex items-center justify-center w-10 h-10 rounded-full text-stone-400 hover:text-orange-400 hover:bg-stone-800 transition-all duration-200 hover:scale-105"
                    aria-label={
                      footerLines.socialMedia[
                        translationKey as keyof typeof footerLines.socialMedia
                      ]
                    }
                  >
                    {icon}
                  </LocalLink>
                </li>
              ))}
            </ul>

            {/* Copyright */}
            <p className="text-sm text-stone-500">
              {`© ${currentYear} Sanad. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
