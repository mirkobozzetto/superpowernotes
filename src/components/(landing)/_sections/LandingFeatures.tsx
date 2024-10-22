import { Card, CardContent } from "@chadcn/components/ui/card";
import { Brain, CloudLightning, Mic, Tags } from "lucide-react";

const features = [
  {
    title: "Capturez l'instant",
    description: "Transformez vos pensées en notes où que vous soyez, quand l'inspiration frappe",
    icon: Brain,
  },
  {
    title: "Organisation Intelligente",
    description:
      "Tags et titres générés automatiquement par IA pour retrouver vos idées en un clic",
    icon: Tags,
  },
  {
    title: "Simple comme bonjour",
    description: "Parlez, c'est tout. L'IA s'occupe du reste",
    icon: Mic,
  },
  {
    title: "Toujours avec vous",
    description: "Synchronisation dans le cloud, accès sur tous vos appareils",
    icon: CloudLightning,
  },
];

export const LandingFeatures = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-500 mb-4 font-medium text-2xl text-center text-transparent md:text-3xl lg:text-5xl italic">
          Libérez votre esprit
        </h2>

        <p className="mx-auto max-w-2xl text-muted-foreground">Parlez. C'est tout.</p>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mx-auto max-w-4xl">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border border-blue-100 hover:border-blue-200 transition-all"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <feature.icon className="flex-shrink-0 text-blue-500 size-10" />
              <div className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-500 text-transparent">
                <h3 className="mb-2 font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
