"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { DropOffWindow } from "@/lib/types";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking-utils";

interface Props {
  params: Promise<{ date: string }>;
}

export default function DateFormPage({ params }: Props) {
  const { date } = use(params);
  const router = useRouter();
  const { hollow, windowId, setWindow, setCustomerFields, customerName, customerEmail, customerPhone, notes } =
    useBooking();

  const [window_, setWindow_] = useState<DropOffWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/windows/${date}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setWindow_(json.data);
          setWindow(json.data.id, json.data.date);
        } else {
          setError("This drop-off date is not available.");
        }
      })
      .catch(() => setError("Failed to load window details."))
      .finally(() => setLoading(false));
  }, [date, setWindow]);

  useEffect(() => {
    if (!hollow) router.replace("/book");
  }, [hollow, router]);

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hollow || !windowId) return;
    router.push("/book/confirm");
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-up">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !window_) {
    return (
      <div className="bg-danger/10 border border-danger/30 rounded-2xl p-5 text-danger text-sm font-mono">
        {error ?? "Drop-off window not found."}
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Step header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice mb-3">
          Step 2 of 3
        </p>
        <h1 className="font-display text-[48px] leading-tight uppercase text-text-primary">
          Your Details
        </h1>
      </div>

      {/* Window summary card */}
      <div className="bg-surface-2 rounded-2xl border border-ice/20 p-5 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text mb-3">
          Drop-off window
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-text-primary font-medium">{formatWindowDate(window_.date)}</p>
            <p className="font-mono text-ice text-sm mt-1">
              {formatWindowHours(window_.open_time, window_.close_time)}
            </p>
            <p className="font-mono text-muted-text text-xs mt-2">
              Pickup: {getPickupDate(window_.date)}
            </p>
          </div>
          <button
            onClick={() => router.push("/book")}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-text hover:text-ice border border-border/60 hover:border-ice/40 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer flex-shrink-0"
          >
            Change
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FloatField
          id="name"
          label="Full Name"
          type="text"
          required
          autoComplete="name"
          value={customerName}
          onChange={(v) => setCustomerFields({ customerName: v })}
        />

        <FloatField
          id="email"
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          value={customerEmail}
          onChange={(v) => setCustomerFields({ customerEmail: v })}
          hint="Your confirmation and cancellation link will be sent here."
        />

        <FloatField
          id="phone"
          label="Phone Number"
          type="tel"
          required
          autoComplete="tel"
          value={customerPhone}
          onChange={(v) => setCustomerFields({ customerPhone: formatPhone(v) })}
        />

        {/* Notes */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <label htmlFor="notes" className="font-mono text-[11px] uppercase tracking-widest text-muted-text">
              Notes
            </label>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-text/50 bg-surface-2 px-2 py-0.5 rounded-full border border-border/40">
              Optional
            </span>
          </div>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setCustomerFields({ notes: e.target.value })}
            placeholder='e.g. two pairs of skates, both 1/2" please'
            rows={3}
            className="resize-none bg-surface-1 border-border/60 text-text-primary placeholder:text-muted-text/40 focus-visible:border-ice/60 focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] transition-all duration-200 rounded-xl text-sm font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!customerName || !customerEmail || !customerPhone}
          className="w-full h-14 rounded-full bg-ice text-background font-semibold text-base hover:bg-white hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Continue → Review Booking
        </button>
      </form>
    </div>
  );
}

/* ── Floating label input ──────────────────────────────────────── */

function FloatField({
  id,
  label,
  hint,
  onChange,
  ...inputProps
}: {
  id: string;
  label: string;
  hint?: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "id">) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!(inputProps.value as string);
  const lifted = focused || hasValue;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="peer w-full h-14 bg-surface-1 border border-border/60 rounded-xl px-4 pt-4 pb-1 text-text-primary text-sm font-sans outline-none transition-all duration-200 focus:border-ice/60 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] placeholder:text-transparent"
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 pointer-events-none transition-all duration-150 origin-left font-mono uppercase tracking-widest ${
            lifted
              ? "top-2 text-[9px] text-ice/70"
              : "top-[17px] text-[11px] text-muted-text"
          }`}
        >
          {label}
        </label>
      </div>
      {hint && (
        <p className="mt-1.5 text-muted-text/60 text-xs font-mono">{hint}</p>
      )}
    </div>
  );
}
