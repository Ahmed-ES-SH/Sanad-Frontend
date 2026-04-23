"use client";

import React, { useEffect } from "react";

/**
 * AccessibleToasts
 * Small accessibility layer that mirrors visible toast content into
 * an aria-live region so screen readers announce transient toast messages.
 *
 * This file intentionally does not modify toast logic or behavior — it
 * observes the DOM for status elements (toaster output) and copies the
 * text into a hidden aria-live region. This is a non-invasive accessibility
 * enhancement.
 */
const AccessibleToasts: React.FC = () => {
  useEffect(() => {
    // Ensure a dedicated live region exists
    let live = document.getElementById("sanad-toast-live");
    if (!live) {
      live = document.createElement("div");
      live.id = "sanad-toast-live";
      live.setAttribute("aria-live", "polite");
      // Tailwind's sr-only class is used in this project for visually-hidden text
      live.className = "sr-only";
      document.body.appendChild(live);
    }

    // Observe DOM mutations and mirror any visible status text into the live region.
    const observer = new MutationObserver(() => {
      try {
        // Prefer elements with role="status" (common for toasts) and fall back to
        // any recently added text nodes inside the body.
        const statusEls = Array.from(document.querySelectorAll<HTMLElement>("[role=\"status\"], [data-sonner]"));
        if (statusEls.length > 0) {
          const last = statusEls[statusEls.length - 1];
          const text = last.innerText || last.textContent || "";
          // Update live region only when text exists to avoid excessive announcements
          if (text && live) {
            // Replace content to trigger announcement in most screen readers
            live.textContent = "";
            // Small timeout ensures DOM update is registered as a change
            setTimeout(() => {
              if (live) live!.textContent = text;
            }, 50);
          }
        }
      } catch (e) {
        // Swallow errors; this is a non-critical accessibility enhancement
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      // keep live region in DOM (non-destructive) — do not remove it to avoid side effects
    };
  }, []);

  return null;
};

export default AccessibleToasts;
