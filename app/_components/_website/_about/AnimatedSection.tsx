"use client";
import React, { ReactNode, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function AnimatedSection({ children, className = "" }: Props) {
  const controls = useAnimation();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hidden: { opacity: 0, y: 50 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
