import { ChevronsDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      if (bottom) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div onMouseEnter={scrollToBottom} className="right-8 bottom-20 z-50 fixed cursor-pointer">
      <button
        onClick={scrollToBottom}
        className="flex justify-center items-center bg-gradient-to-bl from-blue-600/90 hover:from-blue-500/90 to-blue-800/90 hover:to-blue-700/90 shadow-lg backdrop-blur-sm rounded-full w-12 h-12 text-white transition-all duration-300 hover:scale-110 group"
        aria-label="Scroll to bottom"
      >
        <ChevronsDown className="animate-bounce group-hover:animate-none size-5" />
      </button>
    </div>
  );
};
