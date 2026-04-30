"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  // Redirect to hollow selection if hollow not chosen
  useEffect(() => {
    if (!hollow) router.replace("/book");
  }, [hollow, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hollow || !windowId) return;
    router.push("/book/confirm");
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !window_) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error ?? "Drop-off window not found."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <p className="text-brand-steel text-sm font-medium tracking-widest uppercase mb-2">
        Step 2 of 3
      </p>
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Your details</h1>

      {/* Window summary */}
      <div className="bg-brand-navy text-white rounded-xl p-5 mb-8">
        <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Drop-off window</p>
        <p className="font-semibold text-lg">{formatWindowDate(window_.date)}</p>
        <p className="text-white/70 text-sm mt-1">
          {formatWindowHours(window_.open_time, window_.close_time)}
        </p>
        <p className="text-white/50 text-xs mt-3">
          Pickup: {getPickupDate(window_.date)}
        </p>
        <button
          onClick={() => router.push("/book")}
          className="text-brand-blue text-xs mt-3 hover:underline"
        >
          Change date
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            value={customerName}
            onChange={(e) => setCustomerFields({ customerName: e.target.value })}
            placeholder="Jane Smith"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerFields({ customerEmail: e.target.value })}
            placeholder="jane@example.com"
            className="mt-1"
          />
          <p className="text-brand-steel text-xs mt-1">Your confirmation and cancellation link will be sent here.</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerFields({ customerPhone: e.target.value })}
            placeholder="(555) 555-5555"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes <span className="text-brand-steel font-normal">(optional)</span></Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setCustomerFields({ notes: e.target.value })}
            placeholder="e.g. two pairs of skates, both 1/2&quot; please"
            rows={3}
            className="mt-1 resize-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white py-6 text-base font-semibold"
        >
          Continue → Review booking
        </Button>
      </form>
    </div>
  );
}
