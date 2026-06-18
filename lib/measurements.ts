export interface Landmark {
  x: number; // 0–1 normalized (relative to video width)
  y: number; // 0–1 normalized (relative to video height)
  z: number;
  visibility?: number;
}

export interface BodyMeasurements {
  altura: number;
  busto: number;
  cintura: number;
  quadril: number;
  ombros: number;
  perna: number;
  tamanho: "PP" | "P" | "M" | "G" | "GG" | "XGG";
}

// MediaPipe landmark indices
const IDX = {
  NOSE: 0,
  L_SHOULDER: 11, R_SHOULDER: 12,
  L_ELBOW: 13,    R_ELBOW: 14,
  L_WRIST: 15,    R_WRIST: 16,
  L_HIP: 23,      R_HIP: 24,
  L_KNEE: 25,     R_KNEE: 26,
  L_ANKLE: 27,    R_ANKLE: 28,
  L_HEEL: 29,     R_HEEL: 30,
  L_FOOT: 31,     R_FOOT: 32,
};

function determineSize(bust: number, waist: number, hip: number): BodyMeasurements["tamanho"] {
  if (bust <= 80  && waist <= 60 && hip <= 86)  return "PP";
  if (bust <= 88  && waist <= 68 && hip <= 94)  return "P";
  if (bust <= 96  && waist <= 76 && hip <= 102) return "M";
  if (bust <= 104 && waist <= 84 && hip <= 110) return "G";
  if (bust <= 112 && waist <= 92 && hip <= 118) return "GG";
  return "XGG";
}

/**
 * All calculations stay in NORMALIZED coordinate space.
 *
 * MediaPipe normalizes x ∈ [0,1] relative to image WIDTH and
 * y ∈ [0,1] relative to image HEIGHT — so 1 unit of x ≠ 1 unit of y
 * in physical space unless the image is square.
 *
 * Correct conversion:
 *   horizontal_physical = x_norm * AR      (AR = imgW / imgH)
 *   vertical_physical   = y_norm * 1
 *
 * Both are now in the same unit ("image-height-lengths"), so we can
 * use bodyNorm_y as the calibration baseline.
 */
export function calculateMeasurements(
  lms: Landmark[],
  heightCm: number,
  imgW: number,    // actual video width  (e.g. 480 on portrait phone)
  imgH: number     // actual video height (e.g. 640 on portrait phone)
): BodyMeasurements {
  // Aspect ratio: converts x-normalized to the same unit as y-normalized
  const AR = imgW / imgH;

  // ── helpers ─────────────────────────────────────────────────────────────
  // Horizontal distance in normalized-y-equivalent units
  const hdist = (ia: number, ib: number) =>
    Math.abs(lms[ia].x - lms[ib].x) * AR;

  // Vertical distance (no correction needed)
  const vdist = (ia: number, ib: number) =>
    Math.abs(lms[ia].y - lms[ib].y);

  // ── calibration baseline ────────────────────────────────────────────────
  // Use the lowest visible landmark among heel and foot index.
  // Ankle can be detected at shin level when feet are partially hidden —
  // heels and foot-tip are more reliably placed at the actual floor level.
  const bottomCandidates = [
    { idx: IDX.L_HEEL,   lm: lms[IDX.L_HEEL]   },
    { idx: IDX.R_HEEL,   lm: lms[IDX.R_HEEL]   },
    { idx: IDX.L_FOOT,   lm: lms[IDX.L_FOOT]   },
    { idx: IDX.R_FOOT,   lm: lms[IDX.R_FOOT]   },
    { idx: IDX.L_ANKLE,  lm: lms[IDX.L_ANKLE]  },
    { idx: IDX.R_ANKLE,  lm: lms[IDX.R_ANKLE]  },
  ].filter(c => c.lm && (c.lm.visibility ?? 0) > 0.2);

  // Highest y value = lowest on screen = closest to floor
  const bottomNormY = bottomCandidates.length > 0
    ? Math.max(...bottomCandidates.map(c => c.lm.y))
    : (lms[IDX.L_ANKLE].y + lms[IDX.R_ANKLE].y) / 2;

  const bodyNormY = bottomNormY - lms[IDX.NOSE].y;

  // nose-to-floor = 94% of full height (nose is ~6% from top of head)
  const noseToFloorCm = heightCm * 0.940;
  const normPerCm     = bodyNormY / noseToFloorCm; // normalized units / cm

  // ── horizontal widths → cm ──────────────────────────────────────────────
  const shoulderNorm = hdist(IDX.L_SHOULDER, IDX.R_SHOULDER);
  const hipNorm      = hdist(IDX.L_HIP,      IDX.R_HIP);

  // Waist: interpolated between shoulder and hip (55% down from shoulder)
  const waistNorm =
    (Math.abs(lms[IDX.L_SHOULDER].x - lms[IDX.L_HIP].x) * 0.55 +
     Math.abs(lms[IDX.R_SHOULDER].x - lms[IDX.R_HIP].x) * 0.55 +
     Math.abs(lms[IDX.L_SHOULDER].x - lms[IDX.R_SHOULDER].x) * 0.45 +
     Math.abs(lms[IDX.L_HIP].x      - lms[IDX.R_HIP].x)      * 0.55
    ) / 2 * AR;

  // MediaPipe mede entre as articulações (glenoumeral), que é ~10% menor
  // que a distância acromial que uma fita métrica pega.
  const shoulderCm = (shoulderNorm / normPerCm) * 1.10;
  const hipWidthCm = hipNorm      / normPerCm;
  const waistWidthCm = waistNorm  / normPerCm;

  // ── circumferences (front half-width × 2 × shape factor) ───────────────
  // The front view shows approximately 43–45% of the body circumference.
  // Shape factors validated against standard size charts.
  const bustCm    = shoulderCm   * 2.2;   // shoulder-width → bust circumference
  const cinturaCm = waistWidthCm * 2.4;   // front waist width → full waist
  const quadrilCm = hipWidthCm   * 2.35;  // front hip width → full hip

  // ── vertical distances → cm ─────────────────────────────────────────────
  const hipMidY  = (lms[IDX.L_HIP].y   + lms[IDX.R_HIP].y)   / 2;
  const pernaNorm = ankleNormY - hipMidY;
  const pernaCm   = pernaNorm / normPerCm;

  const tamanho = determineSize(bustCm, cinturaCm, quadrilCm);

  return {
    altura:  heightCm,
    busto:   Math.round(bustCm),
    cintura: Math.round(cinturaCm),
    quadril: Math.round(quadrilCm),
    ombros:  Math.round(shoulderCm),
    perna:   Math.round(pernaCm),
    tamanho,
  };
}

// Body outline segments for silhouette drawing
export const BODY_CONNECTIONS = [
  [IDX.L_SHOULDER, IDX.R_SHOULDER],
  [IDX.L_SHOULDER, IDX.L_ELBOW], [IDX.L_ELBOW, IDX.L_WRIST],
  [IDX.R_SHOULDER, IDX.R_ELBOW], [IDX.R_ELBOW, IDX.R_WRIST],
  [IDX.L_SHOULDER, IDX.L_HIP],   [IDX.R_SHOULDER, IDX.R_HIP],
  [IDX.L_HIP, IDX.R_HIP],
  [IDX.L_HIP, IDX.L_KNEE],       [IDX.L_KNEE, IDX.L_ANKLE],
  [IDX.R_HIP, IDX.R_KNEE],       [IDX.R_KNEE, IDX.R_ANKLE],
];
