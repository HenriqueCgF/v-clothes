"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface FAQProps {
  lang: Lang;
}

export default function FAQ({ lang }: FAQProps) {
  const t = translations[lang].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
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
    <section id="faq" ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal inline-block bg-brand-blue-pale text-brand-blue text-sm font-semibold px-4 py-2 rounded-full mb-4">
            {t.badge}
          </span>
          <h2 className="reveal font-display font-black text-4xl md:text-5xl text-brand-dark leading-tight">
            {t.title}
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {t.items.map((item, i) => (
            <div
              key={i}
              className="reveal border border-brand-blue-light rounded-2xl overflow-hidden hover:border-brand-blue-mid transition-colors duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-display font-semibold text-brand-dark text-sm md:text-base">
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === i
                      ? "bg-brand-blue text-white"
                      : "bg-brand-blue-pale text-brand-blue"
                  }`}
                >
                  {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 text-brand-gray text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
