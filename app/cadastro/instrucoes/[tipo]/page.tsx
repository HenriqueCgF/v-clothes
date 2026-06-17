"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Camera, RotateCcw, SunMedium, PersonStanding } from "lucide-react";

const CONTENT = {
  frente: {
    step: 2,
    title: "Foto de Frente",
    subtitle: "Siga as instruções para uma foto perfeita",
    tips: [
      { icon: SunMedium,        text: "Fique em um ambiente bem iluminado" },
      { icon: PersonStanding,   text: "Fique de frente para a câmera, ereto e com os braços levemente afastados" },
      { icon: Camera,           text: "O corpo inteiro deve aparecer — da cabeça aos pés" },
      { icon: RotateCcw,        text: "Vista roupas justas ou de academia para melhor precisão" },
    ],
    next: "/cadastro/foto/frente",
    btnLabel: "Abrir câmera — Frente",
  },
  lado: {
    step: 3,
    title: "Foto de Lado",
    subtitle: "Agora vamos tirar a foto de perfil",
    tips: [
      { icon: SunMedium,        text: "Mantenha a mesma iluminação da foto anterior" },
      { icon: PersonStanding,   text: "Vire 90° para o lado direito da câmera, ereto" },
      { icon: Camera,           text: "O corpo inteiro deve aparecer — da cabeça aos pés" },
      { icon: RotateCcw,        text: "Braços levemente à frente do corpo, sem cruzar" },
    ],
    next: "/cadastro/foto/lado",
    btnLabel: "Abrir câmera — Lado",
  },
};

export default function Instrucoes({ params }: { params: { tipo: string } }) {
  const router = useRouter();
  const tipo = params.tipo as "frente" | "lado";
  const c = CONTENT[tipo] ?? CONTENT.frente;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-blue-pale rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-lg">V-Clothes</span>
        </a>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {["Altura", "Frente", "Lado", "Medidas"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-display transition-all ${
                i < c.step ? "bg-brand-blue text-white" : i === c.step - 1 ? "bg-brand-blue text-white" : "bg-brand-blue-pale text-brand-gray"
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-0.5 ${i < c.step - 1 ? "bg-brand-blue-mid" : "bg-brand-blue-light"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-blue-light shadow-sm p-8">
          <h1 className="font-display font-black text-2xl text-brand-dark text-center mb-1">
            {c.title}
          </h1>
          <p className="text-brand-gray text-sm text-center mb-8">{c.subtitle}</p>

          <div className="flex flex-col gap-4 mb-8">
            {c.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                  <tip.icon size={18} className="text-brand-blue" />
                </div>
                <p className="text-sm text-brand-dark-mid leading-snug pt-1.5">{tip.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push(c.next)}
            className="shimmer-btn w-full text-white font-display font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {c.btnLabel}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
