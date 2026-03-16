import { notFound } from "next/navigation";
import { getWeeklyProjectBySlug } from "@/actions/weekly-project";

function maskPhone(phone?: string | null) {
    if (!phone) return "";
    if (!phone.startsWith("+8801") && !phone.startsWith("01")) return phone;
    const last2 = phone.slice(-2);
    return `+8801xxxxxxx${last2}`;
}

export default async function WeeklyProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getWeeklyProjectBySlug(slug);

    if (!project || project.deletedAt) {
        notFound();
    }

    const total = project.donations.reduce((sum, d) => sum + d.amount, 0);
    const progress = project.targetAmount
        ? Math.min(100, Math.round((total / project.targetAmount) * 100))
        : 0;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{project.titleBn}</h1>
                <p className="mt-3 text-sm text-muted-foreground">{project.descriptionBn}</p>

                <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        লক্ষ্য: <span className="font-semibold text-foreground">{project.targetAmount} টাকা</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        সংগ্রহিত: <span className="font-semibold text-foreground">{total} টাকা</span>
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">অগ্রগতি: {progress}%</p>
                </div>

                <section className="mt-10">
                    <h2 className="text-lg font-semibold">সাম্প্রতিক অনুদান</h2>
                    <div className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4 text-sm">
                        {project.donations.length === 0 && (
                            <p className="text-muted-foreground">এখনও কোনো অনুদান রেকর্ড করা হয়নি।</p>
                        )}

                        {project.donations.map((d) => (
                            <div
                                key={d.id}
                                className="flex flex-col justify-between gap-1 border-b border-border/60 pb-2 last:border-b-0 last:pb-0 md:flex-row md:items-center"
                            >
                                <div>
                                    <p className="font-medium">
                                        {d.donorName || "নাম প্রকাশে অনিচ্ছুক"}{" "}
                                        <span className="text-xs text-muted-foreground">({maskPhone(d.phone || undefined)})</span>
                                    </p>
                                    {d.comments && <p className="text-xs text-muted-foreground">{d.comments}</p>}
                                </div>
                                <p className="text-sm font-semibold text-primary">{d.amount} টাকা</p>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}
