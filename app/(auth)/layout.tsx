import { AuthHeader } from "@/components/layout/AuthHeader"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative flex flex-col">
            <AuthHeader />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    )
}
