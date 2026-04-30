"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WindowForm({ existingId }: { existingId?: string }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [openTime, setOpenTime] = useState("16:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [maxBookings, setMaxBookings] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      date,
      open_time: openTime,
      close_time: closeTime,
      max_bookings: maxBookings ? parseInt(maxBookings, 10) : null,
    };

    const url = existingId ? `/api/admin/windows/${existingId}` : "/api/admin/windows";
    const method = existingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (json.success) {
      router.refresh();
      if (!existingId) {
        setDate("");
        setMaxBookings("");
      }
    } else {
      setError(json.error ?? "Failed to save window.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="open_time">Opens</Label>
          <Input
            id="open_time"
            type="time"
            required
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="close_time">Closes</Label>
          <Input
            id="close_time"
            type="time"
            required
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="max">Max bookings <span className="text-brand-steel font-normal">(leave blank for unlimited)</span></Label>
        <Input
          id="max"
          type="number"
          min={1}
          value={maxBookings}
          onChange={(e) => setMaxBookings(e.target.value)}
          placeholder="Unlimited"
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white"
      >
        {loading ? "Saving…" : existingId ? "Update window" : "Add window"}
      </Button>
    </form>
  );
}
