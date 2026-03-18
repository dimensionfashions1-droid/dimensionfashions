import { AzaNavbar } from "@/components/layout/AzaNavbar"
import { Footer } from "@/components/layout/Footer"

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <AzaNavbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
