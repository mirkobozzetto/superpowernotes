"use client";

import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
import { ScrollIndicator } from "./_sections/ScrollIndicator";

const YouTubeVideo = () => {
  return (
    <div className="relative mx-auto pt-[28.125%] w-1/2 max-w-2xl">
      <iframe
        className="top-0 left-0 absolute w-full h-full"
        src="https://www.youtube.com/embed/WzL-ZniOMBo?si=ziMx_n6jmfkz8NBG"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export const Onboarding: React.FC = () => {
  return (
    <div className="flex flex-col gap-16">
      <div className="mt-32 px-4 min-h-[200px]">
        <YouTubeVideo />
      </div>
      <div className="min-h-[200px]">
        <LandingFeatures />
      </div>
      <div className="min-h-[200px]">
        <LandingCTA />
      </div>
      <ScrollIndicator />
    </div>
  );
};
