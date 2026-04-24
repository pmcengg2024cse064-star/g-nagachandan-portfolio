import { CrudList, inp } from "./_helpers";

type Edu = {
  id: string;
  title: string;
  place: string | null;
  period: string | null;
  score: string | null;
  visible: boolean;
  sort_order: number;
};

export function EducationTab() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Education</h2>
      <CrudList<Edu>
        table="education"
        queryKey="admin_education"
        defaults={{ title: "New Entry", visible: true }}
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
              placeholder="Place"
              value={row.place ?? ""}
              onChange={(e) => update({ place: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Period"
              value={row.period ?? ""}
              onChange={(e) => update({ period: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Score"
              value={row.score ?? ""}
              onChange={(e) => update({ score: e.target.value })}
            />
          </div>
        )}
      />
    </div>
  );
}
