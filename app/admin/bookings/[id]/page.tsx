import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking";
import AdminCancelButton from "@/components/admin/CancelButton";
import type { BookingWithWindow } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getBooking(id: string): Promise<BookingWithWindow | null> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, drop_off_windows(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BookingWithWindow;
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (status === "completed") return "secondary";
  return "destructive";
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) notFound();

  const win = booking.drop_off_windows;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard" className="text-brand-steel hover:text-brand-navy text-sm">
          ← Bookings
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{booking.customer_name}</h1>
          <p className="text-brand-steel text-sm mt-1">Booked {new Date(booking.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
        </div>
        <Badge variant={statusVariant(booking.status)} className="capitalize text-sm px-3 py-1">
          {booking.status}
        </Badge>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 mb-6">
        <Section label="Service" value="Standard Skate Sharpening" />
        <Section label="Hollow depth" value={booking.hollow_depth} mono />
        <Section label="Drop-off date" value={formatWindowDate(win.date)} />
        <Section label="Window" value={formatWindowHours(win.open_time, win.close_time)} />
        <Section label="Pickup" value={getPickupDate(win.date)} />

        <div className="px-5 py-4">
          <p className="text-xs text-brand-steel uppercase tracking-widest mb-3 font-medium">Customer</p>
          <div className="space-y-1.5 text-sm">
            <p className="text-brand-navy">{booking.customer_email}</p>
            <p className="text-brand-navy">{booking.customer_phone}</p>
            {booking.notes && (
              <p className="text-brand-steel mt-2 italic">&ldquo;{booking.notes}&rdquo;</p>
            )}
          </div>
        </div>
      </div>

      {booking.status === "confirmed" && (
        <AdminCancelButton bookingId={booking.id} />
      )}
    </div>
  );
}

function Section({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-4 flex justify-between items-baseline gap-4">
      <span className="text-brand-steel text-sm flex-shrink-0">{label}</span>
      <span className={`text-brand-navy text-sm font-medium text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
