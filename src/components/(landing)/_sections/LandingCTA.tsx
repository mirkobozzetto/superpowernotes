import AuthButton from "@src/components/auth/AuthButton";
import { DemoRecorder } from "../_onboarding/DemoRecorder";

export const LandingCTA = () => {
  return (
    <div className="space-y-6 pt-6 pb-36 text-center">
      <h2 className="bg-clip-text bg-gradient-to-r from-blue-900 to-blue-800 mx-auto max-w-2xl font-bold text-2xl text-transparent md:text-4xl">
        {`
          En ce moment même, les premiers utilisateurs découvrent une nouvelle façon de penser

        `}
      </h2>

      <p className="mx-auto text-muted-foreground">{`
        Rejoignez la révolution vocale, il vous suffit de cliquer `}</p>

      <DemoRecorder />

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
