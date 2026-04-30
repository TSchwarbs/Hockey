"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminCancelButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, { method: "POST" });
    const json = await res.json();
    if (json.success) {
      router.refresh();
    } else {
      setError(json.error ?? "Failed to cancel booking.");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <Button
        variant="destructive"
        onClick={() => setConfirming(true)}
        className="w-full"
      >
        Cancel booking
      </Button>
    );
  }

  return (
    <div className="border border-red-200 rounded-xl p-5 bg-red-50">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-red-800 font-medium mb-4">
        This will cancel the booking and send a cancellation email to the customer. Are you sure?
      </p>
      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Cancelling…" : "Yes, cancel booking"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="flex-1"
        >
          Keep booking
        </Button>
      </div>
    </div>
  );
}
