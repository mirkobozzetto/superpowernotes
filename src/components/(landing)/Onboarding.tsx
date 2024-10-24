"use client";

import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
import { ScrollIndicator } from "./_sections/ScrollIndicator";

export const Onboarding: React.FC = () => {
  return (
    <div className="flex flex-col gap-16">
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
