import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from '@/lib/supabase/server'

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />
            <main className="flex-1 pt-[80px] lg:pt-[140px]">
                {children}
            </main>
            <Footer />
        </div>
    )
}
