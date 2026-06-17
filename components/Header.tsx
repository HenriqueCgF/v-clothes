"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { translations, type Lang } from "@/lib/i18n";

interface HeaderProps {
  lang: Lang;
  onLangToggle: () => void;
}

export default function Header({ lang, onLangToggle }: HeaderProps) {
  const t = translations[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.howItWorks, href: "#how-it-works" },
    { label: t.benefits, href: "#benefits" },
    { label: t.faq, href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-lg tracking-tight">
            V-Clothes
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onLangToggle}
            className="text-sm font-medium text-brand-gray hover:text-brand-blue border border-transparent hover:border-brand-blue-light px-3 py-1.5 rounded-full transition-all duration-200"
          >
            {t.langToggle}
          </button>
          <a
            href="#waitlist"
            className="shimmer-btn text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {t.getStarted}
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onLangToggle}
            className="text-sm font-medium text-brand-gray px-2 py-1"
          >
            {t.langToggle}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-brand-dark p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-50 px-6 py-4 flex flex-col gap-4 shadow-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-brand-dark py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setMenuOpen(false)}
            className="shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1"
          >
            {t.getStarted}
          </a>
        </div>
      )}
    </header>
  );
}
