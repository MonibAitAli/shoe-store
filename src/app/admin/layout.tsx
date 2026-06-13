import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Tag, Settings, LogOut, MessageSquare, FileText } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/discounts', label: 'Discounts', icon: Tag },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-border-subtle min-h-screen p-6 space-y-2">
        <Link href="/admin" className="font-bold text-lg tracking-tighter uppercase text-primary block mb-8">
          3bdoshoe Admin
        </Link>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}

        <div className="pt-8 mt-8 border-t border-border-subtle">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>

        <div className="pt-4">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-primary transition-colors">
            ← Back to Store
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
