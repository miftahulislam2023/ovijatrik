export default async function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
            <main className="min-h-screen bg-background">
                <div className="max-w-screen-2xl mx-auto w-full">
                    {children}
                </div>
            </main>
    )
}