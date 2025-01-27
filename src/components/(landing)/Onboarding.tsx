"use client";

import { useRef } from "react";
import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
export const Onboarding = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-16">
      <div className="min-h-[200px]" ref={ctaRef}>
        <LandingCTA />
      </div>
      <div className="min-h-[200px]">
        <LandingFeatures />
      </div>

      <div className="mb-8 px-4">
        {/* <YouTubeModal videoId="-3nD2ejroFk" className="mx-auto max-w-3xl" /> */}
      </div>
      {/* <ScrollIndicator targetRef={ctaRef} /> */}
    </div>
  );
};
