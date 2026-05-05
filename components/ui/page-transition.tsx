"use client";

/**
 * PageTransition - Consistent page load animations wrapper
 * Provides standardized enter/exit animations for all pages
 */

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import {
  pageVariants,
  celebrationPageVariants,
  heroVariants,
  fadeVariants,
} from "@/lib/animations/variants";
import { REDUCED_MOTION_CONFIG } from "@/lib/animations/config";

export type PageTransitionVariant = "default" | "celebration" | "hero" | "fade";

interface PageTransitionProps {
  children: ReactNode;
  variant?: PageTransitionVariant;
  className?: string;
  /**
   * Unique key for page transitions - should change when navigating between pages
   * If not provided, will use pathname from useRouter
   */
  pageKey?: string;
  /**
   * Disable animations (useful for testing or user preference)
   */
  disableAnimation?: boolean;
}

export function PageTransition({
  children,
  variant = "default",
  className = "",
  pageKey,
  disableAnimation = false,
}: PageTransitionProps) {
  // Get the appropriate variants based on the variant prop
  const getVariants = () => {
    switch (variant) {
      case "celebration":
        return celebrationPageVariants;
      case "hero":
        return heroVariants;
      case "fade":
        return fadeVariants;
      default:
        return pageVariants;
    }
  };

  const variants = getVariants();

  // If animations are disabled, return children without motion
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={pageKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
      // Respect user's reduced motion preference
      transition={{
        ...variants.animate?.transition,
        duration: window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
          ? REDUCED_MOTION_CONFIG.duration
          : variants.animate?.transition?.duration,
        ease: window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
          ? REDUCED_MOTION_CONFIG.ease
          : variants.animate?.transition?.ease,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Specialized page transitions for common use cases
 */

export function DefaultPageTransition({ children, className, pageKey }: Omit<PageTransitionProps, "variant">) {
  return (
    <PageTransition variant="default" className={className} pageKey={pageKey}>
      {children}
    </PageTransition>
  );
}

export function CelebrationPageTransition({ children, className, pageKey }: Omit<PageTransitionProps, "variant">) {
  return (
    <PageTransition variant="celebration" className={className} pageKey={pageKey}>
      {children}
    </PageTransition>
  );
}

export function HeroPageTransition({ children, className, pageKey }: Omit<PageTransitionProps, "variant">) {
  return (
    <PageTransition variant="hero" className={className} pageKey={pageKey}>
      {children}
    </PageTransition>
  );
}

export function FadePageTransition({ children, className, pageKey }: Omit<PageTransitionProps, "variant">) {
  return (
    <PageTransition variant="fade" className={className} pageKey={pageKey}>
      {children}
    </PageTransition>
  );
}