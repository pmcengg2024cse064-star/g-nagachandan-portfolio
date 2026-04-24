import { CrudList, inp } from "./_helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  visible: boolean;
  sort_order: number;
};

export function AchievementsTab() {
  const qc = useQueryClient();
  const [newCert, setNewCert] = useState("");

  const { data: certs } = useQuery({
    queryKey: ["admin_certifications"],
    queryFn: async () => {
      const { data } = await supabase.from("certifications").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const addCert = async () => {
    if (!newCert.trim()) return;
    await supabase
      .from("certifications")
      .insert({ name: newCert.trim(), sort_order: certs?.length ?? 0 });
    setNewCert("");
    qc.invalidateQueries({ queryKey: ["admin_certifications"] });
    qc.invalidateQueries({ queryKey: ["certifications"] });
  };

  const removeCert = async (id: string) => {
    await supabase.from("certifications").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_certifications"] });
    qc.invalidateQueries({ queryKey: ["certifications"] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold">Achievements</h2>
        <CrudList<Achievement>
          table="achievements"
          queryKey="admin_achievements"
          defaults={{ title: "New Achievement", icon: "Trophy", visible: true }}
          render={(row, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inp}
                placeholder="Title"
                value={row.title ?? ""}
                onChange={(e) => update({ title: e.target.value })}
              />
              <input
                className={inp}
                placeholder="Icon (lucide name e.g. Trophy)"
                value={row.icon ?? ""}
                onChange={(e) => update({ icon: e.target.value })}
              />
              <input
                className={inp + " sm:col-span-2"}
                placeholder="Description"
                value={row.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
              />
            </div>
          )}
        />
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">Certifications</h2>
        <div className="mt-3 flex gap-2">
          <input
            className={inp}
            placeholder="New certification name"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
          />
          <button
            onClick={addCert}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] px-4 text-xs text-white"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(certs ?? []).map((c) => (
            <li
              key={c.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm"
            >
              {c.name}
              <button onClick={() => removeCert(c.id)} className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
