"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { store } from "@/lib/session-store";
import type { Landmark } from "@/lib/measurements";

const CameraCapture = dynamic(() => import("@/components/CameraCapture"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  ),
});

const CONTENT = {
  frente: {
    storeKey:  "frontLandmarks",
    imageKey:  "frontImage",
    nextRoute: "/cadastro/instrucoes/lado",
    title:     "Foto Frente",
  },
  lado: {
    storeKey:  "sideLandmarks",
    imageKey:  "sideImage",
    nextRoute: "/cadastro/medidas",
    title:     "Foto Lado",
  },
};

export default function FotoPage({ params }: { params: { tipo: string } }) {
  const router = useRouter();
  const tipo   = params.tipo as "frente" | "lado";
  const c      = CONTENT[tipo] ?? CONTENT.frente;

  const handleCapture = (landmarks: Landmark[], imageDataUrl: string, imgW: number, imgH: number) => {
    store.set(c.storeKey, landmarks);
    store.set(c.imageKey, imageDataUrl);
    store.set(c.storeKey + "_dims", { w: imgW, h: imgH });
    setTimeout(() => router.push(c.nextRoute), 500);
  };

  return (
    <CameraCapture
      onCapture={handleCapture}
      tipo={tipo}
      title={c.title}
    />
  );
}
