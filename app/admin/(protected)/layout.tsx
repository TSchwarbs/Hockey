import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BUSINESS_NAME } from "@/lib/constants";
import AdminSignOutButton from "@/components/admin/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-semibold">{BUSINESS_NAME}</span>
            <nav className="flex gap-6 text-sm text-white/70">
              <Link href="/admin/dashboard" className="hover:text-white transition-colors">Bookings</Link>
              <Link href="/admin/windows" className="hover:text-white transition-colors">Windows</Link>
            </nav>
          </div>
          <AdminSignOutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
