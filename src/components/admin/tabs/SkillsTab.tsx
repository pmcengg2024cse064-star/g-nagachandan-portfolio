import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { inp, btnPrimary, btnGhost } from "./_helpers";

type Group = { id: string; title: string; icon: string; visible: boolean; sort_order: number };
type Skill = { id: string; group_id: string; name: string; level: number; sort_order: number };

export function SkillsTab() {
  const qc = useQueryClient();
  const { data: groups } = useQuery({
    queryKey: ["admin_skill_groups"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_groups").select("*").order("sort_order");
      return (data ?? []) as Group[];
    },
  });
  const { data: skills } = useQuery({
    queryKey: ["admin_skills"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select("*").order("sort_order");
      return (data ?? []) as Skill[];
    },
  });
  const [drafts, setDrafts] = useState<Record<string, { name: string; level: number }>>({});

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin_skill_groups"] });
    qc.invalidateQueries({ queryKey: ["admin_skills"] });
    qc.invalidateQueries({ queryKey: ["skill_groups_with_skills"] });
  };

  const addGroup = async () => {
    await supabase
      .from("skill_groups")
      .insert({ title: "New Group", icon: "Code2", sort_order: groups?.length ?? 0 });
    invalidate();
  };
  const updateGroup = async (id: string, patch: Partial<Group>) => {
    await supabase.from("skill_groups").update(patch).eq("id", id);
    invalidate();
  };
  const deleteGroup = async (id: string) => {
    if (!confirm("Delete group and all its skills?")) return;
    await supabase.from("skill_groups").delete().eq("id", id);
    invalidate();
  };
  const addSkill = async (groupId: string) => {
    const draft = drafts[groupId] ?? { name: "", level: 80 };
    if (!draft.name.trim()) return;
    const order = (skills ?? []).filter((s) => s.group_id === groupId).length;
    await supabase.from("skills").insert({
      group_id: groupId,
      name: draft.name.trim(),
      level: draft.level,
      sort_order: order,
    });
    setDrafts((d) => ({ ...d, [groupId]: { name: "", level: 80 } }));
    invalidate();
  };
  const updateSkill = async (id: string, patch: Partial<Skill>) => {
    await supabase.from("skills").update(patch).eq("id", id);
    invalidate();
  };
  const deleteSkill = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    invalidate();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Skills</h2>
          <p className="text-sm text-muted-foreground">
            Manage skill groups and individual skills.
          </p>
        </div>
        <button onClick={addGroup} className={btnPrimary + " inline-flex items-center gap-1.5"}>
          <Plus className="h-3 w-3" /> Add group
        </button>
      </div>

      <div className="space-y-4">
        {(groups ?? []).map((g) => {
          const items = (skills ?? []).filter((s) => s.group_id === g.id);
          const draft = drafts[g.id] ?? { name: "", level: 80 };
          return (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid gap-2 sm:grid-cols-[1fr,180px,auto,auto,auto]">
                <input
                  className={inp}
                  value={g.title}
                  onChange={(e) => updateGroup(g.id, { title: e.target.value })}
                />
                <input
                  className={inp}
                  placeholder="Icon"
                  value={g.icon}
                  onChange={(e) => updateGroup(g.id, { icon: e.target.value })}
                />
                <button
                  onClick={() => updateGroup(g.id, { visible: !g.visible })}
                  className={btnGhost + " inline-flex items-center gap-1"}
                >
                  {g.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {g.visible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => deleteGroup(g.id)}
                  className="rounded-full bg-destructive/80 px-3 py-1.5 text-xs text-white inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <ul className="mt-3 space-y-2">
                {items.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <input
                      className={inp}
                      value={s.name}
                      onChange={(e) => updateSkill(s.id, { name: e.target.value })}
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className={inp + " w-20"}
                      value={s.level}
                      onChange={(e) => updateSkill(s.id, { level: Number(e.target.value) })}
                    />
                    <button
                      onClick={() => deleteSkill(s.id)}
                      className="rounded-full bg-destructive/80 p-1.5 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-2">
                <input
                  className={inp}
                  placeholder="New skill name"
                  value={draft.name}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [g.id]: { ...draft, name: e.target.value } }))
                  }
                />
                <input
                  type="number"
                  className={inp + " w-20"}
                  value={draft.level}
                  onChange={(e) =>
                    setDrafts((d) => ({
                      ...d,
                      [g.id]: { ...draft, level: Number(e.target.value) },
                    }))
                  }
                />
                <button
                  onClick={() => addSkill(g.id)}
                  className={btnPrimary + " inline-flex items-center gap-1"}
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
