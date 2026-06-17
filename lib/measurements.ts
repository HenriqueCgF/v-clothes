export interface Landmark {
  x: number; // 0–1 normalized
  y: number; // 0–1 normalized
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
};

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function determineSize(bust: number, waist: number, hip: number): BodyMeasurements["tamanho"] {
  // Brazilian ABNT sizing reference
  if (bust <= 80 && waist <= 60 && hip <= 86) return "PP";
  if (bust <= 88 && waist <= 68 && hip <= 94) return "P";
  if (bust <= 96 && waist <= 76 && hip <= 102) return "M";
  if (bust <= 104 && waist <= 84 && hip <= 110) return "G";
  if (bust <= 112 && waist <= 92 && hip <= 118) return "GG";
  return "XGG";
}

export function calculateMeasurements(
  frontLandmarks: Landmark[],
  heightCm: number,
  imgW: number,
  imgH: number
): BodyMeasurements {
  const px = (i: number) => ({
    x: frontLandmarks[i].x * imgW,
    y: frontLandmarks[i].y * imgH,
  });

  const nose      = px(IDX.NOSE);
  const lShoulder = px(IDX.L_SHOULDER);
  const rShoulder = px(IDX.R_SHOULDER);
  const lHip      = px(IDX.L_HIP);
  const rHip      = px(IDX.R_HIP);
  const lAnkle    = px(IDX.L_ANKLE);
  const rAnkle    = px(IDX.R_ANKLE);

  // Body pixel height: nose → ankle midpoint
  const ankleMidY = (lAnkle.y + rAnkle.y) / 2;
  const bodyPx = ankleMidY - nose.y;

  // px-to-cm ratio (pixels per cm)
  const ppc = bodyPx / (heightCm * 0.93); // 93% = ankle-to-nose / full height

  // Width measurements in pixels → cm
  const shoulderPx = dist(lShoulder, rShoulder);
  const hipPx = dist(lHip, rHip);

  // Waist: estimated midpoint between shoulder and hip
  const waistMidY = (lShoulder.y + rShoulder.y) / 2 + (lHip.y - lShoulder.y) * 0.55;
  const waistLX = lShoulder.x + (lHip.x - lShoulder.x) * 0.55;
  const waistRX = rShoulder.x + (rHip.x - rShoulder.x) * 0.55;
  const waistPx = Math.abs(waistRX - waistLX);

  const shoulderCm = shoulderPx / ppc;

  // Front view shows ~43% of full circumference for each measurement
  const bustCm   = (shoulderPx / ppc) * 2.3;
  const cinturaCm = (waistPx  / ppc) * 2.5;
  const quadrilCm = (hipPx    / ppc) * 2.4;

  // Leg length: hip midpoint to ankle midpoint
  const hipMidY   = (lHip.y + rHip.y) / 2;
  const pernaCm   = (ankleMidY - hipMidY) / ppc;

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
