import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Mail, MailOpen } from "lucide-react";

export function MessagesTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const toggleRead = async (id: string, read: boolean) => {
    await supabase.from("contact_messages").update({ read: !read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_messages"] });
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Messages</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        {data?.length ?? 0} message(s) received.
      </p>
      <div className="space-y-3">
        {(data ?? []).map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border border-white/10 p-4 ${m.read ? "bg-white/5" : "bg-[oklch(0.65_0.28_300/0.08)]"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {m.name} <span className="text-xs text-muted-foreground">· {m.email}</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRead(m.id, m.read)}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs inline-flex items-center gap-1"
                >
                  {m.read ? <MailOpen className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                  {m.read ? "Read" : "Unread"}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="rounded-full bg-destructive/80 px-3 py-1.5 text-xs text-white inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{m.message}</p>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
