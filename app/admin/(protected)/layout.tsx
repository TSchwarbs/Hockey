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
    <div className="dark min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-7">
            <span className="font-display text-xl tracking-widest text-foreground">
              {BUSINESS_NAME}
            </span>
            <nav className="flex gap-0.5">
              <AdminNavLink href="/admin/dashboard">Bookings</AdminNavLink>
              <AdminNavLink href="/admin/windows">Windows</AdminNavLink>
            </nav>
          </div>
          <AdminSignOutButton />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-all duration-150"
    >
      {children}
    </Link>
  );
}
