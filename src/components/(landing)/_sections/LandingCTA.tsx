import { Button } from "@chadcn/components/ui/button";

export const LandingCTA = () => {
  return (
    <div className="space-y-6 pt-6 pb-12 text-center">
      <h2 className="mx-auto max-w-2xl font-bold text-2xl md:text-4xl">
        {`      Testez gratuitement et gardez votre accès privilégié jusqu'à la sortie de la sortie
        officielle`}
      </h2>

      <p className="mx-auto max-w-xl text-muted-foreground">
        Rejoignez les premiers utilisateurs qui redéfinissent la façon de capturer et organiser
        leurs idées. Aucune carte de crédit requise.
      </p>

      <Button
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-full text-white"
      >
        {`Commencer l'aventure`}
      </Button>
    </div>
  );
};
