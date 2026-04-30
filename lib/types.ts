export type HollowDepth = '3/8"' | '1/2"' | '5/8"';
export type BookingStatus = "confirmed" | "cancelled" | "completed";

export interface DropOffWindow {
  id: string;
  date: string;
  open_time: string;
  close_time: string;
  max_bookings: number | null;
  is_blocked: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  window_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  hollow_depth: HollowDepth;
  notes: string | null;
  status: BookingStatus;
  cancellation_token: string;
  token_expires_at: string;
  reminder_sent: boolean;
  created_at: string;
}

export interface BookingWithWindow extends Booking {
  drop_off_windows: DropOffWindow;
}

export interface CreateBookingPayload {
  window_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  hollow_depth: HollowDepth;
  notes?: string;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}
