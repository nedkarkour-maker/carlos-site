import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import RaceVideo from "@/components/RaceVideo";
import Numbers from "@/components/Numbers";
import Schedule from "@/components/Schedule";
import NotableResults from "@/components/NotableResults";
import HowYouCanHelp from "@/components/HowYouCanHelp";
import Budget from "@/components/Budget";
import NewsletterTeaser from "@/components/NewsletterTeaser";
import Backers from "@/components/Backers";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/motion/WaveDivider";
import { generatedImage } from "@/lib/generated";
import { site } from "@/config/content";

// Structured data for search engines — who Carlos is, in schema.org terms.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  nationality: "CA",
  sameAs: [site.instagramUrl, site.supportUrl],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // `<` is escaped so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <WaveDivider fill="var(--sail)" className="bg-teal-950" />
        <About boatSrc={generatedImage("sailboat-line.png")} />
        <WaveDivider fill="var(--teal-900)" />
        <Numbers topoSrc={generatedImage("stats-topo.png")} />
        <WaveDivider fill="var(--sail)" className="bg-teal-900" />
        <NotableResults />
        <Schedule mapSrc={generatedImage("venues-chart.png")} />
        <HowYouCanHelp />
        <Budget />
        <NewsletterTeaser />
        <Subscribe windSrc={generatedImage("wind-flow.png")} />
        <RaceVideo />
        <Backers />
      </main>
      <Footer />
    </>
  );
}
