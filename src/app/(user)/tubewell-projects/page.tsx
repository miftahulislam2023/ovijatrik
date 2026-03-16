import Link from "next/link";
import { getTubewellProjects } from "@/actions/tubewell-project";

export default async function TubewellProjectsPage() {
    const projects = await getTubewellProjects();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-5xl px-4 py-12">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">টিউবওয়েল প্রজেক্টসমূহ</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    সম্পন্ন হওয়া টিউবওয়েল প্রজেক্টগুলোর সংক্ষিপ্ত বিবরণ ও অবস্থান।
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/tubewell-projects/${project.slug}`}
                            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
                        >
                            <h2 className="text-base font-semibold">{project.titleBn}</h2>
                            <p className="mt-1 text-xs text-muted-foreground">অবস্থান: {project.location}</p>
                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.descriptionBn}</p>
                        </Link>
                    ))}

                    {projects.length === 0 && (
                        <p className="text-sm text-muted-foreground">এখনও কোনো টিউবওয়েল প্রজেক্ট যুক্ত করা হয়নি।</p>
                    )}
                </div>
            </section>
        </main>
    );
}
