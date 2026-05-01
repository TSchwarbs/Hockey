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
    <div className="min-h-screen bg-background">
      <header className="bg-surface-1 border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl tracking-widest text-text-primary">
              {BUSINESS_NAME}
            </span>
            <nav className="flex gap-1">
              <AdminNavLink href="/admin/dashboard">Bookings</AdminNavLink>
              <AdminNavLink href="/admin/windows">Windows</AdminNavLink>
            </nav>
          </div>
          <AdminSignOutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[11px] uppercase tracking-widest text-muted-text hover:text-text-primary hover:bg-surface-2 px-3 py-1.5 rounded-lg transition-all duration-200"
    >
      {children}
    </Link>
  );
}
