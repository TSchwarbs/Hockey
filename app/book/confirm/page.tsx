"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatWindowDate, formatWindowHours, getPickupDate } from "@/lib/booking";
import { DROP_BOX_ADDRESS } from "@/lib/constants";
import type { DropOffWindow } from "@/lib/types";

export default function ConfirmPage() {
  const router = useRouter();
  const { hollow, windowId, windowDate, customerName, customerEmail, customerPhone, notes, reset } =
    useBooking();

  const [window_, setWindow_] = useState<DropOffWindow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard: redirect if state is incomplete
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
    <div>
      <p className="text-brand-steel text-sm font-medium tracking-widest uppercase mb-2">
        Step 3 of 3
      </p>
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Review your booking</h1>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 mb-6">
        <Row label="Service" value="Standard Skate Sharpening" />
        <Row label="Hollow depth" value={hollow} mono />
        {window_ && (
          <>
            <Row
              label="Drop-off date"
              value={formatWindowDate(window_.date)}
            />
            <Row
              label="Drop-off window"
              value={formatWindowHours(window_.open_time, window_.close_time)}
            />
            <Row label="Pickup" value={getPickupDate(window_.date)} />
          </>
        )}
        <Row label="Drop box" value={DROP_BOX_ADDRESS} />

        <div className="px-5 py-4">
          <p className="text-xs text-brand-steel uppercase tracking-widest mb-2 font-medium">Your info</p>
          <Separator className="mb-3" />
          <div className="space-y-1 text-sm text-brand-navy">
            <p>{customerName}</p>
            <p>{customerEmail}</p>
            <p>{customerPhone}</p>
            {notes && <p className="text-brand-steel">{notes}</p>}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-6 text-base font-semibold mb-3"
      >
        {submitting ? "Confirming…" : "Confirm booking"}
      </Button>

      <button
        onClick={() => router.back()}
        className="w-full text-brand-steel text-sm hover:text-brand-navy transition-colors py-2"
      >
        ← Go back
      </button>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-4 flex justify-between items-baseline gap-4">
      <span className="text-brand-steel text-sm flex-shrink-0">{label}</span>
      <span className={`text-brand-navy text-sm font-medium text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
