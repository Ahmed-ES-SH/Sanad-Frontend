"use client";
import { useVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useCallback } from "react";

interface LocaleLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  target?: string;
}

export default function LocaleLink({
  children,
  className,
  target,
  href,
}: LocaleLinkProps) {
  const { local } = useVariables();
  const searchParams = useSearchParams();

  const getFormattedHref = useCallback(() => {
    const [pathname, queryString] = href.split("?");
    const newParams = new URLSearchParams(queryString || "");

    searchParams.forEach((value, key) => {
      if (!newParams.has(key)) {
        newParams.set(key, value);
      }
    });

    const localePath = `/${local}/${pathname}`.replace(/\/+/g, "/");
    const finalQueryString = newParams.toString();

    return finalQueryString ? `${localePath}?${finalQueryString}` : localePath;
  }, [href, local, searchParams]);

  const handleClick = () => {
    // Scroll to top when navigating to new page
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <Link
      href={getFormattedHref()}
      target={target}
      className={`${className} block outline-none`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
