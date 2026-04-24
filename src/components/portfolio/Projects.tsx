import { motion } from "framer-motion";
import { Github, ArrowUpRight, Code2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

const accents = [
  "from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)]",
  "from-[oklch(0.65_0.25_250)] to-[oklch(0.8_0.18_200)]",
  "from-[oklch(0.7_0.28_350)] to-[oklch(0.8_0.18_200)]",
  "from-[oklch(0.8_0.18_200)] to-[oklch(0.65_0.28_300)]",
];

export function Projects() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,tag,description,points,github_url,demo_url")
        .eq("visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (!projects || projects.length === 0) return null;

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Projects & experiments"
      subtitle="A mix of full-stack, AI, and analytics work — from hackathons to production-ready systems."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const accent = accents[i % accents.length];
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative glass gradient-border overflow-hidden rounded-3xl p-7 transition hover:-translate-y-2"
            >
              <div
                className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl transition group-hover:opacity-40`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                  >
                    <Code2 className="h-5 w-5" />
                  </div>
                  {p.tag && (
                    <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
                {p.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                )}
                {p.points && p.points.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-xs text-foreground/80">
                        <span className="h-1 w-1 rounded-full bg-[oklch(0.8_0.18_200)]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-medium transition hover:bg-white/10"
                    >
                      <Github className="h-3.5 w-3.5" />
                      View Code
                    </a>
                  )}
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] px-4 py-2 text-xs font-medium text-white transition hover:shadow-lg hover:shadow-[oklch(0.65_0.28_300/0.4)]"
                    >
                      Live Demo
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
