import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 placeholder:text-zinc-500">
      <Header />
      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 lg:pl-64 focus:outline-none">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
