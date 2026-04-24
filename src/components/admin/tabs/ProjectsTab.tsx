import { CrudList, inp } from "./_helpers";

type Project = {
  id: string;
  title: string;
  tag: string | null;
  description: string | null;
  points: string[];
  github_url: string | null;
  demo_url: string | null;
  visible: boolean;
  sort_order: number;
};

export function ProjectsTab() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Projects</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        Add, edit, hide or delete portfolio projects.
      </p>
      <CrudList<Project>
        table="projects"
        queryKey="admin_projects"
        defaults={{ title: "New Project", tag: "", description: "", points: [], visible: true }}
        render={(row, update) => (
          <div className="space-y-2">
            <input
              className={inp}
              placeholder="Title"
              value={row.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Tag"
              value={row.tag ?? ""}
              onChange={(e) => update({ tag: e.target.value })}
            />
            <textarea
              rows={2}
              className={inp}
              placeholder="Description"
              value={row.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Bullet points (comma-separated)"
              value={(row.points ?? []).join(", ")}
              onChange={(e) =>
                update({
                  points: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inp}
                placeholder="GitHub URL"
                value={row.github_url ?? ""}
                onChange={(e) => update({ github_url: e.target.value })}
              />
              <input
                className={inp}
                placeholder="Demo URL"
                value={row.demo_url ?? ""}
                onChange={(e) => update({ demo_url: e.target.value })}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
