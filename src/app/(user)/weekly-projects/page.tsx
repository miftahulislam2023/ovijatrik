import Link from "next/link";
import { getWeeklyProjects } from "@/actions/weekly-project";

export default async function WeeklyProjectsPage() {
    const projects = await getWeeklyProjects();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-5xl px-4 py-12">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">সাপ্তাহিক প্রজেক্টসমূহ</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    চলমান ও সাম্প্রতিক সাপ্তাহিক প্রজেক্টগুলো এখানে দেখতে পারবেন।
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/weekly-projects/${project.slug}`}
                            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
                        >
                            <h2 className="text-base font-semibold">{project.titleBn}</h2>
                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.descriptionBn}</p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                লক্ষ্য: <span className="font-semibold text-foreground">{project.targetAmount} টাকা</span>
                            </p>
                        </Link>
                    ))}

                    {projects.length === 0 && (
                        <p className="text-sm text-muted-foreground">এই মুহূর্তে কোনো সাপ্তাহিক প্রজেক্ট নেই।</p>
                    )}
                </div>
            </section>
        </main>
    );
}
