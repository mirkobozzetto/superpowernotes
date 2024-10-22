"use client";

import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";
import { ScrollIndicator } from "./_sections/ScrollIndicator";

export const Onboarding: React.FC = () => {
  return (
    <div className="space-y-8">
      <LandingFeatures />
      <LandingCTA />
      <ScrollIndicator />
    </div>
  );
};
