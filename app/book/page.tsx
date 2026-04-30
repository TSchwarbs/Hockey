"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import { HOLLOW_OPTIONS } from "@/lib/constants";
import type { HollowDepth } from "@/lib/types";
import type { DropOffWindow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking";

export default function BookPage() {
  const { hollow, setHollow, setWindow } = useBooking();
  const router = useRouter();
  const [windows, setWindows] = useState<DropOffWindow[]>([]);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [windowsError, setWindowsError] = useState<string | null>(null);

  useEffect(() => {
    if (!hollow) return;
    setLoadingWindows(true);
    setWindowsError(null);
    fetch("/api/windows")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setWindows(json.data);
        else setWindowsError("Could not load available dates.");
      })
      .catch(() => setWindowsError("Could not load available dates."))
      .finally(() => setLoadingWindows(false));
  }, [hollow]);

  function handleSelectHollow(value: HollowDepth) {
    setHollow(value);
  }

  function handleSelectWindow(win: DropOffWindow) {
    setWindow(win.id, win.date);
    router.push(`/book/${win.date}`);
  }

  return (
    <div>
      {/* Step indicator */}
      <p className="text-brand-steel text-sm font-medium tracking-widest uppercase mb-2">
        Step 1 of 3
      </p>
      <h1 className="text-3xl font-bold text-brand-navy mb-2">Book your drop-off</h1>
      <p className="text-brand-steel mb-10">
        Choose your hollow depth, then pick an available drop-off date.
      </p>

      {/* Hollow selection */}
      <h2 className="text-lg font-semibold text-brand-navy mb-4">Hollow depth</h2>
      <div className="flex flex-col gap-3 mb-10">
        {HOLLOW_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelectHollow(option.value)}
            className={cn(
              "text-left border rounded-xl p-5 transition-all bg-white",
              hollow === option.value
                ? "border-brand-blue shadow-sm ring-2 ring-brand-blue"
                : "border-gray-200 hover:border-brand-steel"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono font-bold text-brand-navy text-xl mb-1">{option.label}</p>
                <p className="text-brand-steel text-sm leading-relaxed">{option.description}</p>
              </div>
              <span
                className={cn(
                  "mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 transition-all",
                  hollow === option.value
                    ? "border-brand-blue bg-brand-blue"
                    : "border-gray-300"
                )}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Date selection — appears after hollow is chosen */}
      {hollow && (
        <div>
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Drop-off date</h2>

          {loadingWindows && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}

          {windowsError && (
            <p className="text-red-500 text-sm">{windowsError}</p>
          )}

          {!loadingWindows && !windowsError && windows.length === 0 && (
            <p className="text-brand-steel text-sm">
              No drop-off windows are available in the next 14 days. Check back soon.
            </p>
          )}

          {!loadingWindows && windows.length > 0 && (
            <div className="flex flex-col gap-3">
              {windows.map((win) => (
                <button
                  key={win.id}
                  onClick={() => handleSelectWindow(win)}
                  className="text-left border border-gray-200 bg-white rounded-xl p-5 hover:border-brand-blue hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-brand-navy">{formatWindowDate(win.date)}</p>
                  <p className="text-brand-steel text-sm mt-1">
                    Drop off between {formatWindowHours(win.open_time, win.close_time)}
                  </p>
                  <p className="text-brand-steel text-sm">
                    Pickup: {getPickupDate(win.date)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
