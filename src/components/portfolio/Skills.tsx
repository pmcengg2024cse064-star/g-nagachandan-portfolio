import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

type LucideIcon = (typeof Icons)["Code2"];

function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Code2;
  return <Cmp className="h-5 w-5" />;
}

export function Skills() {
  const { data: groups } = useQuery({
    queryKey: ["skill_groups_with_skills"],
    queryFn: async () => {
      const { data: g } = await supabase
        .from("skill_groups")
        .select("id,title,icon,sort_order")
        .eq("visible", true)
        .order("sort_order");
      const { data: s } = await supabase
        .from("skills")
        .select("id,group_id,name,level,sort_order")
        .order("sort_order");
      return (g ?? []).map((group) => ({
        ...group,
        items: (s ?? []).filter((sk) => sk.group_id === group.id),
      }));
    },
  });

  if (!groups || groups.length === 0) return null;

  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title="Skills & expertise"
      subtitle="A blend of engineering, AI, and design — used to ship real products."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group glass gradient-border rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.65_0.28_300/0.25)]"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.28_300/0.3)] to-[oklch(0.65_0.25_250/0.3)] text-[oklch(0.85_0.15_280)] transition group-hover:scale-110">
                <Icon name={g.icon} />
              </div>
              <h3 className="font-bold text-lg">{g.title}</h3>
            </div>
            <ul className="space-y-3">
              {g.items.map((s) => (
                <li key={s.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground/90">{s.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.8_0.18_200)]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
