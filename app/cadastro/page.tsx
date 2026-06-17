"use client";

import { ArrowLeft } from "lucide-react";

export default function Cadastro() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-blue-pale rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-blue-light rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-lg tracking-tight">
            V-Clothes
          </span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-brand-blue-pale border-2 border-brand-blue-light flex items-center justify-center mx-auto mb-8">
          <svg viewBox="0 0 60 90" className="w-10 h-14">
            <ellipse cx="30" cy="12" rx="9" ry="9" fill="#DBEAFE" />
            <path
              d="M15 30 Q10 40 12 55 L18 55 L20 42 L30 45 L40 42 L42 55 L48 55 Q50 40 45 30 Q38 25 30 24 Q22 25 15 30Z"
              fill="#DBEAFE"
            />
            <path
              d="M18 55 L16 80 L22 80 L24 62 L30 63 L36 62 L38 80 L44 80 L42 55Z"
              fill="#DBEAFE"
            />
            <line x1="10" y1="35" x2="50" y2="35" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="12" y1="43" x2="48" y2="43" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="11" y1="51" x2="49" y2="51" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="font-display font-black text-4xl md:text-5xl text-brand-dark leading-tight mb-4">
          Futuro{" "}
          <span className="gradient-text">Cadastro Corporal</span>
        </h1>
        <p className="text-brand-gray text-lg leading-relaxed mb-10">
          Em breve você poderá tirar uma foto e medir seu corpo automaticamente. Estamos construindo isso para você.
        </p>

        {/* Back button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-brand-blue font-semibold border-2 border-brand-blue-light hover:border-brand-blue hover:bg-brand-blue-pale px-6 py-3 rounded-full transition-all duration-200"
        >
          <ArrowLeft size={16} />
          Voltar para o início
        </a>
      </div>
    </main>
  );
}
