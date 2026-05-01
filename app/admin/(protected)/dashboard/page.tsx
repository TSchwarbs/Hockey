import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getUpcomingBookings(): Promise<BookingWithWindow[]> {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select("*, drop_off_windows!inner(*)")
    .gte("drop_off_windows.date", today)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingWithWindow[];
}

export default async function DashboardPage() {
  const bookings = await getUpcomingBookings();

  const grouped = bookings.reduce<Record<string, BookingWithWindow[]>>((acc, b) => {
    const date = b.drop_off_windows?.date ?? "unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div>
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="font-display text-[40px] uppercase tracking-wide text-text-primary">
          Bookings
        </h1>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-text">
          {bookings.length} total
        </span>
      </div>

      {sortedDates.length === 0 && (
        <div className="bg-surface-1 rounded-2xl border border-border/60 p-10 text-center">
          <p className="text-muted-text font-mono text-sm">No upcoming bookings.</p>
        </div>
      )}

      <div className="space-y-10">
        {sortedDates.map((date) => {
          const group = grouped[date];
          const win = group[0].drop_off_windows;
          return (
            <section key={date}>
              {/* Date group header */}
              <div className="flex items-baseline gap-4 mb-3">
                <h2 className="font-display text-[24px] uppercase tracking-wide text-text-primary">
                  {formatWindowDate(date)}
                </h2>
                {win && (
                  <span className="font-mono text-[11px] text-ice">
                    {formatWindowHours(win.open_time, win.close_time)}
                  </span>
                )}
                <span className="font-mono text-[11px] text-muted-text ml-auto">
                  {group.length} booking{group.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-border to-transparent mb-4" />

              {/* Table */}
              <div className="bg-surface-1 rounded-2xl border border-border/60 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-text font-normal">
                        Name
                      </th>
                      <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-text font-normal">
                        Hollow
                      </th>
                      <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-text font-normal hidden md:table-cell">
                        Phone
                      </th>
                      <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-text font-normal">
                        Status
                      </th>
                      <th className="px-5 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((booking, i) => (
                      <tr
                        key={booking.id}
                        className={`border-t border-border/30 hover:bg-surface-2/50 transition-colors duration-150 ${
                          i % 2 === 1 ? "bg-surface-2/20" : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-text-primary text-sm font-medium">
                          {booking.customer_name}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-ice font-medium">
                            {booking.hollow_depth}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-muted-text text-sm hidden md:table-cell">
                          {booking.customer_phone}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="font-mono text-[10px] uppercase tracking-widest text-muted-text hover:text-ice transition-colors duration-200"
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed:
      "bg-ice/10 text-ice border-l-2 border-ice/70 pl-3",
    completed:
      "bg-success/10 text-success border-l-2 border-success/70 pl-3",
    cancelled:
      "bg-danger/10 text-danger border-l-2 border-danger/70 pl-3",
  };

  const cls = styles[status] ?? "bg-surface-2 text-muted-text border-l-2 border-muted-text/30 pl-3";

  return (
    <span
      className={`inline-flex font-mono text-[10px] uppercase tracking-widest py-1 pr-3 rounded-md ${cls}`}
    >
      {status}
    </span>
  );
}
