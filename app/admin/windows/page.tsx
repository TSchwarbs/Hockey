import { createServiceClient } from "@/lib/supabase/server";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";
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
      <h1 className="text-2xl font-bold text-brand-navy mb-8">Drop-off windows</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Create new window */}
        <div>
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Add window</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <WindowForm />
          </div>
        </div>

        {/* Existing windows */}
        <div>
          <h2 className="text-lg font-semibold text-brand-navy mb-4">
            Scheduled windows
            <span className="text-brand-steel font-normal text-sm ml-2">({windows.length})</span>
          </h2>

          {windows.length === 0 ? (
            <p className="text-brand-steel text-sm">No windows scheduled yet.</p>
          ) : (
            <div className="space-y-3">
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
