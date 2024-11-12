"use client";

import { useRef } from "react";
import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
import { ScrollIndicator } from "./_sections/ScrollIndicator";

const YouTubeVideo = () => {
  return (
    <div className="relative mx-auto pt-[28.125%] w-1/2 max-w-2xl">
      <iframe
        className="top-0 left-0 absolute w-full h-full"
        src="https://www.youtube.com/embed/-3nD2ejroFk?si=L8uEDHWRD26ktrnz"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export const Onboarding: React.FC = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-16">
      <div className="mt-10 px-4 min-h-[200px]">
        <YouTubeVideo />
      </div>
      <div className="mt-32 min-h-[200px]" ref={ctaRef}>
        <LandingCTA />
      </div>
      <div className="min-h-[200px]">
        <LandingFeatures />
      </div>
      <ScrollIndicator targetRef={ctaRef} />
    </div>
  );
};
