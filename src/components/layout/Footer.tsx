import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-primary">অভিযাত্রিক</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্য ও জীবিকা উন্নয়নে কাজ করে যাচ্ছে ২০০৫ সাল থেকে।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">দ্রুত লিংক</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/projects" className="hover:text-primary">প্রজেক্টসমূহ</Link></li>
              <li><Link href="/blog" className="hover:text-primary">ব্লগ</Link></li>
              <li><Link href="/gallery" className="hover:text-primary">গ্যালারি</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">সহায়তা</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/donation" className="hover:text-primary">ডোনেট করুন</Link></li>
              <li><Link href="/apply-for-donation" className="hover:text-primary">অনুদানের জন্য আবেদন</Link></li>
              <li><Link href="/contact" className="hover:text-primary">যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">আইনগত</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary">শর্তাবলী</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary">গোপনীয়তা নীতি</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} অভিযাত্রিক ফাউন্ডেশন — সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
