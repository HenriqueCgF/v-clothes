"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { store } from "@/lib/session-store";
import { calculateMeasurements, type BodyMeasurements, type Landmark } from "@/lib/measurements";

const SIZE_DESC: Record<string, string> = {
  PP: "Extra Pequeno",
  P:  "Pequeno",
  M:  "Médio",
  G:  "Grande",
  GG: "Extra Grande",
  XGG:"Extra Extra Grande",
};

export default function MedidasPage() {
  const router = useRouter();
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);
  const [frontImage, setFrontImage]     = useState<string | null>(null);

  useEffect(() => {
    const altura   = store.get<number>("altura");
    const frontLms = store.get<Landmark[]>("frontLandmarks");
    const imgData  = store.get<string>("frontImage");

    if (!altura || !frontLms) {
      router.replace("/cadastro");
      return;
    }

    setFrontImage(imgData);
    // Use a standard reference image size for calculations
    const result = calculateMeasurements(frontLms, altura, 640, 480);
    setMeasurements(result);
  }, [router]);

  if (!measurements) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
      </main>
    );
  }

  const items = [
    { label: "Altura",          value: `${measurements.altura} cm` },
    { label: "Busto",           value: `${measurements.busto} cm` },
    { label: "Cintura",         value: `${measurements.cintura} cm` },
    { label: "Quadril",         value: `${measurements.quadril} cm` },
    { label: "Largura ombros",  value: `${measurements.ombros} cm` },
    { label: "Comprimento perna", value: `${measurements.perna} cm` },
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-lg">V-Clothes</span>
        </a>

        {/* Progress — step 4 done */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {["Altura", "Frente", "Lado", "Medidas"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold font-display">
                {i + 1}
              </div>
              {i < 3 && <div className="w-6 h-0.5 bg-brand-blue-mid" />}
            </div>
          ))}
        </div>

        {/* Success header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <CheckCircle size={40} className="text-green-500" />
          <h1 className="font-display font-black text-2xl text-brand-dark">
            Medição concluída!
          </h1>
          <p className="text-brand-gray text-sm text-center">
            Suas medidas foram calculadas com precisão.
          </p>
        </div>

        {/* Size badge */}
        <div className="bg-gradient-to-br from-brand-blue to-brand-blue-mid rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <p className="text-blue-100 text-sm font-medium mb-1">Seu tamanho recomendado</p>
          <p className="font-display font-black text-white text-6xl leading-none">
            {measurements.tamanho}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            {SIZE_DESC[measurements.tamanho]}
          </p>
        </div>

        {/* Measurements list */}
        <div className="bg-white rounded-2xl border border-brand-blue-light shadow-sm divide-y divide-brand-blue-light mb-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-brand-gray text-sm">{item.label}</span>
              <span className="font-display font-bold text-brand-dark text-sm">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Photo preview thumbnail */}
        {frontImage && (
          <div className="mb-6">
            <p className="text-xs text-brand-gray mb-2 text-center">Foto utilizada</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frontImage}
              alt="Foto de frente"
              className="w-full rounded-xl object-cover max-h-48 scale-x-[-1]"
            />
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-brand-gray text-center mb-8 leading-relaxed">
          * Medidas estimadas por visão computacional com variação de ±3 cm.
          Para máxima precisão, use roupas justas e boa iluminação.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/")}
            className="shimmer-btn text-white font-display font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Ver roupas recomendadas
          </button>
          <button
            onClick={() => {
              store.clear("frontLandmarks", "frontImage", "sideLandmarks", "sideImage");
              router.push("/cadastro");
            }}
            className="flex items-center justify-center gap-2 text-brand-blue font-semibold text-sm py-3 rounded-xl border-2 border-brand-blue-light hover:bg-brand-blue-pale transition-colors"
          >
            <RefreshCw size={16} />
            Medir novamente
          </button>
        </div>
      </div>
    </main>
  );
}
