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
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !window_) {
    return (
      <div className="bg-destructive/8 border border-destructive/25 rounded-xl p-5 text-destructive text-sm">
        {error ?? "Drop-off window not found."}
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Step header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
          Step 2 of 3
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Your Details
        </h1>
      </div>

      {/* Window summary */}
      <div className="bg-card rounded-xl border border-primary/20 p-5 mb-7">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
          Drop-off window
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-foreground font-medium text-sm">{formatWindowDate(window_.date)}</p>
            <p className="text-primary text-sm mt-1 font-mono">
              {formatWindowHours(window_.open_time, window_.close_time)}
            </p>
            <p className="text-muted-foreground text-xs mt-1.5 font-mono">
              Pickup: {getPickupDate(window_.date)}
            </p>
          </div>
          <button
            onClick={() => router.push("/book")}
            className="text-xs text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded-lg px-3 py-1.5 transition-all duration-150 cursor-pointer flex-shrink-0"
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
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground">
              Notes
            </label>
            <span className="text-[10px] text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setCustomerFields({ notes: e.target.value })}
            placeholder='e.g. two pairs of skates, both 1/2"'
            rows={3}
            className="resize-none bg-card border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-150 rounded-xl text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!customerName || !customerEmail || !customerPhone}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:-translate-y-px transition-all duration-150 disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
        >
          Continue to Review
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
          className="peer w-full h-14 bg-card border border-border rounded-xl px-4 pt-5 pb-1 text-foreground text-sm outline-none transition-all duration-150 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-transparent"
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 pointer-events-none transition-all duration-150 origin-left uppercase tracking-wider ${
            lifted
              ? "top-2 text-[9px] text-primary"
              : "top-[18px] text-[11px] text-muted-foreground"
          }`}
        >
          {label}
        </label>
      </div>
      {hint && (
        <p className="mt-1.5 text-muted-foreground/65 text-xs">{hint}</p>
      )}
    </div>
  );
}
