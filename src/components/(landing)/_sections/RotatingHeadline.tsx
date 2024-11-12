"use client";

import { cn } from "@chadcn/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const RotatingHeadline = ({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === phrases.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <div className={cn("relative h-24 md:h-32 lg:h-40 w-full", className)}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="absolute inset-0 bg-clip-text bg-gradient-to-r from-blue-950 to-blue-800 font-extrabold text-2xl text-center text-transparent md:text-4xl lg:text-6xl"
        >
          {phrases[currentIndex]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
