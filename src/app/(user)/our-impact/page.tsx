export default function OurImpactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">আমাদের প্রভাব</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          গত কয়েক বছরে আমাদের কাজের মাধ্যমে যেসব পরিবর্তন এসেছে তার একটি সংক্ষিপ্ত চিত্র।
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">১,০০০+</p>
            <p className="mt-2 text-sm text-muted-foreground">পরিবার সরাসরি সহায়তা পেয়েছে</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">২০০+</p>
            <p className="mt-2 text-sm text-muted-foreground">শিক্ষা সহায়তা প্রজেক্ট</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">৫০+</p>
            <p className="mt-2 text-sm text-muted-foreground">টিউবওয়েল স্থাপন</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          এই সংখ্যাগুলো কেবল শুরু। আপনার সহযোগিতায় আমরা আরও অনেক দূর যেতে পারি।
        </p>
      </section>
    </main>
  );
}
