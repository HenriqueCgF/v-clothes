"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BODY_CONNECTIONS, type Landmark } from "@/lib/measurements";

type PoseState = "loading" | "no_pose" | "bad" | "ok" | "good";

interface Props {
  onCapture: (landmarks: Landmark[], imageDataUrl: string) => void;
  label?: string;
}

const STATE_COLOR: Record<PoseState, string> = {
  loading: "#94A3B8",
  no_pose: "#94A3B8",
  bad:     "#EF4444",
  ok:      "#EAB308",
  good:    "#22C55E",
};

const STATE_MSG_PT: Record<PoseState, string> = {
  loading:  "Carregando câmera...",
  no_pose:  "Posicione seu corpo na frente da câmera",
  bad:      "Afaste um pouco — corpo deve aparecer inteiro",
  ok:       "Quase! Centralize-se e fique ereto",
  good:     "Perfeito! Não se mova...",
};

export default function CameraCapture({ onCapture, label }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const animRef     = useRef<number>(0);
  const detectorRef = useRef<any>(null);
  const landmarksRef = useRef<Landmark[] | null>(null);

  const [poseState, setPoseState]   = useState<PoseState>("loading");
  const [countdown, setCountdown]   = useState<number | null>(null);
  const [captured,  setCaptured]    = useState(false);
  const countRef = useRef<NodeJS.Timeout | null>(null);
  const countingRef = useRef(false);

  // ── draw overlay ─────────────────────────────────────────────────────────
  const drawOverlay = useCallback(
    (landmarks: Landmark[] | null, state: PoseState, ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!landmarks) return;

      const color = STATE_COLOR[state];
      const scaled = landmarks.map((lm) => ({ x: lm.x * w, y: lm.y * h, v: lm.visibility ?? 1 }));

      // ── thick halo lines (creates a body-shaped glow) ──────────────────
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 44;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.globalAlpha = 0.18;

      BODY_CONNECTIONS.forEach(([a, b]) => {
        const pa = scaled[a], pb = scaled[b];
        if (!pa || !pb || pa.v < 0.25 || pb.v < 0.25) return;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      ctx.restore();

      // ── crisp outline lines ─────────────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 3;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.globalAlpha = state === "good" ? 1 : 0.75;

      BODY_CONNECTIONS.forEach(([a, b]) => {
        const pa = scaled[a], pb = scaled[b];
        if (!pa || !pb || pa.v < 0.25 || pb.v < 0.25) return;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      ctx.restore();

      // ── head circle ─────────────────────────────────────────────────────
      const nose = scaled[0];
      const lEar = scaled[7], rEar = scaled[8];
      if (nose && nose.v > 0.3) {
        const headR = lEar && rEar && lEar.v > 0.3 && rEar.v > 0.3
          ? Math.abs(rEar.x - lEar.x) * 0.7
          : 28;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth   = 3;
        ctx.globalAlpha = state === "good" ? 1 : 0.75;
        ctx.beginPath();
        ctx.arc(nose.x, nose.y - headR * 0.3, headR, 0, Math.PI * 2);
        ctx.stroke();

        // halo for head
        ctx.lineWidth   = 44;
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(nose.x, nose.y - headR * 0.3, headR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── landmark dots ───────────────────────────────────────────────────
      ctx.save();
      ctx.fillStyle   = color;
      ctx.globalAlpha = 0.9;
      scaled.forEach((pt) => {
        if (pt.v < 0.4) return;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    },
    []
  );

  // ── evaluate pose quality ────────────────────────────────────────────────
  const evalPose = useCallback((lms: Landmark[]): PoseState => {
    const KEY = [0, 11, 12, 23, 24, 27, 28];
    const allVisible = KEY.every((i) => (lms[i]?.visibility ?? 0) > 0.45);
    if (!allVisible) return "no_pose";

    const nose  = lms[0];
    const lAnk  = lms[27], rAnk = lms[28];
    const lSh   = lms[11], rSh  = lms[12];

    // Person must fill enough vertical space
    const ankleY = (lAnk.y + rAnk.y) / 2;
    const bodyH  = ankleY - nose.y;
    if (bodyH < 0.50) return "bad"; // too close or cut off

    // Person must be roughly centered
    const centerX = (lSh.x + rSh.x) / 2;
    if (centerX < 0.28 || centerX > 0.72) return "ok";

    // Head must be near top
    if (nose.y > 0.28) return "ok";

    // Feet must be near bottom
    if (ankleY < 0.72) return "ok";

    return "good";
  }, []);

  // ── capture photo ────────────────────────────────────────────────────────
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const lms   = landmarksRef.current;
    if (!video || !lms) return;

    const snap = document.createElement("canvas");
    snap.width  = video.videoWidth;
    snap.height = video.videoHeight;
    const sCtx = snap.getContext("2d")!;
    sCtx.drawImage(video, 0, 0);
    const dataUrl = snap.toDataURL("image/jpeg", 0.85);

    cancelAnimationFrame(animRef.current);
    setCaptured(true);
    onCapture(lms, dataUrl);
  }, [onCapture]);

  // ── start / stop countdown ───────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countingRef.current) return;
    countingRef.current = true;
    setCountdown(3);
    let n = 3;
    const tick = () => {
      n -= 1;
      if (n <= 0) {
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(n);
        countRef.current = setTimeout(tick, 1000);
      }
    };
    countRef.current = setTimeout(tick, 1000);
  }, [capturePhoto]);

  const stopCountdown = useCallback(() => {
    if (!countingRef.current) return;
    countingRef.current = false;
    setCountdown(null);
    if (countRef.current) clearTimeout(countRef.current);
  }, []);

  // ── main detection loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (captured) return;

    let running = true;
    const video  = videoRef.current!;
    const canvas = canvasRef.current!;

    async function init() {
      // start camera
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

      // load mediapipe
      const { PoseLandmarker, FilesetResolver } =
        await import("@mediapipe/tasks-vision");

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );

      detectorRef.current = await PoseLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        }
      );

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
      if (now - lastTs < 80) return; // ~12 fps
      lastTs = now;

      const result = detector.detectForVideo(video, now);
      const ctx = canvas.getContext("2d")!;
      const w = canvas.width  = video.videoWidth  || 640;
      const h = canvas.height = video.videoHeight || 480;

      if (result.landmarks && result.landmarks.length > 0) {
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
      const stream = video.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [captured, drawOverlay, evalPose, startCountdown, stopCountdown]);

  const color = STATE_COLOR[poseState];

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* camera wrapper */}
      <div
        className="relative rounded-2xl overflow-hidden bg-black"
        style={{ aspectRatio: "4/3" }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full scale-x-[-1]"
          style={{ pointerEvents: "none" }}
        />

        {/* border glow that matches pose state */}
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 3px ${color}, 0 0 20px ${color}44`,
          }}
        />

        {/* countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="font-display font-black text-white"
              style={{
                fontSize: "8rem",
                textShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
                animation: "pulse 0.9s ease-in-out infinite",
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* loading spinner */}
        {poseState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-white text-sm font-medium">Carregando detecção...</p>
          </div>
        )}
      </div>

      {/* status bar */}
      <div
        className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
        style={{ background: `${color}18`, border: `1px solid ${color}44` }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
        <p className="text-sm font-medium" style={{ color }}>
          {STATE_MSG_PT[poseState]}
        </p>
      </div>

      {label && (
        <p className="mt-2 text-center text-xs text-brand-gray">{label}</p>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
