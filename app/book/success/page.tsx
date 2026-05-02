import Link from "next/link";
import { BUSINESS_NAME, CONTACT_EMAIL } from "@/lib/constants";

export default function SuccessPage() {
  return (
    <div className="text-center py-10 animate-fade-up">
      {/* Checkmark */}
      <div className="inline-flex items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/5">
          <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden>
            <path
              d="M8 20l8 8L32 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              strokeDasharray="100"
              style={{ animation: "checkmark-draw 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}
            />
          </svg>
        </div>
      </div>

      <h1 className="font-display text-[64px] leading-tight uppercase text-foreground mb-3">
        You&apos;re Booked.
      </h1>

      <p className="text-foreground/75 text-base mb-1.5">
        Check your email for confirmation and drop-off details.
      </p>
      <p className="text-muted-foreground text-sm mb-10">
        The email includes a cancellation link if plans change.
      </p>

      {/* Next steps */}
      <div className="bg-card border border-border rounded-xl p-6 text-left max-w-sm mx-auto mb-9">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
          What to do next
        </p>
        <ol className="space-y-3">
          {[
            "Check your inbox for the confirmation email.",
            "Bring your skates to the drop box during your window.",
            "Pick them up the next day, sharp and ready.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-muted-foreground text-sm mb-7">
        Questions?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
          {CONTACT_EMAIL}
        </a>
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground border border-border hover:border-border/80 hover:text-foreground rounded-full px-6 h-10 transition-all duration-150"
      >
        Back to {BUSINESS_NAME}
      </Link>
    </div>
  );
}
