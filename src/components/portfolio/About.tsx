import { motion } from "framer-motion";
import { Sparkles, Rocket, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

const highlights = [
  {
    icon: Brain,
    title: "AI & ML",
    desc: "Computer vision, ML pipelines, and agentic AI workflows.",
  },
  {
    icon: Rocket,
    title: "Full Stack",
    desc: "End-to-end MERN apps with REST APIs and clean architecture.",
  },
  { icon: Sparkles, title: "Hackathons", desc: "Hands-on builder shipping under tight deadlines." },
];

const defaultStats = [
  { k: "Projects", v: "10+" },
  { k: "Hackathons", v: "3" },
  { k: "CGPA", v: "8.82" },
];

const defaultBody =
  "Aspiring Computer Science Engineer with experience in MERN stack, Python, and AI-based systems. Skilled in building scalable web apps, REST APIs, and computer vision solutions like defect detection.";

export function About() {
  const { data } = useQuery({
    queryKey: ["site_content", "about"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "about")
        .maybeSingle();
      return (data?.value as { body?: string; stats?: { k: string; v: string }[] }) ?? null;
    },
  });

  const body = data?.body ?? defaultBody;
  const stats = data?.stats?.length ? data.stats : defaultStats;

  return (
    <Section id="about" eyebrow="About me" title="Crafting code with purpose">
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass gradient-border md:col-span-2 rounded-3xl p-8"
        >
          <p className="text-lg leading-relaxed text-foreground/90">{body}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.k} className="glass rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold gradient-text">{s.v}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.k}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass gradient-border rounded-3xl p-6 space-y-4"
        >
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-gradient-to-br from-[oklch(0.65_0.28_300/0.3)] to-[oklch(0.65_0.25_250/0.3)] p-2.5 text-[oklch(0.85_0.18_280)]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
