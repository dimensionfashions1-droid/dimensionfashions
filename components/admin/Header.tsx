'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { LogOut, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const router = useRouter();
  
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-zinc-950 border-b border-zinc-800 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-serif">
          DIMENSIONS
          <span className="text-[10px] uppercase font-sans tracking-widest bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 ml-2">Admin</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
