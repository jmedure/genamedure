import type { Metadata } from "next";
import { About } from "@/components/About";
import { BrandTicker } from "@/components/BrandTicker";
import { BrandsList } from "@/components/BrandsList";
import { Contact } from "@/components/Contact";
import { Header } from "@/components/Header";
import { HeroGallery } from "@/components/HeroGallery";
import { Stats } from "@/components/Stats";
import { VideoGallery } from "@/components/VideoGallery";
import { SITE } from "@/lib/content";
import { getMediaKit } from "@/lib/getMediaKit";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getMediaKit();
  return {
    title: `${SITE.name} — Media Kit`,
    description: content.site.about,
  };
}

export default async function Home() {
  const content = await getMediaKit();

  return (
    <div id="top" className="min-h-screen bg-white">
      <Header
        name={content.site.name}
        email={content.site.email}
        tiktokUrl={content.site.tiktokUrl}
      />

      <main className="flex w-full flex-col">
        <HeroGallery images={content.heroImages} />

        <div className="mx-auto flex w-full min-w-0 max-w-[1223px] flex-col items-center gap-20 pb-6 pt-20">
          <BrandTicker logos={content.brandLogos} />
          <About
            pronunciation={content.site.pronunciation}
            about={content.site.about}
          />
          <Stats
            lastUpdated={content.stats.lastUpdated}
            followers={content.stats.followers}
            periodLabel={content.stats.periodLabel}
            metrics={content.stats.metrics}
          />
          <div className="w-full min-w-0">
            <VideoGallery videos={content.galleryVideos} />
          </div>
          <BrandsList brandNames={content.brandNames} />
          <Contact
            email={content.site.email}
            tiktokHandle={content.site.tiktokHandle}
            tiktokUrl={content.site.tiktokUrl}
          />
        </div>
      </main>
    </div>
  );
}
