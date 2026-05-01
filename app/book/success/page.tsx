import Link from "next/link";
import { BUSINESS_NAME, CONTACT_EMAIL } from "@/lib/constants";

export default function SuccessPage() {
  return (
    <div className="text-center py-10 animate-fade-up">
      {/* Animated checkmark */}
      <div className="inline-flex items-center justify-center mb-8" style={{ animation: "circle-glow 1.4s ease-out 0.3s both" }}>
        <div
          className="relative w-24 h-24 rounded-full border-2 border-ice/30 flex items-center justify-center"
          style={{ boxShadow: "0 0 0 8px rgba(0,212,255,0.05), 0 0 0 16px rgba(0,212,255,0.025)" }}
        >
          {/* Outer ring */}
          <svg
            viewBox="0 0 96 96"
            fill="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <circle
              cx="48"
              cy="48"
              r="46"
              stroke="#00D4FF"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="289"
              strokeDashoffset="0"
            />
          </svg>
          {/* Checkmark */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="w-10 h-10"
            aria-hidden
          >
            <path
              d="M8 20l8 8L32 12"
              stroke="#00D4FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              style={{ animation: "checkmark-draw 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both" }}
            />
          </svg>
        </div>
      </div>

      <h1
        className="font-display text-[72px] leading-tight uppercase text-text-primary mb-4"
        style={{ animationDelay: "0.6s" }}
      >
        You&apos;re Booked.
      </h1>

      <p
        className="text-steel text-lg mb-2 animate-fade-up"
        style={{ animationDelay: "0.7s" }}
      >
        Check your email for confirmation and your drop-off details.
      </p>
      <p
        className="text-muted-text text-sm mb-12 font-mono animate-fade-up"
        style={{ animationDelay: "0.8s" }}
      >
        The email includes a link to cancel if plans change.
      </p>

      {/* Next steps card */}
      <div
        className="bg-surface-1 border border-border/60 rounded-2xl p-6 text-left max-w-sm mx-auto mb-10 animate-fade-up"
        style={{ animationDelay: "0.9s" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-text mb-4">
          What to do next
        </p>
        <ol className="space-y-3">
          {[
            "Check your inbox for the confirmation email.",
            "Bring your skates to the drop box during your window.",
            "Pick them up the next day — sharp and ready.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-display text-[20px] text-ice/60 leading-none mt-0.5 flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-muted-text text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <p
        className="text-muted-text text-sm mb-8 animate-fade-up"
        style={{ animationDelay: "1s" }}
      >
        Questions?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-ice hover:underline transition-colors">
          {CONTACT_EMAIL}
        </a>
      </p>

      <div
        className="flex items-center justify-center gap-4 animate-fade-up"
        style={{ animationDelay: "1.1s" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-text border border-border/60 hover:border-steel/40 hover:text-steel rounded-full px-6 h-10 transition-all duration-200 cursor-pointer"
        >
          Back to {BUSINESS_NAME}
        </Link>
      </div>
    </div>
  );
}
