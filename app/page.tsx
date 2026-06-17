"use client";

import { useState } from "react";
import { type Lang } from "@/lib/i18n";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [lang, setLang] = useState<Lang>("pt");

  const toggleLang = () => setLang((prev) => (prev === "pt" ? "en" : "pt"));

  return (
    <main>
      <Header lang={lang} onLangToggle={toggleLang} />
      <Hero lang={lang} />
      <HowItWorks lang={lang} />
      <Benefits lang={lang} />
      <Testimonials lang={lang} />
      <FAQ lang={lang} />
      <FinalCTA lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
