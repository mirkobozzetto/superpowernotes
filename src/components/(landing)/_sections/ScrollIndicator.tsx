"use client";

import { ChevronsDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ScrollIndicatorProps = {
  targetRef: React.RefObject<HTMLDivElement>;
};

export const ScrollIndicator = ({ targetRef }: ScrollIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const performSmoothScroll = useCallback((endPosition: number, duration: number = 2000) => {
    const start = window.scrollY;
    const startTime = performance.now();
    const distance = endPosition - start;

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const t = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;

      window.scrollTo(0, start + distance * t);
      progress < 1 && requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }, []);

  const initiateScrollSequence = useCallback(() => {
    if (!targetRef.current) return;

    const targetPosition = targetRef.current.offsetTop - 20;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
    setIsVisible(false);

    setTimeout(() => {
      const bottomPosition = document.documentElement.scrollHeight - window.innerHeight;
      performSmoothScroll(bottomPosition);
    }, 500);
  }, [targetRef, performSmoothScroll]);

  useEffect(() => {
    const checkScroll = () => {
      if (!targetRef.current) return;

      const isAtBottom =
        Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      const targetVisible = window.scrollY < targetRef.current.offsetTop - window.innerHeight;

      setIsVisible(!isAtBottom && targetVisible);
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [targetRef]);

  if (!isVisible) return null;

  return (
    <div
      onMouseEnter={initiateScrollSequence}
      className="right-8 bottom-20 z-50 fixed cursor-pointer"
    >
      <button
        onClick={initiateScrollSequence}
        className="flex justify-center items-center bg-gradient-to-bl from-blue-600/90 hover:from-blue-500/90 to-blue-800/90 hover:to-blue-700/90 shadow-lg backdrop-blur-sm rounded-full w-12 h-12 text-white transition-all duration-300 hover:scale-110 group"
        aria-label="Scroll to target"
      >
        <ChevronsDown className="animate-bounce group-hover:animate-none size-5" />
      </button>
    </div>
  );
};
