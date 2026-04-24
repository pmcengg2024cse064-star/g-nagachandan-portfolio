import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { supabase } from "@/integrations/supabase/client";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: info } = useQuery({
    queryKey: ["site_content", "contact_info"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "contact_info")
        .maybeSingle();
      return (data?.value as { email?: string; linkedin?: string; github?: string }) ?? null;
    },
  });
  const emailHref = `mailto:${info?.email ?? "gnagachandan@gmail.com"}`;
  const linkedin = info?.linkedin ?? "https://www.linkedin.com/in/g-nagachandan";
  const github = info?.github ?? "https://github.com/g-nagachandan";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("contact_messages").insert({ name, email, message });
    setBusy(false);
    if (err) {
      setError("Could not send. Please try again.");
      return;
    }
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Section
      id="contact"
      eyebrow="Let's connect"
      title="Get in touch"
      subtitle="Open to internships, collaborations, and exciting opportunities."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={submit}
          className="glass gradient-border lg:col-span-3 rounded-3xl p-8 space-y-5"
        >
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition focus:border-[oklch(0.65_0.28_300/0.6)] focus:shadow-[0_0_20px_oklch(0.65_0.28_300/0.2)]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition focus:border-[oklch(0.65_0.28_300/0.6)] focus:shadow-[0_0_20px_oklch(0.65_0.28_300/0.2)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition focus:border-[oklch(0.65_0.28_300/0.6)] focus:shadow-[0_0_20px_oklch(0.65_0.28_300/0.2)] resize-none"
              placeholder="Tell me about your idea..."
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.65_0.25_250)] px-7 py-3 font-medium text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.4)] transition hover:shadow-[oklch(0.65_0.28_300/0.7)] disabled:opacity-60"
          >
            {sent ? "Message sent ✨" : busy ? "Sending..." : "Send Message"}
            <Send className="h-4 w-4" />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 grid gap-5 sm:grid-cols-3 lg:grid-cols-1"
        >
          <a
            href={emailHref}
            className="group glass gradient-border flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.7_0.28_350/0.25)]"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.28_300/0.3)] to-[oklch(0.7_0.28_350/0.3)] p-4 text-[oklch(0.85_0.2_320)] transition group-hover:scale-110">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-semibold gradient-text">Email me</p>
            </div>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="group glass gradient-border flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.65_0.25_250/0.25)]"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.25_250/0.3)] to-[oklch(0.8_0.18_200/0.3)] p-4 text-[oklch(0.85_0.18_230)] transition group-hover:scale-110">
              <Linkedin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                LinkedIn
              </p>
              <p className="mt-1 text-sm font-semibold gradient-text-cool">Connect</p>
            </div>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="group glass gradient-border flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.7_0.28_350/0.25)]"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.28_350/0.3)] to-[oklch(0.65_0.28_300/0.3)] p-4 text-[oklch(0.9_0.1_320)] transition group-hover:scale-110">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">GitHub</p>
              <p className="mt-1 text-sm font-semibold gradient-text">Follow</p>
            </div>
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
