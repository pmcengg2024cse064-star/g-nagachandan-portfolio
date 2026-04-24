import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Admin Sign In — G NAGACHANDAN" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
        setError(
          "Account created. If this is the first account it can be promoted to admin from the database. Now sign in.",
        );
        setMode("signin");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(at 20% 20%, oklch(0.65 0.28 300 / 0.25) 0px, transparent 50%), radial-gradient(at 80% 80%, oklch(0.65 0.25 250 / 0.25) 0px, transparent 50%)",
        }}
      />
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
          <div className="glass gradient-border rounded-3xl p-8">
            <h1 className="font-display text-2xl font-bold gradient-text-cool">Admin access</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your portfolio.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.65_0.25_250)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.4)] transition hover:shadow-[oklch(0.65_0.28_300/0.7)] disabled:opacity-60"
              >
                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>

              <button
                type="button"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
                className="block w-full text-xs text-muted-foreground transition hover:text-foreground"
              >
                {mode === "signin"
                  ? "Need an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            </form>
            <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
              First time? Create an account, then promote it to admin via Cloud → Tables →
              user_roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
