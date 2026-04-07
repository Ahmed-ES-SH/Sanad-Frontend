"use client";
import { useVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React, { ReactNode } from "react";

interface LocaleLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export default function LocalLink({
  children,
  className,
  href,
  onClick,
  target,
  rel,
}: LocaleLinkProps) {
  const { local } = useVariables();
  const formattedHref = `/${local}/${href}`.replace(/\/+/g, "/");
  return (
    <Link 
      href={formattedHref} 
      className={className} 
      onClick={onClick}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
