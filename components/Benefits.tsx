"use client";

import { useEffect, useRef } from "react";
import {
  Ruler,
  Smartphone,
  ShieldCheck,
  Flame,
  RefreshCw,
  Building2,
} from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface BenefitsProps {
  lang: Lang;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Ruler,
  Smartphone,
  ShieldCheck,
  Flame,
  RefreshCw,
  Building2,
};

export default function Benefits({ lang }: BenefitsProps) {
  const t = translations[lang].benefits;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
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
    <section id="benefits" ref={sectionRef} className="py-24 bg-white">
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

        {/* Benefits grid — asymmetric: 2 large + 4 small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            const isLarge = i < 2;

            return (
              <div
                key={i}
                className={`reveal group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isLarge
                    ? "bg-gradient-to-br from-brand-blue to-brand-blue-mid border-brand-blue text-white p-8"
                    : "bg-white border-brand-blue-light hover:border-brand-blue-mid p-6"
                }`}
              >
                {isLarge && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                    isLarge
                      ? "bg-white/20"
                      : "bg-brand-blue-pale"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isLarge ? "text-white" : "text-brand-blue"}
                  />
                </div>

                <h3
                  className={`font-display font-bold text-lg mb-2 ${
                    isLarge ? "text-white" : "text-brand-dark"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isLarge ? "text-blue-100" : "text-brand-gray"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
