"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { store } from "@/lib/session-store";
import type { Landmark } from "@/lib/measurements";

// CameraCapture uses browser APIs — load only client-side
const CameraCapture = dynamic(() => import("@/components/CameraCapture"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg mx-auto aspect-video rounded-2xl bg-brand-blue-pale flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
    </div>
  ),
});

const CONTENT = {
  frente: {
    step: 2,
    title: "Foto de Frente",
    label: "Posicione-se de frente para a câmera — corpo inteiro visível",
    storeKey: "frontLandmarks",
    imageKey: "frontImage",
    nextRoute: "/cadastro/instrucoes/lado",
  },
  lado: {
    step: 3,
    title: "Foto de Lado",
    label: "Posicione-se de perfil (lado direito) — corpo inteiro visível",
    storeKey: "sideLandmarks",
    imageKey: "sideImage",
    nextRoute: "/cadastro/medidas",
  },
};

export default function FotoPage({ params }: { params: { tipo: string } }) {
  const router = useRouter();
  const tipo = params.tipo as "frente" | "lado";
  const c = CONTENT[tipo] ?? CONTENT.frente;

  const handleCapture = (landmarks: Landmark[], imageDataUrl: string) => {
    store.set(c.storeKey, landmarks);
    store.set(c.imageKey, imageDataUrl);
    // short delay so user sees captured frame
    setTimeout(() => router.push(c.nextRoute), 600);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-lg">V-Clothes</span>
        </a>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {["Altura", "Frente", "Lado", "Medidas"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-display ${
                i < c.step ? "bg-brand-blue text-white" : "bg-brand-blue-pale text-brand-gray"
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-0.5 ${i < c.step - 1 ? "bg-brand-blue-mid" : "bg-brand-blue-light"}`} />}
            </div>
          ))}
        </div>

        <h1 className="font-display font-black text-2xl text-brand-dark text-center mb-6">
          {c.title}
        </h1>

        <CameraCapture onCapture={handleCapture} label={c.label} />
      </div>
    </main>
  );
}
