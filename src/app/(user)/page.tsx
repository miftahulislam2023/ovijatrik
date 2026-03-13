
import Image from "next/image"
import Link from "next/link"
import { Droplets, HandHeart, Sparkles, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
  en: {
    heroTag: "Weekly hope drives",
    heroTitle: "Ovijatrik builds steady relief with weekly projects, clean water, and long-term care.",
    heroBody:
      "We walk beside families every week with food, education, and health support while building lasting impact projects like tubewells and community partnerships across Bangladesh.",
    donateNow: "Donate now",
    seeWeekly: "See weekly projects",
    weekTitle: "This week",
    weekBody: "Support our weekly family grocery drive in Kishoreganj.",
    weekMeta: "120 families scheduled",
    waterTitle: "Clean water focus",
    waterBody: "Documenting completed tubewells and maintenance support.",
    waterMeta: "48 sites served",
    highlight: [
      {
        title: "Weekly compassion",
        text: "Rotating weekly drives for food, health, and urgent relief.",
      },
      {
        title: "Water access",
        text: "Completed tubewell projects mapped and maintained.",
      },
      {
        title: "Community partners",
        text: "Local volunteers help identify families and ensure transparency.",
      },
    ],
    weeklyTag: "Weekly project",
    weeklyTitle: "Current weekly drives",
    viewAll: "View all",
    weeklyEmpty: "Weekly projects will appear here as soon as the first drive is published.",
    tubewellTag: "Tubewell archive",
    tubewellTitle: "Completed clean water projects",
    exploreArchive: "Explore archive",
    tubewellEmpty: "Tubewell stories will appear here as we add completed projects.",
  },
  bn: {
    heroTag: "সাপ্তাহিক আশার উদ্যোগ",
    heroTitle: "অভিযাত্রীক সাপ্তাহিক প্রকল্প, বিশুদ্ধ পানি ও দীর্ঘমেয়াদি যত্নের মাধ্যমে ধারাবাহিক সহায়তা দেয়।",
    heroBody:
      "প্রতি সপ্তাহে আমরা খাদ্য, শিক্ষা ও স্বাস্থ্য সহায়তা নিয়ে পরিবারের পাশে থাকি; পাশাপাশি টিউবওয়েল ও কমিউনিটি অংশীদারিত্বে দীর্ঘমেয়াদি প্রভাব তৈরি করি।",
    donateNow: "এখন দান করুন",
    seeWeekly: "সাপ্তাহিক প্রকল্প দেখুন",
    weekTitle: "এই সপ্তাহ",
    weekBody: "কিশোরগঞ্জে সাপ্তাহিক খাদ্য সহায়তা উদ্যোগে সহায়তা করুন।",
    weekMeta: "১২০ পরিবার নির্ধারিত",
    waterTitle: "বিশুদ্ধ পানির ফোকাস",
    waterBody: "সম্পন্ন টিউবওয়েল ও রক্ষণাবেক্ষণ আপডেট নথিভুক্ত করছি।",
    waterMeta: "৪৮টি স্থান সেবা পেয়েছে",
    highlight: [
      {
        title: "সাপ্তাহিক সহমর্মিতা",
        text: "খাদ্য, স্বাস্থ্য ও জরুরি সহায়তার জন্য সাপ্তাহিক উদ্যোগ।",
      },
      {
        title: "পানির প্রবেশাধিকার",
        text: "সম্পন্ন টিউবওয়েল প্রকল্প নথিভুক্ত ও রক্ষণাবেক্ষণ।",
      },
      {
        title: "কমিউনিটি অংশীদার",
        text: "স্থানীয় স্বেচ্ছাসেবকরা পরিবার চিহ্নিত ও স্বচ্ছতা নিশ্চিত করেন।",
      },
    ],
    weeklyTag: "সাপ্তাহিক প্রকল্প",
    weeklyTitle: "চলতি সাপ্তাহিক উদ্যোগ",
    viewAll: "সব দেখুন",
    weeklyEmpty: "প্রথম উদ্যোগ প্রকাশ হলে এখানে দেখা যাবে।",
    tubewellTag: "টিউবওয়েল আর্কাইভ",
    tubewellTitle: "সম্পন্ন বিশুদ্ধ পানির প্রকল্প",
    exploreArchive: "আর্কাইভ দেখুন",
    tubewellEmpty: "প্রথম আপডেট প্রকাশ হলে এখানে দেখা যাবে।",
  },
}

export default async function HomePage() {
  const language = await getRequestLanguage()
  const content = copy[language]
  const [weeklyProjects, tubewellProjects] = await Promise.all([
    prisma.weeklyProject.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.tubewellProject.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ])

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0f2f33] via-primary-dark to-[#e67954] px-8 py-16 text-white shadow-lg md:px-14">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 left-0 h-56 w-56 rounded-full bg-black/20 blur-3xl" />
        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">{content.heroTag}</p>
            <h1 className="text-3xl font-semibold md:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="text-base text-white/80 md:text-lg">
              {content.heroBody}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-white text-[#0f2f33] hover:bg-white/90">
                <Link href="/donation">{content.donateNow}</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/weekly-project">{content.seeWeekly}</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg">{content.weekTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/80">
                <p>{content.weekBody}</p>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  {content.weekMeta}
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg">{content.waterTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/80">
                <p>{content.waterBody}</p>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-white" />
                  {content.waterMeta}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {content.highlight.map((item, index) => {
          const icons = [HandHeart, Droplets, Users]
          const Icon = icons[index] ?? HandHeart
          return (
            <Card key={item.title} className="border-none bg-white shadow-soft">
              <CardHeader>
                <Icon className="h-5 w-5 text-primary-dark" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
            </Card>
          )
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary-dark">{content.weeklyTag}</p>
            <h2 className="text-2xl font-semibold">{content.weeklyTitle}</h2>
          </div>
          <Button asChild variant="outline" className="border-primary-dark text-primary-dark">
            <Link href="/weekly-project">{content.viewAll}</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {weeklyProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.imageUrls[0] && (
                <Image
                  src={project.imageUrls[0]}
                  alt={project.title}
                  width={1200}
                  height={720}
                  className="h-40 w-full object-cover"
                  unoptimized
                />
              )}
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {project.summary || project.description.slice(0, 120) + "..."}
              </CardContent>
            </Card>
          ))}
          {weeklyProjects.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {content.weeklyEmpty}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary-dark">{content.tubewellTag}</p>
            <h2 className="text-2xl font-semibold">{content.tubewellTitle}</h2>
          </div>
          <Button asChild variant="outline" className="border-primary-dark text-primary-dark">
            <Link href="/tubewell-project">{content.exploreArchive}</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tubewellProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.imageUrls[0] && (
                <Image
                  src={project.imageUrls[0]}
                  alt={project.title}
                  width={1200}
                  height={720}
                  className="h-40 w-full object-cover"
                  unoptimized
                />
              )}
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {project.description.slice(0, 120) + "..."}
              </CardContent>
            </Card>
          ))}
          {tubewellProjects.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {content.tubewellEmpty}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

