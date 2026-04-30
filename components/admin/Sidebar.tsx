'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  SlidersHorizontal, 
  ClipboardList, 
  Settings, 
  Users,
  LogOut,
  Store,
  MonitorPlay,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Banners', href: '/admin/banners', icon: MonitorPlay },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Attributes', href: '/admin/attributes', icon: SlidersHorizontal },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Messages', href: '/admin/contact', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between hidden lg:flex mt-16 pt-0">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900",
                    isActive && "bg-zinc-900 text-zinc-50 font-medium border-l-2 border-zinc-50 rounded-l-none pl-[10px]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <Link href="/">
           <Button variant="outline" className="h-11 w-full justify-start gap-2 rounded-xl border-zinc-800 bg-zinc-900/90 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:text-white hover:bg-zinc-800">
            <Store className="h-4 w-4" />
            Storefront
          </Button>
        </Link>
      </div>
    </aside>
  );
}
