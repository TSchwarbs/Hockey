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
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-semibold text-xl text-foreground">Bookings</h1>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {bookings.length} upcoming
        </span>
      </div>

      {sortedDates.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-10 text-center">
          <p className="text-muted-foreground text-sm">No upcoming bookings.</p>
          <p className="text-muted-foreground/50 text-xs mt-1">New bookings will appear here.</p>
        </div>
      )}

      <div className="space-y-9">
        {sortedDates.map((date) => {
          const group = grouped[date];
          const win = group[0].drop_off_windows;
          return (
            <section key={date}>
              {/* Date group header */}
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-semibold text-foreground text-sm">
                  {formatWindowDate(date)}
                </h2>
                {win && (
                  <span className="font-mono text-xs text-primary">
                    {formatWindowHours(win.open_time, win.close_time)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {group.length} booking{group.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-px bg-border mb-4" />

              {/* Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Hollow
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-normal hidden md:table-cell">
                        Phone
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-secondary/40 transition-colors duration-100"
                      >
                        <td className="px-4 py-3.5 text-foreground text-sm font-medium">
                          {booking.customer_name}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-sm text-primary font-medium">
                            {booking.hollow_depth}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground text-sm hidden md:table-cell">
                          {booking.customer_phone}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150"
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
    confirmed: "bg-primary/15 text-primary",
    completed: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
  };

  const cls = styles[status] ?? "bg-secondary text-muted-foreground";

  return (
    <span className={`inline-flex font-mono text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-md ${cls}`}>
      {status}
    </span>
  );
}
