"use client";

import AuthButton from "@src/components/auth/AuthButton";
import { DemoRecorder } from "../_onboarding/DemoRecorder";

export const LandingCTA = () => {
  return (
    <div className="relative space-y-6 mt-4 mb-12 pt-2 text-center">
      <DemoRecorder />
      <p>Essayez-moi, il suffit de cliquer !</p>
      <AuthButton className="inline-flex relative justify-center items-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-full w-48 h-14 text-md text-white transform transition-all hover:-translate-y-1 active:translate-y-0 duration-200 overflow-hidden ease-in-out">
        <span className="relative z-10">
          {`
        Commencer l'aventure`}
        </span>
        <div className="absolute inset-0 bg-blue-950 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
      </AuthButton>
    </div>
  );
};
