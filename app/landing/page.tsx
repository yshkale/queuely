"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import localFont from "next/font/local";

const PlayfairRegular = localFont({ src: "../fonts/playfair-regular.ttf" });
const PlayfairItalic = localFont({ src: "../fonts/playfair-italic.ttf" });

const ease = [0.16, 1, 0.3, 1];

export default function Landing() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        setConfirming(true);
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    }
  };

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-50">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-neutral-300/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-neutral-100/60 blur-3xl" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white border border-neutral-200 text-neutral-500 text-xs font-medium tracking-wide shadow-sm mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Release 1.0 is here
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className={cn(
            "text-4xl text-neutral-900 font-medium mb-4 leading-[1.1]",
            PlayfairRegular.className,
          )}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
        >
          The sanctuary for{" "}
          <span className={cn("text-neutral-400", PlayfairItalic.className)}>
            your watchlist.
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          className="text-sm md:text-base text-neutral-400 leading-relaxed mb-10 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.16 }}
        >
          Every movie, show, and book you mean to watch — in one quiet place.
        </motion.p>

        {/* Card */}
        <motion.div
          className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.24 }}
        >
          {/* Tabs */}
          <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 py-1.5 text-sm rounded-md transition-all duration-200 font-medium",
                  mode === m
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div
                key="confirming"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="py-4 text-sm text-neutral-500 text-center"
              >
                <p className="mb-3">
                  Check your email for a confirmation link.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    switchMode("signin");
                  }}
                  className="text-neutral-900 underline underline-offset-2 cursor-pointer"
                >
                  Back to sign in
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:bg-white transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:bg-white transition-all"
                />

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-red-500 text-left"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 active:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading
                    ? "Loading…"
                    : mode === "signin"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
