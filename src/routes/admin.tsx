import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ArrowLeft, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — G NAGACHANDAN" }] }),
  component: AdminRoute,
});

function AdminRoute() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="glass gradient-border max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold gradient-text-cool">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) is signed in but does not have admin access.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            To grant admin: open Lovable Cloud → Tables → <code>user_roles</code> and insert a row
            with your <code>user_id</code> and role <code>admin</code>.
          </p>
          <p className="mt-2 break-all text-[11px] text-muted-foreground">
            Your user ID: {user.id}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="rounded-full glass px-4 py-2 text-sm transition hover:bg-white/10"
            >
              <ArrowLeft className="mr-1 inline h-3 w-3" /> Back
            </Link>
            <button
              onClick={signOut}
              className="rounded-full bg-destructive/80 px-4 py-2 text-sm text-white transition hover:bg-destructive"
            >
              <LogOut className="mr-1 inline h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}
