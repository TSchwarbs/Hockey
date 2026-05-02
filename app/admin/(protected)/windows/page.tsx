import { createServiceClient } from "@/lib/supabase/server";
import type { DropOffWindow } from "@/lib/types";
import WindowForm from "@/components/admin/WindowForm";
import WindowRow from "@/components/admin/WindowRow";

export const dynamic = "force-dynamic";

async function getWindows(): Promise<DropOffWindow[]> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("drop_off_windows")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function WindowsPage() {
  const windows = await getWindows();

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-semibold text-xl text-foreground">Drop-off Windows</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create new window */}
        <div>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Add Window
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <WindowForm />
          </div>
        </div>

        {/* Existing windows */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
              Scheduled
            </h2>
            <span className="text-xs text-muted-foreground/60">{windows.length}</span>
          </div>

          {windows.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-muted-foreground text-sm">No windows scheduled yet.</p>
              <p className="text-muted-foreground/50 text-xs mt-1">Add one using the form.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {windows.map((win) => (
                <WindowRow key={win.id} window={win} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
