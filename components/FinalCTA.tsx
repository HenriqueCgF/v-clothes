"use client";

import { useState, useEffect, useRef } from "react";
import { store } from "@/lib/session-store";
import { ArrowRight, CheckCircle } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface FinalCTAProps {
  lang: Lang;
}

export default function FinalCTA({ lang }: FinalCTAProps) {
  const t = translations[lang].finalCta;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      store.set("waitlistEmail", email);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="waitlist-section"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E40AF 0%, #1D4ED8 50%, #2563EB 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="reveal font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          {t.title}
        </h2>
        <p className="reveal text-blue-100 text-lg leading-relaxed mb-10">
          {t.subtitle}
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="reveal flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="bg-white text-brand-blue font-display font-bold px-6 py-3.5 rounded-full hover:bg-blue-50 hover:scale-105 shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {t.button}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div className="reveal flex items-center justify-center gap-3 bg-white/10 border border-white/30 rounded-2xl px-8 py-5 max-w-md mx-auto">
            <CheckCircle size={22} className="text-green-300 flex-shrink-0" />
            <p className="text-white font-semibold font-display">
              {lang === "pt"
                ? "Você entrou na lista! Em breve entraremos em contato."
                : "You're on the list! We'll be in touch soon."}
            </p>
          </div>
        )}

        <p className="reveal mt-4 text-blue-200 text-xs">{t.disclaimer}</p>
      </div>
    </section>
  );
}
