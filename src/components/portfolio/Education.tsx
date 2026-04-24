import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

export function Education() {
  const { data: items } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data } = await supabase
        .from("education")
        .select("id, title, place, period, score")
        .eq("visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (!items || items.length === 0) return null;

  return (
    <Section id="education" eyebrow="Journey" title="Education timeline">
      <div className="relative mx-auto max-w-2xl">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[oklch(0.65_0.28_300/0.5)] to-transparent" />
        <div className="space-y-8">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-12"
            >
              <div className="absolute left-4 top-6 -translate-x-1/2 z-10">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] glow-purple ring-4 ring-background" />
              </div>
              <div className="glass gradient-border rounded-2xl p-6">
                <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[oklch(0.8_0.18_200)]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {it.period}
                </div>
                <h3 className="font-bold text-lg">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.place}</p>
                <p className="mt-2 text-sm font-semibold gradient-text">{it.score}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
