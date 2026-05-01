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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice mb-3">
          Step 3 of 3
        </p>
        <h1 className="font-display text-[56px] leading-tight uppercase text-text-primary">
          Review Your Order
        </h1>
      </div>

      {/* Main review card */}
      <div className="bg-surface-1 rounded-2xl border border-border/60 overflow-hidden mb-6">
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-ice/50 via-ice/15 to-transparent" />

        {/* Hollow depth — big display */}
        <div className="text-center py-8 border-b border-border/40">
          <span className="font-display text-[64px] leading-none text-ice">{hollow}</span>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text mt-1">
            Hollow Depth
          </p>
        </div>

        {/* Line items */}
        <div className="divide-y divide-border/30">
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

        {/* Customer info block */}
        <div className="px-6 py-5 bg-surface-2/50">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text mb-3">
            Your Info
          </p>
          <div className="space-y-1">
            <p className="text-text-primary text-sm">{customerName}</p>
            <p className="text-muted-text text-sm font-mono">{customerEmail}</p>
            <p className="text-muted-text text-sm font-mono">{customerPhone}</p>
            {notes && (
              <p className="text-muted-text/70 text-xs mt-2 pt-2 border-t border-border/30 leading-relaxed">
                {notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 mb-4 text-danger text-sm font-mono">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full h-14 rounded-full bg-ice text-background font-semibold text-base hover:bg-white hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-3 mb-3"
      >
        {submitting ? (
          <>
            <span
              className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin-arc"
              style={{ borderTopColor: "#080C10" }}
            />
            Confirming…
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>

      <button
        onClick={() => router.back()}
        className="w-full font-mono text-[11px] uppercase tracking-widest text-muted-text hover:text-steel transition-colors duration-200 py-2 cursor-pointer"
      >
        ← Go Back
      </button>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-6 py-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-text-primary text-sm text-right ${mono ? "font-mono text-ice" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
