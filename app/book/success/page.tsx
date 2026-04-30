import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BUSINESS_NAME, CONTACT_EMAIL } from "@/lib/constants";

export default function SuccessPage() {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10 mb-6">
        <svg
          className="w-8 h-8 text-brand-blue"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-brand-navy mb-3">You&apos;re booked!</h1>
      <p className="text-brand-steel mb-2">
        Check your email for a confirmation with your drop-off details.
      </p>
      <p className="text-brand-steel text-sm mb-10">
        The email includes a link to cancel if your plans change.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 text-left mb-8 max-w-sm mx-auto">
        <h2 className="font-semibold text-brand-navy mb-3">What to do next</h2>
        <ol className="text-sm text-brand-steel space-y-2 list-decimal list-inside leading-relaxed">
          <li>Check your inbox for the confirmation email.</li>
          <li>Bring your skates to the drop box during your window.</li>
          <li>Pick them up the next day — sharp and ready.</li>
        </ol>
      </div>

      <p className="text-brand-steel text-sm mb-6">
        Questions? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-blue hover:underline">
          {CONTACT_EMAIL}
        </a>
      </p>

      <Link href="/">
        <Button variant="outline" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white">
          Back to {BUSINESS_NAME}
        </Button>
      </Link>
    </div>
  );
}
