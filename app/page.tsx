import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import StoryScroll from "@/components/StoryScroll";
import Numbers from "@/components/Numbers";
import Schedule from "@/components/Schedule";
import NewsletterTeaser from "@/components/NewsletterTeaser";
import HowYouCanHelp from "@/components/HowYouCanHelp";
import Backers from "@/components/Backers";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/motion/WaveDivider";
import { generatedImage } from "@/lib/generated";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <StoryScroll />
        <WaveDivider fill="var(--sail)" className="bg-teal-950" />
        <About />
        <WaveDivider fill="var(--teal-900)" />
        <Numbers />
        <WaveDivider fill="var(--sail)" className="bg-teal-900" />
        <Schedule mapSrc={generatedImage("venues-chart.png")} />
        <NewsletterTeaser />
        <HowYouCanHelp />
        <Backers />
        <Subscribe windSrc={generatedImage("wind-flow.png")} />
      </main>
      <Footer />
    </>
  );
}
