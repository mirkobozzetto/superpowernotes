"use client";

import { useRef } from "react";
import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
import { ScrollIndicator } from "./_sections/ScrollIndicator";
import { YouTubeModal } from "./_sections/YouTubeModal";
export const Onboarding = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-16">
      <div className="mt-10 px-4 min-h-[200px]">
        <YouTubeModal videoId="-3nD2ejroFk" className="mx-auto max-w-3xl" />
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
