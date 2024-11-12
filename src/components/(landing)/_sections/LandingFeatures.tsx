import { Card, CardContent } from "@chadcn/components/ui/card";
import { NewsletterForm } from "@src/components/newsletter/NewsletterForm";
import { features } from "./featureData";

export const LandingFeatures = () => {
  return (
    <div className="space-y-12 mb-40">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mx-auto mb-16 max-w-4xl">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-2 border-blue-100 hover:border-blue-200 transition-all"
          >
            <CardContent className="flex items-center gap-4 bg-white p-6">
              <feature.icon className="flex-shrink-0 text-blue-700 size-10" />
              <div className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-800 text-transparent">
                <h3 className="mb-2 font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <NewsletterForm />
    </div>
  );
};
