"use client";

import { useEffect, useRef } from "react";
import { Camera, Ruler, Shirt } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface HowItWorksProps {
  lang: Lang;
}

const ICONS = [Camera, Ruler, Shirt];

export default function HowItWorks({ lang }: HowItWorksProps) {
  const t = translations[lang].howItWorks;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-brand-gray-light"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal inline-block bg-brand-blue-pale text-brand-blue text-sm font-semibold px-4 py-2 rounded-full mb-4">
            {t.badge}
          </span>
          <h2 className="reveal font-display font-black text-4xl md:text-5xl text-brand-dark leading-tight mb-4">
            {t.title}
          </h2>
          <p className="reveal max-w-xl mx-auto text-brand-gray text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-blue-light via-brand-blue-mid to-brand-blue-light" />

          {t.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div key={i} className="reveal flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-lg border border-brand-blue-light flex flex-col items-center justify-center gap-2 group-hover:shadow-xl group-hover:border-brand-blue-mid transition-all duration-300 group-hover:-translate-y-1">
                    <Icon
                      size={32}
                      className="text-brand-blue group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-display font-black text-4xl text-brand-blue-light leading-none">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-brand-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-brand-gray leading-relaxed text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
