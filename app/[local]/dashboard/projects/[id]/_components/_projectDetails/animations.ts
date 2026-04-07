"use client";

import { Variants } from "framer-motion";

// Stagger delays for page load animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1], // ease-out-quart
    },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Hover micro-interactions
export const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

// Button click animation
export const buttonTap = {
  whileTap: { scale: 0.95, transition: { duration: 0.1 } },
};

// Reduced motion variants
export const reducedMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};