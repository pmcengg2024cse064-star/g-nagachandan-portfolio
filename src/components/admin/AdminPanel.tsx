import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  LogOut,
  Eye,
  MessageSquare,
  Settings,
  FolderKanban,
  GraduationCap,
  Trophy,
  Heart,
  Code2,
  FileText,
} from "lucide-react";
import { SectionsTab } from "./tabs/SectionsTab";
import { ContentTab } from "./tabs/ContentTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { EducationTab } from "./tabs/EducationTab";
import { AchievementsTab } from "./tabs/AchievementsTab";
import { InterestsTab } from "./tabs/InterestsTab";
import { MessagesTab } from "./tabs/MessagesTab";

const tabs = [
  { id: "sections", label: "Sections", icon: Eye },
  { id: "content", label: "Hero & About", icon: FileText },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminPanel() {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState<TabId>("sections");

  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(at 10% 10%, oklch(0.65 0.28 300 / 0.18) 0px, transparent 50%), radial-gradient(at 90% 90%, oklch(0.65 0.25 250 / 0.18) 0px, transparent 50%)",
        }}
      />
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Site
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-[oklch(0.8_0.18_200)]" />
              <h1 className="font-display text-lg font-bold gradient-text-cool">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/80 px-3 py-1.5 text-xs text-white transition hover:bg-destructive"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="scrollbar-hidden mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const ActiveIcon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.4)]"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <ActiveIcon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="glass gradient-border rounded-3xl p-5 sm:p-7">
          {active === "sections" && <SectionsTab />}
          {active === "content" && <ContentTab />}
          {active === "projects" && <ProjectsTab />}
          {active === "skills" && <SkillsTab />}
          {active === "education" && <EducationTab />}
          {active === "achievements" && <AchievementsTab />}
          {active === "interests" && <InterestsTab />}
          {active === "messages" && <MessagesTab />}
        </div>
      </div>
    </div>
  );
}
