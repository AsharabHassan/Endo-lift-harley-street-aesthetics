"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ScreenWrapperProps {
  children: React.ReactNode;
  screenKey: string;
}

export function ScreenWrapper({ children, screenKey }: ScreenWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="min-h-screen w-full max-w-md mx-auto px-6 py-10 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
