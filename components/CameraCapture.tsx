"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BODY_CONNECTIONS, type Landmark } from "@/lib/measurements";

type PoseState = "loading" | "no_pose" | "bad" | "ok" | "good";

interface Props {
  onCapture: (landmarks: Landmark[], imageDataUrl: string, imgW: number, imgH: number) => void;
  tipo?: "frente" | "lado";
  title?: string;
}

const STATE_COLOR: Record<PoseState, string> = {
  loading: "#94A3B8",
  no_pose: "#94A3B8",
  bad:     "#EF4444",
  ok:      "#EAB308",
  good:    "#22C55E",
};

const STATE_MSG: Record<"frente" | "lado", Record<PoseState, string>> = {
  frente: {
    loading:  "Carregando câmera...",
    no_pose:  "Posicione-se de frente — corpo inteiro visível",
    bad:      "Afaste um pouco — corpo deve aparecer inteiro",
    ok:       "Quase! Centralize-se e fique ereto",
    good:     "Perfeito! Não se mova...",
  },
  lado: {
    loading:  "Carregando câmera...",
    no_pose:  "Vire de lado — lado direito para a câmera",
    bad:      "Afaste um pouco — corpo inteiro deve aparecer",
    ok:       "Quase! Fique totalmente de perfil",
    good:     "Perfeito! Não se mova...",
  },
};

export default function CameraCapture({ onCapture, tipo = "frente", title }: Props) {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const animRef      = useRef<number>(0);
  const detectorRef  = useRef<any>(null);
  const landmarksRef = useRef<Landmark[] | null>(null);

  const [poseState, setPoseState] = useState<PoseState>("loading");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured,  setCaptured]  = useState(false);
  const countRef    = useRef<NodeJS.Timeout | null>(null);
  const countingRef = useRef(false);

  // ── draw overlay ─────────────────────────────────────────────────────────
  const drawOverlay = useCallback(
    (landmarks: Landmark[] | null, state: PoseState, ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!landmarks) return;

      const color  = STATE_COLOR[state];
      const scaled = landmarks.map((lm) => ({ x: lm.x * w, y: lm.y * h, v: lm.visibility ?? 1 }));

      // thick halo (glow around body)
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 48;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.globalAlpha = 0.16;
      BODY_CONNECTIONS.forEach(([a, b]) => {
        const pa = scaled[a], pb = scaled[b];
        if (!pa || !pb || pa.v < 0.2 || pb.v < 0.2) return;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });
      ctx.restore();

      // crisp lines
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 3;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.globalAlpha = state === "good" ? 1 : 0.8;
      BODY_CONNECTIONS.forEach(([a, b]) => {
        const pa = scaled[a], pb = scaled[b];
        if (!pa || !pb || pa.v < 0.2 || pb.v < 0.2) return;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });
      ctx.restore();

      // head circle
      const nose = scaled[0];
      const lEar = scaled[7], rEar = scaled[8];
      if (nose && nose.v > 0.25) {
        const headR = (lEar?.v > 0.25 && rEar?.v > 0.25)
          ? Math.abs(rEar.x - lEar.x) * 0.7
          : 26;
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = 3;
        ctx.globalAlpha = state === "good" ? 1 : 0.8;
        ctx.beginPath(); ctx.arc(nose.x, nose.y - headR * 0.3, headR, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 48; ctx.globalAlpha = 0.16;
        ctx.beginPath(); ctx.arc(nose.x, nose.y - headR * 0.3, headR, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      // dots
      ctx.save();
      ctx.fillStyle   = color;
      ctx.globalAlpha = 0.9;
      scaled.forEach((pt) => {
        if (pt.v < 0.35) return;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    },
    []
  );

  // ── evaluate pose — different logic for frente vs lado ───────────────────
  const evalPose = useCallback(
    (lms: Landmark[]): PoseState => {
      const vis = (i: number) => lms[i]?.visibility ?? 0;

      if (tipo === "frente") {
        // All key landmarks must be visible
        const KEY = [0, 11, 12, 23, 24, 27, 28];
        if (KEY.some((i) => vis(i) < 0.45)) return "no_pose";

        const nose  = lms[0];
        const lAnk  = lms[27], rAnk = lms[28];
        const lSh   = lms[11], rSh  = lms[12];

        const ankleY = (lAnk.y + rAnk.y) / 2;
        if (ankleY - nose.y < 0.50) return "bad";

        const centerX = (lSh.x + rSh.x) / 2;
        if (centerX < 0.28 || centerX > 0.72) return "ok";
        if (nose.y > 0.28) return "ok";
        if (ankleY < 0.72) return "ok";

        return "good";

      } else {
        // LADO: much more lenient — MediaPipe sees only one side
        // Require: nose + at least one shoulder + at least one hip + at least one ankle
        if (vis(0) < 0.3) return "no_pose";

        const hasShoulders = vis(11) > 0.3 || vis(12) > 0.3;
        const hasHips      = vis(23) > 0.3 || vis(24) > 0.3;
        const hasAnkles    = vis(27) > 0.3 || vis(28) > 0.3;

        if (!hasShoulders || !hasHips || !hasAnkles) return "no_pose";

        const nose    = lms[0];
        const ankleY  = Math.max(
          vis(27) > 0.3 ? lms[27].y : 0,
          vis(28) > 0.3 ? lms[28].y : 0
        );
        const bodyH   = ankleY - nose.y;
        if (bodyH < 0.45) return "bad";

        // Shoulders must appear narrow (person is sideways)
        const lSh = lms[11], rSh = lms[12];
        const shoulderWidth = Math.abs(lSh.x - rSh.x);

        // If shoulders are wide, person is still facing front
        if (shoulderWidth > 0.22 && vis(11) > 0.4 && vis(12) > 0.4) return "ok";

        // Nose should be roughly centered
        if (nose.x < 0.22 || nose.x > 0.78) return "ok";
        if (nose.y > 0.30) return "ok";
        if (ankleY < 0.70) return "ok";

        return "good";
      }
    },
    [tipo]
  );

  // ── capture ───────────────────────────────────────────────────────────────
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const lms   = landmarksRef.current;
    if (!video || !lms) return;

    const snap = document.createElement("canvas");
    snap.width  = video.videoWidth;
    snap.height = video.videoHeight;
    snap.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = snap.toDataURL("image/jpeg", 0.85);

    cancelAnimationFrame(animRef.current);
    setCaptured(true);
    onCapture(lms, dataUrl, video.videoWidth, video.videoHeight);
  }, [onCapture]);

  // ── countdown ─────────────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countingRef.current) return;
    countingRef.current = true;
    setCountdown(3);
    let n = 3;
    const tick = () => {
      n -= 1;
      if (n <= 0) { setCountdown(null); capturePhoto(); }
      else { setCountdown(n); countRef.current = setTimeout(tick, 1000); }
    };
    countRef.current = setTimeout(tick, 1000);
  }, [capturePhoto]);

  const stopCountdown = useCallback(() => {
    if (!countingRef.current) return;
    countingRef.current = false;
    setCountdown(null);
    if (countRef.current) clearTimeout(countRef.current);
  }, []);

  // ── detection loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (captured) return;
    let running = true;
    const video  = videoRef.current!;
    const canvas = canvasRef.current!;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        video.srcObject = stream;
        await video.play();
      } catch {
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        return;
      }

      const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const fs = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      detectorRef.current = await PoseLandmarker.createFromOptions(fs, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setPoseState("no_pose");
      loop();
    }

    let lastTs = -1;
    function loop() {
      if (!running) return;
      animRef.current = requestAnimationFrame(loop);
      const detector = detectorRef.current;
      if (!detector || video.readyState < 2) return;
      const now = performance.now();
      if (now - lastTs < 80) return;
      lastTs = now;

      const result = detector.detectForVideo(video, now);
      const ctx = canvas.getContext("2d")!;
      const w = canvas.width  = video.videoWidth  || 640;
      const h = canvas.height = video.videoHeight || 480;

      if (result.landmarks?.length > 0) {
        const lms: Landmark[] = result.landmarks[0].map((lm: any) => ({
          x: lm.x, y: lm.y, z: lm.z, visibility: lm.visibility,
        }));
        landmarksRef.current = lms;
        const state = evalPose(lms);
        setPoseState(state);
        drawOverlay(lms, state, ctx, w, h);
        if (state === "good") startCountdown();
        else stopCountdown();
      } else {
        landmarksRef.current = null;
        setPoseState("no_pose");
        drawOverlay(null, "no_pose", ctx, w, h);
        stopCountdown();
      }
    }

    init();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      stopCountdown();
      (video.srcObject as MediaStream | null)?.getTracks().forEach((t) => t.stop());
    };
  }, [captured, drawOverlay, evalPose, startCountdown, stopCountdown]);

  const color = STATE_COLOR[poseState];
  const msg   = STATE_MSG[tipo][poseState];

  return (
    <div className="fixed inset-0 bg-black select-none">
      {/* Full-screen video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />

      {/* Full-screen canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full scale-x-[-1]"
        style={{ pointerEvents: "none" }}
      />

      {/* Colored border glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{ boxShadow: `inset 0 0 0 4px ${color}, inset 0 0 40px ${color}33` }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-safe-top pt-4 pb-4 bg-gradient-to-b from-black/60 to-transparent">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">V</span>
          </div>
          <span className="font-display font-bold text-white text-base">V-Clothes</span>
        </a>
        {title && (
          <span className="font-display font-semibold text-white text-sm bg-white/10 px-3 py-1 rounded-full">
            {title}
          </span>
        )}
      </div>

      {/* Countdown */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-display font-black text-white"
            style={{
              fontSize: "min(35vw, 220px)",
              textShadow: `0 0 60px ${color}, 0 0 120px ${color}88`,
              animation: "countPulse 0.9s ease-in-out infinite",
            }}
          >
            {countdown}
          </span>
        </div>
      )}

      {/* Loading */}
      {poseState === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-white text-sm font-medium">Carregando detecção de pose...</p>
        </div>
      )}

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-safe-bottom pb-6 bg-gradient-to-t from-black/70 to-transparent">
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-sm transition-all duration-300"
          style={{ background: `${color}22`, border: `1.5px solid ${color}66` }}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
          <p className="text-white text-sm font-semibold">{msg}</p>
        </div>
      </div>

      <style>{`
        @keyframes countPulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.06); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
