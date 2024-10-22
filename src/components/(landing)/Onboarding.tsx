"use client";

import { DemoRecorder } from "./_onboarding/DemoRecorder";
import { LandingCTA } from "./_sections/LandingCTA";
import { LandingFeatures } from "./_sections/LandingFeatures";

export const Onboarding: React.FC = () => {
  return (
    <div className="space-y-8">
      <DemoRecorder />
      <LandingFeatures />
      <LandingCTA />
    </div>
  );
};
