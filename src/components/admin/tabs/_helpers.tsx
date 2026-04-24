import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Trash2, Plus } from "lucide-react";

export const inp =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[oklch(0.65_0.28_300/0.6)]";
export const card = "rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2";
export const btnPrimary =
  "rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] px-4 py-1.5 text-xs font-medium text-white";
export const btnGhost =
  "rounded-full bg-white/10 px-3 py-1.5 text-xs text-foreground/80 hover:bg-white/15";

type Row = Record<string, unknown> & { id: string; visible?: boolean; sort_order?: number };

export function CrudList<T extends Row>({
  table,
  queryKey,
  defaults,
  render,
}: {
  table: string;
  queryKey: string;
  defaults: Partial<T>;
  render: (row: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await (supabase.from(table as any) as any).select("*").order("sort_order");
      return (data ?? []) as T[];
    },
  });
  const [editing, setEditing] = useState<Record<string, Partial<T>>>({});

  const update = (id: string, patch: Partial<T>) =>
    setEditing((e) => ({ ...e, [id]: { ...(e[id] ?? {}), ...patch } }));

  const save = async (id: string) => {
    const patch = editing[id];
    if (!patch) return;
    await (supabase.from(table as any) as any).update(patch as any).eq("id", id);
    setEditing((e) => {
      const n = { ...e };
      delete n[id];
      return n;
    });
    qc.invalidateQueries({ queryKey: [queryKey] });
    qc.invalidateQueries({ queryKey: [table] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await (supabase.from(table as any) as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: [queryKey] });
    qc.invalidateQueries({ queryKey: [table] });
  };

  const toggleVisible = async (row: T) => {
    await (supabase.from(table as any) as any).update({ visible: !row.visible } as any).eq("id", row.id);
    qc.invalidateQueries({ queryKey: [queryKey] });
    qc.invalidateQueries({ queryKey: [table] });
  };

  const add = async () => {
    const order = data?.length ?? 0;
    await (supabase.from(table as any) as any).insert({ ...defaults, sort_order: order } as any);
    qc.invalidateQueries({ queryKey: [queryKey] });
    qc.invalidateQueries({ queryKey: [table] });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{data?.length ?? 0} items</p>
        <button onClick={add} className={btnPrimary + " inline-flex items-center gap-1.5"}>
          <Plus className="h-3 w-3" /> Add new
        </button>
      </div>
      <div className="space-y-3">
        {(data ?? []).map((row) => {
          const merged = { ...row, ...(editing[row.id] ?? {}) } as T;
          const dirty = !!editing[row.id];
          return (
            <div key={row.id} className={card}>
              {render(merged, (p) => update(row.id, p))}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => toggleVisible(row)}
                  className={btnGhost + " inline-flex items-center gap-1"}
                >
                  {row.visible !== false ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {row.visible !== false ? "Visible" : "Hidden"}
                </button>
                {dirty && (
                  <button onClick={() => save(row.id)} className={btnPrimary}>
                    Save
                  </button>
                )}
                <button
                  onClick={() => remove(row.id)}
                  className="rounded-full bg-destructive/80 px-3 py-1.5 text-xs text-white inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
