"use client";

import { ArrowDown, Camera, Sparkles } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface HeroProps {
  lang: Lang;
}

export default function Hero({ lang }: HeroProps) {
  const t = translations[lang].hero;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-blue-pale rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-blue-light rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue-pale rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-brand-blue-pale border border-brand-blue-light text-brand-blue text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <Sparkles size={14} />
          {t.badge}
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-brand-dark mb-6">
          <span
            className="inline-block animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {t.title1}
          </span>{" "}
          <span
            className="inline-block gradient-text animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {t.title2}
          </span>
          <br />
          <span
            className="inline-block animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            {t.title3}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl text-lg md:text-xl text-brand-gray leading-relaxed mb-10 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          {t.subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <a
            href="#waitlist"
            className="shimmer-btn text-white font-semibold font-display text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Camera size={18} />
            {t.ctaPrimary}
          </a>
          <a
            href="#how-it-works"
            className="text-brand-blue font-semibold text-base px-8 py-4 rounded-full border-2 border-brand-blue-light hover:border-brand-blue hover:bg-brand-blue-pale transition-all duration-200 flex items-center gap-2"
          >
            {t.ctaSecondary}
            <ArrowDown size={16} />
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-8 md:gap-16 animate-fade-up"
          style={{ animationDelay: "600ms" }}
        >
          {[
            { value: t.stat1Value, label: t.stat1Label },
            { value: t.stat2Value, label: t.stat2Label },
            { value: t.stat3Value, label: t.stat3Label },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-display font-black text-3xl md:text-4xl gradient-text">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-brand-gray text-center leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Mockup visual */}
        <div
          className="mt-20 relative w-full max-w-2xl animate-fade-up"
          style={{ animationDelay: "700ms" }}
        >
          {/* Phone mockup */}
          <div className="mx-auto w-48 md:w-64 relative animate-float">
            <div className="bg-brand-dark rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/19]">
                {/* Screen content */}
                <div className="w-full h-full bg-gradient-to-b from-brand-blue-pale to-white flex flex-col items-center justify-center p-4 gap-3">
                  {/* Silhouette */}
                  <div className="w-16 h-24 relative">
                    <div className="absolute inset-0 bg-brand-blue/10 rounded-full" />
                    <svg viewBox="0 0 60 90" className="w-full h-full">
                      {/* Simple body silhouette */}
                      <ellipse cx="30" cy="12" rx="9" ry="9" fill="#DBEAFE" />
                      <path
                        d="M15 30 Q10 40 12 55 L18 55 L20 42 L30 45 L40 42 L42 55 L48 55 Q50 40 45 30 Q38 25 30 24 Q22 25 15 30Z"
                        fill="#DBEAFE"
                      />
                      <path
                        d="M18 55 L16 80 L22 80 L24 62 L30 63 L36 62 L38 80 L44 80 L42 55Z"
                        fill="#DBEAFE"
                      />
                      {/* Measurement lines */}
                      <line
                        x1="10"
                        y1="35"
                        x2="50"
                        y2="35"
                        stroke="#3B82F6"
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                      />
                      <line
                        x1="12"
                        y1="43"
                        x2="48"
                        y2="43"
                        stroke="#3B82F6"
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                      />
                      <line
                        x1="11"
                        y1="51"
                        x2="49"
                        y2="51"
                        stroke="#3B82F6"
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                      />
                    </svg>
                  </div>
                  {/* Measurement tags */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["86cm", "64cm", "90cm"].map((m) => (
                      <span
                        key={m}
                        className="bg-brand-blue text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {/* Mini recommendation */}
                  <div className="w-full bg-white rounded-xl p-2 shadow-sm border border-brand-blue-light">
                    <p className="text-[8px] font-bold text-brand-blue font-display text-center">
                      ✓ 12{" "}
                      {lang === "pt"
                        ? "roupas encontradas"
                        : "clothes found"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-brand-dark rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
