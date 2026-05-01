import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBookingReminder } from "@/lib/email";
import type { BookingWithWindow } from "@/lib/types";
import type { ApiResponse } from "@/lib/types";

export async function GET(req: Request): Promise<NextResponse<ApiResponse<{ sent: number }>>> {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, drop_off_windows!inner(*)")
    .eq("status", "confirmed")
    .eq("reminder_sent", false)
    .eq("drop_off_windows.date", today);

  if (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }

  const toRemind = (bookings ?? []) as BookingWithWindow[];
  let sent = 0;

  for (const booking of toRemind) {
    try {
      await sendBookingReminder(booking);
      await supabase.from("bookings").update({ reminder_sent: true }).eq("id", booking.id);
      sent++;
    } catch {
      // Log and continue — don't abort the whole batch for one failed email
      console.error(`Reminder failed for booking ${booking.id}`);
    }
  }

  return NextResponse.json({ success: true, data: { sent } });
}
