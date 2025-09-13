"use client";

import { Dialog, DialogContent } from "@chadcn/components/ui/dialog";
import { cn } from "@chadcn/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type YouTubeModalProps = {
  videoId: string;
  className?: string;
};

export const YouTubeModal = ({ videoId, className }: YouTubeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={cn(
          "group relative mx-auto cursor-pointer overflow-hidden rounded-xl",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-full max-w-3xl aspect-video">
          <Image
            src="/embedYT.png"
            alt="Super Power Notes"
            fill
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
            priority
          />
          <div className="group-hover:bg-black/40 absolute inset-0 flex justify-center items-center bg-black/30 transition-all duration-300">
            <PlayCircle className="group-hover:scale-110 text-white/90 transition-all duration-300 size-16" />
          </div>
          <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="font-medium text-center text-white">Découvrez Super Power Notes</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="top-[50%] left-[50%] bg-transparent shadow-2xl p-0 border-none rounded-xl w-[90vw] max-w-[1200px] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.3,
                    ease: "easeOut" as const,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  filter: "blur(10px)",
                  transition: {
                    duration: 0.2,
                    ease: "easeIn" as const,
                  },
                }}
                className="relative bg-black/95 rounded-xl w-full overflow-hidden"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="top-1 right-1 z-50 absolute bg-white/90 hover:bg-white shadow-xl p-2 rounded-full focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-110 focus:outline-none"
                >
                  <X className="text-black size-4" />
                  <span className="sr-only">Fermer</span>
                </button>
                <div className="w-full aspect-video">
                  <iframe
                    className="rounded-lg w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
