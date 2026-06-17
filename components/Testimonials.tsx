"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface TestimonialsProps {
  lang: Lang;
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-sky-500",
  "bg-blue-700",
];

export default function Testimonials({ lang }: TestimonialsProps) {
  const t = translations[lang].testimonials;
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
    <section ref={sectionRef} className="py-24 bg-brand-blue-pale">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal inline-block bg-white text-brand-blue text-sm font-semibold px-4 py-2 rounded-full mb-4 shadow-sm">
            {t.badge}
          </span>
          <h2 className="reveal font-display font-black text-4xl md:text-5xl text-brand-dark leading-tight">
            {t.title}
          </h2>
        </div>

        {/* Cards — 2 cols on md, 4 on xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {t.items.map((item, i) => (
            <div
              key={i}
              className="reveal bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-brand-blue-mid text-brand-blue-mid"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-brand-dark-mid text-sm leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i]} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-sm font-bold font-display">
                    {item.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark font-display">
                    {item.name}
                  </p>
                  <p className="text-xs text-brand-gray">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
