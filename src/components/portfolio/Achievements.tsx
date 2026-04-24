import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

type LucideIcon = (typeof Icons)["Trophy"];

function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Trophy;
  return <Cmp className="h-6 w-6" />;
}

export function Achievements() {
  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("achievements")
        .select("id,title,description,icon")
        .eq("visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const { data: certifications } = useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("certifications")
        .select("id,name")
        .eq("visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (
    (!achievements || achievements.length === 0) &&
    (!certifications || certifications.length === 0)
  )
    return null;

  return (
    <Section id="achievements" eyebrow="Recognition" title="Achievements & certifications">
      {achievements && achievements.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass gradient-border rounded-3xl p-6 text-center transition hover:-translate-y-1"
            >
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.28_350/0.3)] to-[oklch(0.65_0.28_300/0.3)] text-[oklch(0.85_0.2_330)] glow-pink">
                <Icon name={a.icon} />
              </div>
              <h3 className="mt-4 font-bold">{a.title}</h3>
              {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass gradient-border rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award className="h-4 w-4 text-[oklch(0.8_0.18_200)]" />
            <h3 className="font-semibold">Certifications</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {certifications.map((c, i) => (
              <motion.span
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300/0.15)] to-[oklch(0.65_0.25_250/0.15)] border border-[oklch(0.65_0.28_300/0.3)] px-4 py-2 text-sm text-foreground/90 transition hover:border-[oklch(0.65_0.28_300/0.6)] hover:shadow-[0_0_20px_oklch(0.65_0.28_300/0.3)]"
              >
                {c.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </Section>
  );
}
