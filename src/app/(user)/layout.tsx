import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#fbfbf9] text-slate-900 dark:bg-[#0f1416] dark:text-slate-100">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
                {children}
            </main>
            <SiteFooter />
        </div>
    )
}