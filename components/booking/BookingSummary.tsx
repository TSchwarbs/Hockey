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
    <div className="sticky top-20 bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
          Order Summary
        </p>

        {!hollow ? (
          <p className="text-muted-foreground text-sm">
            Select your hollow depth to begin.
          </p>
        ) : (
          <>
            {/* Hollow display */}
            <div className="text-center py-5 mb-4 border-b border-border">
              <span className="font-display text-[64px] leading-none text-primary">
                {hollow}
              </span>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                Hollow Depth
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-2.5">
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

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className={`text-foreground text-xs text-right leading-relaxed ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
