import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BUSINESS_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

interface Props {
  params: Promise<{ token: string }>;
}

async function cancelBooking(token: string): Promise<{ success: boolean; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cancel/${token}`, { cache: "no-store" });
  return res.json();
}

export default async function CancelPage({ params }: Props) {
  const { token } = await params;
  const result = await cancelBooking(token);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <header className="bg-brand-navy text-white">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <span className="font-semibold tracking-wide text-lg">{BUSINESS_NAME}</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 text-center">
        {result.success ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-brand-navy mb-3">Booking cancelled</h1>
            <p className="text-brand-steel mb-6">
              Your booking has been cancelled. A confirmation has been sent to your email.
            </p>
            <Link href="/book">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                Book a new drop-off
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-brand-navy mb-3">Unable to cancel</h1>
            <p className="text-brand-steel mb-6">
              {result.error ?? "This cancellation link is not valid."}
            </p>
            <p className="text-brand-steel text-sm">
              Need help? Contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-blue hover:underline">{CONTACT_EMAIL}</a>{" "}
              or {CONTACT_PHONE}.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
