import { Card, CardContent } from "@chadcn/components/ui/card";
import { NewsletterForm } from "@src/components/newsletter/NewsletterForm";
import { useScrollThreshold } from "@src/hooks/_ui/useScrollThreshold";
import { motion } from "framer-motion";
import { features } from "./featureData";

export const LandingFeatures = () => {
  const hasScrolled10vh = useScrollThreshold(10);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const newsletterAnimation = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: 1.2,
      },
    },
  };

  return (
    <div className="space-y-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate={hasScrolled10vh ? "show" : "hidden"}
        className="gap-6 grid grid-cols-1 md:grid-cols-2 mx-auto mb-16 max-w-4xl"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={item}>
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-all">
              <CardContent className="flex items-center gap-4 bg-white p-6">
                <feature.icon className="flex-shrink-0 text-blue-700 size-10" />
                <div className="bg-clip-text bg-gradient-to-l from-blue-950 to-blue-800 text-transparent">
                  <h3 className="mb-2 font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={newsletterAnimation}
        initial="hidden"
        animate={hasScrolled10vh ? "show" : "hidden"}
        className="relative"
      >
        <motion.div
          className="-z-10 absolute"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            hasScrolled10vh
              ? { opacity: 1, scale: 1, transition: { delay: 1.8, duration: 0.5 } }
              : { opacity: 0, scale: 0.8 }
          }
        />
        <NewsletterForm className="relative" />
      </motion.div>
    </div>
  );
};
