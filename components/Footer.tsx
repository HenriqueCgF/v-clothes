"use client";

import { translations, type Lang } from "@/lib/i18n";

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;
  const links = t.links;

  return (
    <footer className="bg-brand-dark text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">V</span>
              </div>
              <span className="font-display font-bold text-lg">V-Clothes</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t.tagline}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              {links.product}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: links.howItWorks, href: "#how-it-works" },
                { label: links.benefits, href: "#benefits" },
                { label: links.forCompanies, href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              {links.company}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: links.about, href: "#" },
                { label: links.contact, href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              {links.legal}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: links.privacy, href: "#" },
                { label: links.terms, href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">{t.copyright}</p>
          <p className="text-slate-600 text-xs">
            {lang === "pt"
              ? "Desenvolvido para a Feira de Ciências 🚀"
              : "Built for the Science Fair 🚀"}
          </p>
        </div>
      </div>
    </footer>
  );
}
