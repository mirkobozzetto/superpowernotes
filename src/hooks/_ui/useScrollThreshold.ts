import { useEffect, useState } from "react";

export const useScrollThreshold = (threshold: number) => {
  const [hasPassedThreshold, setHasPassedThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const thresholdPixels = (viewportHeight * threshold) / 100;

      setHasPassedThreshold(scrollPosition > thresholdPixels);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return hasPassedThreshold;
};
