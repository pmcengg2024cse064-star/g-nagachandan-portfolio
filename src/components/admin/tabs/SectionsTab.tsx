import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SectionsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_sections"],
    queryFn: async () => {
      const { data } = await supabase.from("section_settings").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const toggle = async (id: string, visible: boolean) => {
    await supabase.from("section_settings").update({ visible: !visible }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_sections"] });
    qc.invalidateQueries({ queryKey: ["section_settings"] });
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Show / hide sections</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Toggle which sections appear on your portfolio.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(data ?? []).map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="text-sm font-medium capitalize">{s.section_key}</span>
            <button
              onClick={() => toggle(s.id, s.visible)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                s.visible
                  ? "bg-[oklch(0.7_0.2_140)] text-white"
                  : "bg-white/10 text-muted-foreground"
              }`}
            >
              {s.visible ? "Visible" : "Hidden"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
