import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";
import type { BookingWithWindow } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getUpcomingBookings(): Promise<BookingWithWindow[]> {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select("*, drop_off_windows(*)")
    .gte("drop_off_windows.date", today)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingWithWindow[];
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (status === "completed") return "secondary";
  return "destructive";
}

export default async function DashboardPage() {
  const bookings = await getUpcomingBookings();

  // Group by window date
  const grouped = bookings.reduce<Record<string, BookingWithWindow[]>>((acc, b) => {
    const date = b.drop_off_windows?.date ?? "unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">Bookings</h1>
        <span className="text-brand-steel text-sm">{bookings.length} total</span>
      </div>

      {sortedDates.length === 0 && (
        <p className="text-brand-steel">No upcoming bookings.</p>
      )}

      <div className="space-y-10">
        {sortedDates.map((date) => {
          const group = grouped[date];
          const win = group[0].drop_off_windows;
          return (
            <section key={date}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-semibold text-brand-navy">{formatWindowDate(date)}</h2>
                {win && (
                  <span className="text-brand-steel text-sm">
                    {formatWindowHours(win.open_time, win.close_time)}
                  </span>
                )}
                <span className="text-brand-steel text-sm ml-auto">{group.length} booking{group.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-brand-steel text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Name</th>
                      <th className="text-left px-5 py-3 font-medium">Hollow</th>
                      <th className="text-left px-5 py-3 font-medium">Phone</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {group.map((booking) => (
                      <tr key={booking.id} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-brand-navy">{booking.customer_name}</td>
                        <td className="px-5 py-4 font-mono text-brand-steel">{booking.hollow_depth}</td>
                        <td className="px-5 py-4 text-brand-steel">{booking.customer_phone}</td>
                        <td className="px-5 py-4">
                          <Badge variant={statusVariant(booking.status)} className="capitalize">
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="text-brand-blue hover:underline text-xs font-medium"
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
