import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type HeroValue = { name?: string; tagline?: string; roles?: string[] };
type AboutValue = { body?: string; stats?: { k: string; v: string }[] };
type ContactValue = { email?: string; linkedin?: string; github?: string };

function useContent<T>(key: string) {
  return useQuery({
    queryKey: ["admin_content", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      return (data?.value as T) ?? ({} as T);
    },
  });
}

async function saveContent(key: string, value: unknown) {
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", key)
    .maybeSingle();
  if (existing) {
    await (supabase.from("site_content" as any) as any).update({ value } as any).eq("id", existing.id);
  } else {
    await (supabase.from("site_content" as any) as any).insert({ key, value } as any);
  }
}

export function ContentTab() {
  const qc = useQueryClient();
  const hero = useContent<HeroValue>("hero");
  const about = useContent<AboutValue>("about");
  const contact = useContent<ContactValue>("contact_info");

  const [heroState, setHeroState] = useState<HeroValue>({});
  const [aboutState, setAboutState] = useState<AboutValue>({});
  const [contactState, setContactState] = useState<ContactValue>({});

  useEffect(() => {
    if (hero.data) setHeroState(hero.data);
  }, [hero.data]);
  useEffect(() => {
    if (about.data) setAboutState(about.data);
  }, [about.data]);
  useEffect(() => {
    if (contact.data) setContactState(contact.data);
  }, [contact.data]);

  const save = async (key: string, value: unknown) => {
    await saveContent(key, value);
    qc.invalidateQueries({ queryKey: ["admin_content", key] });
    qc.invalidateQueries({ queryKey: ["site_content", key] });
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[oklch(0.65_0.28_300/0.6)]";
  const card = "rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3";
  const btn =
    "rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] px-5 py-2 text-xs font-medium text-white shadow hover:shadow-lg";

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className="font-semibold">Hero</h3>
        <input
          className={input}
          placeholder="Name"
          value={heroState.name ?? ""}
          onChange={(e) => setHeroState({ ...heroState, name: e.target.value })}
        />
        <input
          className={input}
          placeholder="Tagline"
          value={heroState.tagline ?? ""}
          onChange={(e) => setHeroState({ ...heroState, tagline: e.target.value })}
        />
        <input
          className={input}
          placeholder="Typing roles (comma-separated)"
          value={(heroState.roles ?? []).join(", ")}
          onChange={(e) =>
            setHeroState({
              ...heroState,
              roles: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
        <button className={btn} onClick={() => save("hero", heroState)}>
          Save hero
        </button>
      </div>

      <div className={card}>
        <h3 className="font-semibold">About</h3>
        <textarea
          rows={4}
          className={input}
          placeholder="About body"
          value={aboutState.body ?? ""}
          onChange={(e) => setAboutState({ ...aboutState, body: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Stats (label / value)</p>
        {(aboutState.stats ?? [{ k: "", v: "" }]).map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={input}
              placeholder="Label"
              value={s.k}
              onChange={(e) => {
                const next = [...(aboutState.stats ?? [])];
                next[i] = { ...next[i], k: e.target.value };
                setAboutState({ ...aboutState, stats: next });
              }}
            />
            <input
              className={input}
              placeholder="Value"
              value={s.v}
              onChange={(e) => {
                const next = [...(aboutState.stats ?? [])];
                next[i] = { ...next[i], v: e.target.value };
                setAboutState({ ...aboutState, stats: next });
              }}
            />
            <button
              className="rounded-full bg-white/10 px-3 text-xs"
              onClick={() => {
                const next = [...(aboutState.stats ?? [])];
                next.splice(i, 1);
                setAboutState({ ...aboutState, stats: next });
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs"
          onClick={() =>
            setAboutState({ ...aboutState, stats: [...(aboutState.stats ?? []), { k: "", v: "" }] })
          }
        >
          + Add stat
        </button>
        <div>
          <button className={btn} onClick={() => save("about", aboutState)}>
            Save about
          </button>
        </div>
      </div>

      <div className={card}>
        <h3 className="font-semibold">Contact info</h3>
        <input
          className={input}
          placeholder="Email"
          value={contactState.email ?? ""}
          onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
        />
        <input
          className={input}
          placeholder="LinkedIn URL"
          value={contactState.linkedin ?? ""}
          onChange={(e) => setContactState({ ...contactState, linkedin: e.target.value })}
        />
        <input
          className={input}
          placeholder="GitHub URL"
          value={contactState.github ?? ""}
          onChange={(e) => setContactState({ ...contactState, github: e.target.value })}
        />
        <button className={btn} onClick={() => save("contact_info", contactState)}>
          Save contact
        </button>
      </div>
    </div>
  );
}
