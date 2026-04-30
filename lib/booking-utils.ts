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
