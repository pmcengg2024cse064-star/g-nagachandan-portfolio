import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

type LucideIcon = (typeof Icons)["Brain"];
function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Brain;
  return <Cmp className="h-5 w-5" />;
}

export function Interests() {
  const { data: interests } = useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("interests")
        .select("id,title,description,icon")
        .eq("visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (!interests || interests.length === 0) return null;

  return (
    <Section
      id="interests"
      eyebrow="Curiosity"
      title="What drives me"
      subtitle="The fields and ideas I keep returning to."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group glass gradient-border rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.65_0.28_300/0.25)]"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.28_300/0.3)] to-[oklch(0.8_0.18_200/0.3)] text-[oklch(0.85_0.18_260)] transition group-hover:scale-110">
              <Icon name={it.icon} />
            </div>
            <h3 className="font-display text-lg font-semibold gradient-text-cool">{it.title}</h3>
            {it.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
