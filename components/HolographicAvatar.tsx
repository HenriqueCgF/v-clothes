"use client";

import { useEffect, useRef } from "react";
import type { Mesh, MeshBasicMaterial } from "three";

export default function HolographicAvatar() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    const mount = mountRef.current;
    if (!mount) return;

    async function init() {
      const THREE = await import("three");

      const W = mount!.clientWidth  || 160;
      const H = mount!.clientHeight || 280;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0.08, 4.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount!.appendChild(renderer.domElement);

      const CYAN  = 0x38BDF8;
      const LCYAN = 0x7DD3FC;

      const wireMeshes: Mesh[] = [];
      const body = new THREE.Group();

      function makeMat(wire: boolean) {
        return new THREE.MeshBasicMaterial({
          color: wire ? CYAN : LCYAN,
          wireframe: wire,
          transparent: true,
          opacity: wire ? 0.85 : 0.07,
        });
      }

      // Add a cylinder segment. Positions are EXACT endpoints so every joint connects.
      // rZ tilts the cylinder: + tilts left arm outward, – tilts right arm outward.
      function seg(
        rTop: number, rBot: number, h: number,
        x: number, y: number, z: number,
        rX = 0, rZ = 0, sides = 8
      ) {
        const geo = new THREE.CylinderGeometry(rTop, rBot, h, sides);
        const w = new THREE.Mesh(geo, makeMat(true));
        const s = new THREE.Mesh(geo, makeMat(false));
        w.position.set(x, y, z); w.rotation.set(rX, 0, rZ);
        s.position.set(x, y, z); s.rotation.set(rX, 0, rZ);
        body.add(w); body.add(s);
        wireMeshes.push(w);
      }

      // Add a sphere (joint or head)
      function sph(r: number, x: number, y: number, z: number, sh = 10, sv = 8) {
        const geo = new THREE.SphereGeometry(r, sh, sv);
        const w = new THREE.Mesh(geo, makeMat(true));
        const s = new THREE.Mesh(geo, makeMat(false));
        w.position.set(x, y, z);
        s.position.set(x, y, z);
        body.add(w); body.add(s);
        wireMeshes.push(w);
      }

      // ── HEAD ──────────────────────────────────────────────────────────────
      // Head center y=1.10, r=0.19  →  top=1.29, bottom=0.91
      sph(0.19, 0, 1.10, 0, 10, 8);

      // ── NECK ──────────────────────────────────────────────────────────────
      // Top=0.91 → bottom=0.77  center=0.84  h=0.14
      seg(0.07, 0.075, 0.14, 0, 0.84, 0, 0, 0, 8);

      // ── TORSO ─────────────────────────────────────────────────────────────
      // Chest:  top=0.77 → bottom=0.41  center=0.59  h=0.36
      seg(0.29, 0.255, 0.36, 0, 0.59, 0, 0, 0, 10);
      // Belly:  top=0.41 → bottom=0.21  center=0.31  h=0.20
      seg(0.255, 0.240, 0.20, 0, 0.31, 0, 0, 0, 10);
      // Pelvis: top=0.21 → bottom=0.01  center=0.11  h=0.20
      seg(0.240, 0.265, 0.20, 0, 0.11, 0, 0, 0, 10);

      // ── SHOULDER JOINTS ───────────────────────────────────────────────────
      // Sit at the top of the chest, x=±0.315
      sph(0.10, -0.315, 0.71, 0, 8, 6);
      sph(0.10,  0.315, 0.71, 0, 8, 6);

      // ── ARMS ──────────────────────────────────────────────────────────────
      // Left upper arm: shoulder(-0.315,0.71) → elbow(-0.345,0.375)
      //   center=(-0.330, 0.5425), vec=(-0.030,-0.335), h≈0.336, rZ=+atan(0.030/0.335)≈+0.089
      seg(0.085, 0.075, 0.336, -0.330, 0.5425, 0, 0,  0.089, 7);
      sph(0.075, -0.345, 0.375, 0, 7, 5);  // left elbow

      // Left forearm: elbow(-0.345,0.375) → wrist(-0.370,0.065)
      //   center=(-0.3575,0.220), vec=(-0.025,-0.310), h≈0.311, rZ≈+0.080
      seg(0.075, 0.060, 0.311, -0.3575, 0.220, 0, 0,  0.080, 7);
      sph(0.060, -0.370, 0.065, 0, 6, 5);  // left hand

      // Right upper arm (mirror X and negate rZ)
      seg(0.085, 0.075, 0.336,  0.330, 0.5425, 0, 0, -0.089, 7);
      sph(0.075,  0.345, 0.375, 0, 7, 5);

      // Right forearm
      seg(0.075, 0.060, 0.311,  0.3575, 0.220, 0, 0, -0.080, 7);
      sph(0.060,  0.370, 0.065, 0, 6, 5);

      // ── HIP JOINTS ────────────────────────────────────────────────────────
      sph(0.10, -0.135, 0.01, 0, 8, 6);
      sph(0.10,  0.135, 0.01, 0, 8, 6);

      // ── LEGS ──────────────────────────────────────────────────────────────
      // Left thigh: hip(-0.135,0.01) → knee(-0.135,-0.52)  center=(-0.135,-0.255) h=0.53
      seg(0.115, 0.100, 0.53, -0.135, -0.255, 0, 0, 0, 7);
      sph(0.090, -0.135, -0.525, 0, 7, 5);  // left knee

      // Left shin: knee(-0.135,-0.525) → ankle(-0.135,-0.975)  center=(-0.135,-0.75) h=0.45
      seg(0.090, 0.075, 0.45, -0.135, -0.750, 0, 0, 0, 7);
      sph(0.068, -0.135, -0.975, 0, 6, 5);  // left ankle

      // Right thigh + shin (mirror)
      seg(0.115, 0.100, 0.53,  0.135, -0.255, 0, 0, 0, 7);
      sph(0.090,  0.135, -0.525, 0, 7, 5);
      seg(0.090, 0.075, 0.45,  0.135, -0.750, 0, 0, 0, 7);
      sph(0.068,  0.135, -0.975, 0, 6, 5);

      // ── FEET ──────────────────────────────────────────────────────────────
      const footGeo = new THREE.BoxGeometry(0.13, 0.07, 0.24);
      for (const xSign of [-1, 1]) {
        const fw = new THREE.Mesh(footGeo, makeMat(true));
        const fs = new THREE.Mesh(footGeo, makeMat(false));
        fw.position.set(xSign * 0.135, -1.06, 0.05);
        fs.position.set(xSign * 0.135, -1.06, 0.05);
        body.add(fw); body.add(fs);
        wireMeshes.push(fw);
      }

      scene.add(body);

      // ── FLOOR RINGS ───────────────────────────────────────────────────────
      const ringMat  = new THREE.MeshBasicMaterial({ color: CYAN,  transparent: true, opacity: 0.28, side: THREE.DoubleSide });
      const ringMat2 = new THREE.MeshBasicMaterial({ color: LCYAN, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
      const ring  = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.47, 48), ringMat);
      const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.30, 0.31, 48), ringMat2);
      ring.rotation.x  = -Math.PI / 2; ring.position.y  = -1.12;
      ring2.rotation.x = -Math.PI / 2; ring2.position.y = -1.12;
      scene.add(ring); scene.add(ring2);

      // ── SCAN LINE ─────────────────────────────────────────────────────────
      const scanLineMat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
      const scanGlowMat = new THREE.MeshBasicMaterial({ color: CYAN,     transparent: true, opacity: 0.18, side: THREE.DoubleSide });
      const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.011), scanLineMat);
      const scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.09),  scanGlowMat);
      scene.add(scanLine); scene.add(scanGlow);

      // ── ANIMATE ───────────────────────────────────────────────────────────
      let scanY = -1.1, scanDir = 1, pulse = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        body.rotation.y += 0.006;
        pulse += 0.022;

        const op = 0.72 + Math.sin(pulse) * 0.13;
        for (const m of wireMeshes) (m.material as MeshBasicMaterial).opacity = op;

        scanY += 0.012 * scanDir;
        if (scanY >  1.3) scanDir = -1;
        if (scanY < -1.1) scanDir =  1;
        scanLine.position.y = scanY;
        scanGlow.position.y = scanY;
        const fade = 1 - Math.abs(scanY) / 1.3;
        scanLineMat.opacity = 0.95 * fade;
        scanGlowMat.opacity = 0.18 * fade;

        ringMat.opacity = 0.20 + Math.sin(pulse * 0.5) * 0.08;

        renderer.render(scene, camera);
      }

      animate();
    }

    init();
    return () => {
      cancelAnimationFrame(animId);
      if (mount) mount.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 10px #38BDF899) drop-shadow(0 0 24px #0EA5E955)" }}
    />
  );
}
