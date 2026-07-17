import { About } from "@/components/About";
import { BrandTicker } from "@/components/BrandTicker";
import { BrandsList } from "@/components/BrandsList";
import { Contact } from "@/components/Contact";
import { Header } from "@/components/Header";
import { HeroGallery } from "@/components/HeroGallery";
import { Stats } from "@/components/Stats";
import { VideoGallery } from "@/components/VideoGallery";
import { getMediaKit } from "@/lib/getMediaKit";

export default async function Home() {
  const content = await getMediaKit();

  return (
    <div className="min-h-screen bg-white">
      <Header
        name={content.site.name}
        email={content.site.email}
        tiktokUrl={content.site.tiktokUrl}
      />

      <main className="flex w-full flex-col">
        <HeroGallery images={content.heroImages} />

        <div className="mx-auto flex w-full max-w-[1223px] flex-col items-center gap-20 pb-6 pt-20">
          <BrandTicker logos={content.brandLogos} />
          <About
            pronunciation={content.site.pronunciation}
            about={content.site.about}
            aboutDesktop={content.site.aboutDesktop}
          />
          <Stats
            lastUpdated={content.stats.lastUpdated}
            followers={content.stats.followers}
            periodLabel={content.stats.periodLabel}
            metrics={content.stats.metrics}
          />
          <VideoGallery videos={content.galleryVideos} />
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
