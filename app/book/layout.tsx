import { BookingProvider } from "@/components/booking/BookingStore";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/constants";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <header className="bg-brand-navy text-white">
          <div className="max-w-2xl mx-auto px-6 py-5">
            <Link href="/" className="font-semibold tracking-wide text-lg hover:text-white/80 transition-colors">
              {BUSINESS_NAME}
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
          {children}
        </main>
      </div>
    </BookingProvider>
  );
}
