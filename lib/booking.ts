import { createServiceClient } from "@/lib/supabase/server";
import type { DropOffWindow, Booking } from "@/lib/types";

export const MAX_ADVANCE_DAYS = 14;

export function formatWindowHours(openTime: string, closeTime: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  return `${fmt(openTime)} – ${fmt(closeTime)}`;
}

export function formatWindowDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPickupDate(windowDate: string): string {
  const date = new Date(`${windowDate}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function tokenExpiresAt(windowDate: string): string {
  const date = new Date(`${windowDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString();
}

export function isWithinBookingWindow(windowDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${windowDate}T00:00:00`);
  const diffDays = Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays >= 0 && diffDays <= MAX_ADVANCE_DAYS;
}

export async function getAvailableWindows(): Promise<DropOffWindow[]> {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS);
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
