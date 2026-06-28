import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { About } from "@/components/About";
import { Education } from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import Contact from "@/components/Contact";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Nav />
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="education">
        <Education />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="certifications">
        <Certifications />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <ChatWidget />
    </>
  );
}
