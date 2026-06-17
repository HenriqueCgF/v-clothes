"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ruler, ChevronRight } from "lucide-react";
import { store } from "@/lib/session-store";

export default function Cadastro() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [error,  setError]  = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(height);
    if (!h || h < 120 || h > 220) {
      setError("Digite uma altura válida entre 120 e 220 cm.");
      return;
    }
    store.set("altura", h);
    router.push("/cadastro/instrucoes/frente");
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-blue-pale rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-blue-light rounded-full blur-3xl opacity-40" />
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
                i === 0 ? "bg-brand-blue text-white" : "bg-brand-blue-pale text-brand-gray"
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-0.5 ${i === 0 ? "bg-brand-blue-mid" : "bg-brand-blue-light"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-blue-light shadow-sm p-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-blue-pale mx-auto mb-6">
            <Ruler size={26} className="text-brand-blue" />
          </div>

          <h1 className="font-display font-black text-2xl text-brand-dark text-center mb-2">
            Qual é a sua altura?
          </h1>
          <p className="text-brand-gray text-sm text-center mb-8 leading-relaxed">
            Usamos sua altura para calibrar o sistema de medição com precisão.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="number"
                min={120}
                max={220}
                value={height}
                onChange={(e) => { setHeight(e.target.value); setError(""); }}
                placeholder="Ex: 170"
                className="w-full px-5 py-4 pr-14 rounded-xl border-2 border-brand-blue-light focus:border-brand-blue focus:outline-none text-xl font-display font-bold text-brand-dark text-center transition-colors"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gray font-medium text-sm">
                cm
              </span>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button
              type="submit"
              className="shimmer-btn text-white font-display font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Próximo
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
