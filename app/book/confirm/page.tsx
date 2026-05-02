"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking-utils";
import { DROP_BOX_ADDRESS } from "@/lib/constants";
import type { DropOffWindow } from "@/lib/types";

export default function ConfirmPage() {
  const router = useRouter();
  const { hollow, windowId, windowDate, customerName, customerEmail, customerPhone, notes, reset } =
    useBooking();

  const [window_, setWindow_] = useState<DropOffWindow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hollow || !windowId || !windowDate || !customerName || !customerEmail || !customerPhone) {
      router.replace("/book");
    }
  }, [hollow, windowId, windowDate, customerName, customerEmail, customerPhone, router]);

  useEffect(() => {
    if (!windowDate) return;
    fetch(`/api/windows/${windowDate}`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setWindow_(json.data); });
  }, [windowDate]);

  async function handleConfirm() {
    if (!hollow || !windowId) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        window_id: windowId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        hollow_depth: hollow,
        notes: notes || undefined,
      }),
    });

    const json = await res.json();
    if (json.success) {
      reset();
      router.push("/book/success");
    } else {
      setError(json.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!hollow || !windowId) return null;

  return (
    <div className="animate-fade-up">
      {/* Step header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
          Step 3 of 3
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Review Your Booking
        </h1>
      </div>

      {/* Review card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {/* Hollow display */}
        <div className="text-center py-7 border-b border-border">
          <span className="font-display text-[60px] leading-none text-primary">{hollow}</span>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1.5">
            Hollow Depth
          </p>
        </div>

        {/* Line items */}
        <div className="divide-y divide-border">
          <ReviewRow label="Service" value="Standard Skate Sharpening" />
          {window_ && (
            <>
              <ReviewRow label="Drop-off Date" value={formatWindowDate(window_.date)} />
              <ReviewRow
                label="Drop-off Window"
                value={formatWindowHours(window_.open_time, window_.close_time)}
                mono
              />
              <ReviewRow label="Pickup Date" value={getPickupDate(window_.date)} />
            </>
          )}
          <ReviewRow label="Drop Box" value={DROP_BOX_ADDRESS} />
        </div>

        {/* Customer info */}
        <div className="px-6 py-5 bg-secondary/40">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Your Info
          </p>
          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">{customerName}</p>
            <p className="text-muted-foreground text-sm">{customerEmail}</p>
            <p className="text-muted-foreground text-sm">{customerPhone}</p>
            {notes && (
              <p className="text-muted-foreground/70 text-xs mt-2 pt-2 border-t border-border leading-relaxed">
                {notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/8 border border-destructive/25 rounded-xl p-4 mb-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:-translate-y-px transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2.5 mb-3"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin-arc" />
            Confirming…
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>

      <button
        onClick={() => router.back()}
        className="w-full text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150 py-2 cursor-pointer"
      >
        ← Go Back
      </button>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-6 py-4">
      <span className="text-xs uppercase tracking-wider text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className={`text-foreground text-sm text-right ${mono ? "font-mono text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}
