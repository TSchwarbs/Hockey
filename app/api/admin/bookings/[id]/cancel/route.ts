import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendCancellationConfirmation } from "@/lib/email";
import type { ApiResponse, BookingWithWindow } from "@/lib/types";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  // Verify admin session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const serviceClient = await createServiceClient();

  const { data: booking, error: fetchError } = await serviceClient
    .from("bookings")
    .select("*, drop_off_windows(*)")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "confirmed") {
    return NextResponse.json({ success: false, error: "Booking is not in a cancellable state" }, { status: 409 });
  }

  const { error } = await serviceClient
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: "Failed to cancel booking" }, { status: 500 });
  }

  const bookingWithWindow = { ...booking, status: "cancelled" } as BookingWithWindow;
  sendCancellationConfirmation(bookingWithWindow).catch(console.error);

  return NextResponse.json({ success: true });
}
