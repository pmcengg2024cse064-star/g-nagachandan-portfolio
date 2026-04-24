import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SectionKey =
  | "hero"
  | "about"
  | "education"
  | "skills"
  | "projects"
  | "achievements"
  | "interests"
  | "contact";

export function useSectionVisibility() {
  return useQuery({
    queryKey: ["section_settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("section_settings")
        .select("section_key, visible, sort_order")
        .order("sort_order");
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((row) => {
        map[row.section_key] = row.visible;
      });
      return map;
    },
  });
}

export function useIsSectionVisible(key: SectionKey) {
  const { data } = useSectionVisibility();
  // default visible if data not loaded yet or key missing
  return data?.[key] ?? true;
}
