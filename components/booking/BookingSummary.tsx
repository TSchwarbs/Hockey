"use client";

import { useState, useEffect } from "react";
import { useBooking } from "@/components/booking/BookingStore";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking-utils";
import { DROP_BOX_ADDRESS } from "@/lib/constants";
import type { DropOffWindow } from "@/lib/types";

export default function BookingSummary() {
  const { hollow, windowDate, customerName } = useBooking();
  const [win, setWin] = useState<DropOffWindow | null>(null);

  useEffect(() => {
    if (!windowDate) {
      setWin(null);
      return;
    }
    fetch(`/api/windows/${windowDate}`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setWin(json.data); })
      .catch(() => {});
  }, [windowDate]);

  return (
    <div className="sticky top-6 bg-surface-2 rounded-2xl border border-t-ice/40 border-x-border/50 border-b-border/50 overflow-hidden">
      {/* Top accent stripe */}
      <div className="h-px bg-gradient-to-r from-ice/60 via-ice/20 to-transparent" />

      <div className="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-text mb-5">
          Order Summary
        </p>

        {!hollow ? (
          <p className="text-muted-text text-sm">
            Select your hollow depth to begin.
          </p>
        ) : (
          <>
            {/* Big hollow display */}
            <div className="text-center py-5 mb-5 border-b border-border/40">
              <span className="font-display text-[72px] leading-none text-ice">
                {hollow}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text mt-1">
                Hollow Depth
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-3">
              <SummaryRow label="Service" value="Standard Sharpening" />
              {win ? (
                <>
                  <SummaryRow label="Drop-off" value={formatWindowDate(win.date)} />
                  <SummaryRow
                    label="Window"
                    value={formatWindowHours(win.open_time, win.close_time)}
                    mono
                  />
                  <SummaryRow label="Pickup" value={getPickupDate(win.date)} />
                </>
              ) : windowDate ? (
                <SummaryRow label="Date" value={formatWindowDate(windowDate)} />
              ) : null}
              <SummaryRow label="Drop box" value={DROP_BOX_ADDRESS} />
              {customerName && (
                <SummaryRow label="Name" value={customerName} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-text flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-text-primary text-xs text-right leading-relaxed ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
