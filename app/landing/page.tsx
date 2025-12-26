"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import localFont from "next/font/local";
import Image from "next/image";

const PlayfairRegular = localFont({
  src: "../fonts/playfair-regular.ttf",
});
const PlayfairItalic = localFont({
  src: "../fonts/playfair-italic.ttf",
});

export default function Landing() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white border border-neutral-200 text-neutral-500 text-xs font-medium tracking-wide mb-6 shadow-sm">
            Release 1.0 is here
          </span>

          <h1
            className={cn(
              "text-5xl md:text-7xl text-neutral-900 font-medium mb-6 md:mb-8",
              PlayfairRegular.className,
            )}
          >
            The sanctuary for <br />
            <span
              className={cn(
                "font-medium text-neutral-500",
                PlayfairItalic.className,
              )}
            >
              your watchlist.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-neutral-500 leading-relaxed mb-10">
            Stop losing recommendations in screenshots and mental notes. Queuely
            is the elegant home for every movie, show, and book you intend to
            experience.
          </p>

          <Button className="rounded-lg md:mt-2 h-10">
            <Image
              src={"/icons/google.png"}
              alt="Google Logo"
              className="mr-0.5 w-4 h-4"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
