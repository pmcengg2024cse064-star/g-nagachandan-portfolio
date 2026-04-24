import { createFileRoute } from "@tanstack/react-router";
import { Background } from "@/components/portfolio/Background";
import { CursorGlow } from "@/components/portfolio/CursorGlow";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Education } from "@/components/portfolio/Education";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Achievements } from "@/components/portfolio/Achievements";
import { Interests } from "@/components/portfolio/Interests";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { Loader } from "@/components/portfolio/Loader";
import { ChatBot } from "@/components/portfolio/ChatBot";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "G Nagachandan — Computer Science Engineer" },
      {
        name: "description",
        content:
          "Portfolio of G Nagachandan, an aspiring Computer Science Engineer specializing in MERN, Python, and computer vision.",
      },
      { property: "og:title", content: "G Nagachandan — Computer Science Engineer" },
      {
        property: "og:description",
        content:
          "Futuristic portfolio showcasing AI projects, MERN stack work, and hackathon achievements.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: sections } = useSectionVisibility();
  const show = (key: string) => sections?.[key] ?? true;

  return (
    <>
      <Loader />
      <Background />
      <CursorGlow />
      <Navbar />
      <main>
        {show("hero") && <Hero />}
        {show("about") && <About />}
        {show("education") && <Education />}
        {show("skills") && <Skills />}
        {show("projects") && <Projects />}
        {show("achievements") && <Achievements />}
        {show("interests") && <Interests />}
        {show("contact") && <Contact />}
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
