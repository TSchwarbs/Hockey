import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getWindowById, countBookingsForWindow, tokenExpiresAt, isWithinBookingWindow } from "@/lib/booking";
import { sendBookingConfirmation, sendAdminNewBooking } from "@/lib/email";
import type { ApiResponse, CreateBookingPayload, BookingWithWindow, Booking } from "@/lib/types";

const VALID_HOLLOWS = ['3/8"', '1/2"', '5/8"'] as const;

export async function POST(req: Request): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const payload = body as Partial<CreateBookingPayload>;

  // Validate required fields
  if (!payload.window_id || !payload.customer_name || !payload.customer_email ||
      !payload.customer_phone || !payload.hollow_depth) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  if (!VALID_HOLLOWS.includes(payload.hollow_depth as (typeof VALID_HOLLOWS)[number])) {
    return NextResponse.json({ success: false, error: "Invalid hollow depth" }, { status: 400 });
  }

  // Email format sanity check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customer_email)) {
    return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
  }

  // Validate window exists and is not blocked
  const window_ = await getWindowById(payload.window_id);
  if (!window_) {
    return NextResponse.json({ success: false, error: "Drop-off window not found" }, { status: 404 });
  }

  if (window_.is_blocked) {
    return NextResponse.json({ success: false, error: "This drop-off window is no longer available" }, { status: 409 });
  }

  // Check advance booking limit
  if (!isWithinBookingWindow(window_.date)) {
    return NextResponse.json(
      { success: false, error: "This date is outside the booking window" },
      { status: 409 }
    );
  }

  // Check capacity
  if (window_.max_bookings !== null) {
    const count = await countBookingsForWindow(window_.id);
    if (count >= window_.max_bookings) {
      return NextResponse.json(
        { success: false, error: "This drop-off window is fully booked" },
        { status: 409 }
      );
    }
  }

  const supabase = await createServiceClient();
  const expiresAt = tokenExpiresAt(window_.date);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      window_id: payload.window_id,
      customer_name: payload.customer_name.trim(),
      customer_email: payload.customer_email.trim().toLowerCase(),
      customer_phone: payload.customer_phone.trim(),
      hollow_depth: payload.hollow_depth,
      notes: payload.notes?.trim() || null,
      token_expires_at: expiresAt,
    })
    .select()
    .single<Booking>();

  if (error || !booking) {
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }

  const bookingWithWindow: BookingWithWindow = {
    ...booking,
    drop_off_windows: window_,
  };

  // Fire-and-forget emails — don't fail the booking if email fails
  Promise.all([
    sendBookingConfirmation(bookingWithWindow),
    sendAdminNewBooking(bookingWithWindow),
  ]).catch(console.error);

  return NextResponse.json({ success: true, data: { id: booking.id } }, { status: 201 });
}
