import { Card, CardContent } from "@chadcn/components/ui/card";
import { features } from "./featureData";

export const LandingFeatures = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-8 text-center">
        <h2 className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-800 my-4 h-20 font-medium text-2xl text-center text-transparent md:text-3xl lg:text-5xl italic">
          Rejoignez la révolution vocale
        </h2>

        <p className="mx-auto max-w-2xl text-muted-foreground">{`Parlez. C'est tout`}</p>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mx-auto max-w-4xl">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border border-blue-100 hover:border-blue-200 transition-all"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <feature.icon className="flex-shrink-0 text-blue-700 size-10" />
              <div className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-800 text-transparent">
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
