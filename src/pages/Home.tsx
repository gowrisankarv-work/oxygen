import { faqs } from '@/content/faqs';
import { Hero } from '@/components/sections/Hero';
import { AboutPreview, AudienceTabs, ServiceBand, ServiceGrid } from '@/components/sections/ServiceSections';
import { CtaBanner, FaqSection, ProcessTimeline, StatsStrip, WhyChooseUs } from '@/components/sections/SharedSections';
import { TestimonialCarousel } from '@/components/sections/TestimonialSections';
import { ResourcesPreview } from '@/components/sections/ArticleSections';

/** Home — 12 sections in the order of the brief. */
export default function Home() {
  return (
    <>
      <Hero />
      <ServiceBand />
      <AboutPreview />
      <ServiceGrid />
      <AudienceTabs />
      <ProcessTimeline />
      <WhyChooseUs />
      <StatsStrip />
      <TestimonialCarousel />
      <ResourcesPreview />
      <FaqSection items={faqs.filter((f) => f.featured).slice(0, 5)} />
      <CtaBanner />
    </>
  );
}
