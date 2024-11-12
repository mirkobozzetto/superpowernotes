import { ChevronsDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ScrollIndicatorProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ targetRef }) => {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToTarget = useCallback(() => {
    if (targetRef.current) {
      const targetPosition = targetRef.current.offsetTop - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
      setIsVisible(false);
    }
  }, [targetRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current) {
        const targetPosition = targetRef.current.offsetTop;
        if (window.scrollY >= targetPosition - window.innerHeight) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

  if (!isVisible) return null;

  return (
    <div onMouseEnter={scrollToTarget} className="right-8 bottom-20 z-50 fixed cursor-pointer">
      <button
        onClick={scrollToTarget}
        className="flex justify-center items-center bg-gradient-to-bl from-blue-600/90 hover:from-blue-500/90 to-blue-800/90 hover:to-blue-700/90 shadow-lg backdrop-blur-sm rounded-full w-12 h-12 text-white transition-all duration-300 hover:scale-110 group"
        aria-label="Scroll to target"
      >
        <ChevronsDown className="animate-bounce group-hover:animate-none size-5" />
      </button>
    </div>
  );
};
