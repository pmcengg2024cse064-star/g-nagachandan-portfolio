import { CrudList, inp } from "./_helpers";

type Interest = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  visible: boolean;
  sort_order: number;
};

export function InterestsTab() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Interests</h2>
      <CrudList<Interest>
        table="interests"
        queryKey="admin_interests"
        defaults={{ title: "New Interest", icon: "Brain", visible: true }}
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
              placeholder="Icon (lucide name e.g. Brain)"
              value={row.icon ?? ""}
              onChange={(e) => update({ icon: e.target.value })}
            />
            <textarea
              rows={2}
              className={inp + " sm:col-span-2"}
              placeholder="Description"
              value={row.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
            />
          </div>
        )}
      />
    </div>
  );
}
