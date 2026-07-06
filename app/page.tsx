import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import StoryScroll from "@/components/StoryScroll";
import Numbers from "@/components/Numbers";
import Schedule from "@/components/Schedule";
import NewsletterTeaser from "@/components/NewsletterTeaser";
import HowYouCanHelp from "@/components/HowYouCanHelp";
import Backers from "@/components/Backers";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <StoryScroll />
        <Numbers />
        <Schedule />
        <NewsletterTeaser />
        <HowYouCanHelp />
        <Backers />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
