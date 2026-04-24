import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import profileImg from "@/assets/profile.jpg";
import { supabase } from "@/integrations/supabase/client";

const defaultRoles = ["AI Developer", "MERN Stack Developer", "Problem Solver"];

function useTyping(roles: string[]) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const current = roles[idx % roles.length];
    const timeout = setTimeout(
      () => {
        if (!deleting && text === current) {
          setTimeout(() => setDeleting(true), 1400);
          return;
        }
        if (deleting && text === "") {
          setDeleting(false);
          setIdx((i) => (i + 1) % roles.length);
          return;
        }
        setText(
          deleting ? current.substring(0, text.length - 1) : current.substring(0, text.length + 1),
        );
      },
      deleting ? 50 : 90,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, roles]);

  return text;
}

export function Hero() {
  const { data: hero } = useQuery({
    queryKey: ["site_content", "hero"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "hero")
        .maybeSingle();
      return (
        (data?.value as {
          name?: string;
          tagline?: string;
          roles?: string[];
        }) ?? null
      );
    },
  });

  const name = hero?.name ?? "G NAGACHANDAN";
  const tagline = hero?.tagline ?? "Aspiring Computer Science Engineer";
  const roles = hero?.roles?.length ? hero.roles : defaultRoles;
  const typed = useTyping(roles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-3 pt-24 pb-12 sm:px-4 sm:pt-20 sm:pb-16"
    >
      <div className="container mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass gradient-border relative overflow-hidden rounded-[2rem] p-5 sm:p-8 md:p-14 animate-float"
        >
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-70"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.65 0.28 300), oklch(0.7 0.28 350), oklch(0.65 0.25 250), oklch(0.8 0.18 200), oklch(0.65 0.28 300))",
                }}
              />
              <div className="relative h-28 w-28 rounded-full p-[3px] bg-gradient-to-br from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.65_0.25_250)] sm:h-36 sm:w-36 md:h-48 md:w-48">
                <img
                  src={profileImg}
                  alt="G Nagachandan portrait"
                  className="h-full w-full rounded-full object-cover bg-background"
                />
              </div>
            </motion.div>

            <div className="w-full">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:mb-4 sm:px-4 sm:text-xs">
                <Sparkles className="h-3 w-3 text-[oklch(0.8_0.18_200)]" />
                Available for opportunities
              </div>

              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[oklch(0.8_0.18_200)] sm:text-sm sm:tracking-[0.3em]">
                Hi, I'm
              </p>

              <h1
                className="break-words text-[2rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-7xl lg:text-[5.5rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <span className="gradient-text-cool animate-gradient">{name}</span>
              </h1>

              <p className="mt-4 px-1 text-base font-light text-foreground/90 sm:mt-5 sm:text-xl md:text-2xl">
                {tagline}
              </p>

              <div className="mt-4 flex min-h-10 flex-wrap items-center justify-center gap-x-2 text-sm sm:text-lg md:text-xl">
                <span className="text-muted-foreground">I'm a</span>
                <span className="font-semibold gradient-text">{typed}</span>
                <span className="cursor-blink ml-1 inline-block h-5 w-[2px] bg-[oklch(0.8_0.18_200)] sm:h-6" />
              </div>

              <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <a
                  href="#projects"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.65_0.25_250)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.4)] transition hover:scale-[1.02] hover:shadow-[oklch(0.65_0.28_300/0.7)] sm:px-7 sm:py-3.5 sm:text-base"
                >
                  View Projects
                  <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition hover:bg-white/10 sm:px-7 sm:py-3.5 sm:text-base"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl sm:-right-20 sm:-top-20 sm:h-64 sm:w-64"
            style={{ background: "oklch(0.7 0.28 350 / 0.5)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full opacity-50 blur-3xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72"
            style={{ background: "oklch(0.65 0.25 250 / 0.5)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
