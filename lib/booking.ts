import { createServiceClient } from "@/lib/supabase/server";
import type { DropOffWindow, Booking } from "@/lib/types";

export {
  MAX_ADVANCE_DAYS,
  formatWindowHours,
  formatWindowDate,
  getPickupDate,
  tokenExpiresAt,
  isWithinBookingWindow,
} from "@/lib/booking-utils";

export async function getAvailableWindows(): Promise<DropOffWindow[]> {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("drop_off_windows")
    .select("*")
    .eq("is_blocked", false)
    .gte("date", today)
    .lte("date", maxDateStr)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWindowById(id: string): Promise<DropOffWindow | null> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("drop_off_windows")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function countBookingsForWindow(windowId: string): Promise<number> {
  const supabase = await createServiceClient();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("window_id", windowId)
    .eq("status", "confirmed");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getBookingByToken(token: string): Promise<Booking | null> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cancellation_token", token)
    .single();

  if (error) return null;
  return data;
}
