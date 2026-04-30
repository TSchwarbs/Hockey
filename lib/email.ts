import { Resend } from "resend";
import { BUSINESS_NAME, CONTACT_EMAIL } from "@/lib/constants";
import type { BookingWithWindow } from "@/lib/types";
import { formatWindowDate, formatWindowHours } from "@/lib/booking";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.RESEND_FROM_EMAIL!;

export async function sendBookingConfirmation(booking: BookingWithWindow) {
  const { BookingConfirmation } = await import("@/components/email/BookingConfirmation");
  const win = booking.drop_off_windows;
  await getResend().emails.send({
    from: FROM(),
    to: booking.customer_email,
    subject: `Booking confirmed — ${formatWindowDate(win.date)}`,
    react: BookingConfirmation({ booking }),
  });
}

export async function sendAdminNewBooking(booking: BookingWithWindow) {
  const { AdminNewBooking } = await import("@/components/email/AdminNewBooking");
  await getResend().emails.send({
    from: FROM(),
    to: CONTACT_EMAIL,
    subject: `New booking from ${booking.customer_name}`,
    react: AdminNewBooking({ booking }),
  });
}

export async function sendBookingReminder(booking: BookingWithWindow) {
  const { BookingReminder } = await import("@/components/email/BookingReminder");
  const win = booking.drop_off_windows;
  await getResend().emails.send({
    from: FROM(),
    to: booking.customer_email,
    subject: `Reminder: drop off your skates today — ${formatWindowHours(win.open_time, win.close_time)}`,
    react: BookingReminder({ booking }),
  });
}

export async function sendCancellationConfirmation(booking: BookingWithWindow) {
  const { BookingCancellation } = await import("@/components/email/BookingCancellation");
  await getResend().emails.send({
    from: FROM(),
    to: booking.customer_email,
    subject: `Booking cancelled — ${BUSINESS_NAME}`,
    react: BookingCancellation({ booking }),
  });
}
