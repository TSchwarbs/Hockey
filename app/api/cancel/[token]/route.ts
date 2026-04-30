import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getBookingByToken } from "@/lib/booking";
import { sendCancellationConfirmation } from "@/lib/email";
import type { ApiResponse, BookingWithWindow } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { token } = await params;

  const booking = await getBookingByToken(token);

  if (!booking) {
    return NextResponse.json({ success: false, error: "Cancellation link not found." }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ success: false, error: "This booking has already been cancelled." }, { status: 409 });
  }

  if (new Date(booking.token_expires_at) < new Date()) {
    return NextResponse.json(
      {
        success: false,
        error: "The cancellation window has closed. Please contact us directly.",
      },
      { status: 410 }
    );
  }

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id);

  if (error) {
    return NextResponse.json({ success: false, error: "Failed to cancel booking." }, { status: 500 });
  }

  // Fetch the window to build the full booking object for the email
  const { data: window_ } = await supabase
    .from("drop_off_windows")
    .select("*")
    .eq("id", booking.window_id)
    .single();

  if (window_) {
    const bookingWithWindow: BookingWithWindow = {
      ...booking,
      status: "cancelled",
      drop_off_windows: window_,
    };
    sendCancellationConfirmation(bookingWithWindow).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
