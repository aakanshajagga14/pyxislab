import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { DashboardStats } from "@/components/landing/DashboardStats";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--brand-navy)] text-[var(--brand-ink)]">
      <SiteNav />
      <main>
        <Hero />
        <DashboardStats />
      </main>
      <Footer />
    </div>
  );
}
