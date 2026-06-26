"use client";

import { useEffect, useRef } from "react";

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

      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0.05, 4.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount!.appendChild(renderer.domElement);

      const CYAN  = 0x38BDF8;
      const LCYAN = 0x7DD3FC;

      const body = new THREE.Group();

      // Helper to add a cylinder segment
      function seg(
        rT: number, rB: number, h: number,
        x: number, y: number, z: number,
        rX = 0, rZ = 0, sides = 7
      ) {
        const geo   = new THREE.CylinderGeometry(rT, rB, h, sides);
        const wire  = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: CYAN,  wireframe: true,  transparent: true, opacity: 0.82 }));
        const solid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: LCYAN, wireframe: false, transparent: true, opacity: 0.08 }));
        wire.position.set(x, y, z);   wire.rotation.set(rX, 0, rZ);
        solid.position.set(x, y, z);  solid.rotation.set(rX, 0, rZ);
        body.add(wire);
        body.add(solid);
      }

      // Helper to add a sphere
      function sph(r: number, x: number, y: number, z: number, segsH = 10, segsV = 8) {
        const geo   = new THREE.SphereGeometry(r, segsH, segsV);
        const wire  = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: CYAN,  wireframe: true,  transparent: true, opacity: 0.82 }));
        const solid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: LCYAN, wireframe: false, transparent: true, opacity: 0.08 }));
        wire.position.set(x, y, z);
        solid.position.set(x, y, z);
        body.add(wire);
        body.add(solid);
      }

      // Head
      sph(0.20, 0, 1.08, 0, 9, 8);
      // Neck
      seg(0.08, 0.09, 0.16, 0, 0.87, 0);
      // Torso
      seg(0.30, 0.27, 0.38, 0, 0.56, 0, 0, 0, 8);
      seg(0.27, 0.24, 0.26, 0, 0.22, 0, 0, 0, 8);
      seg(0.24, 0.27, 0.20, 0, -0.01, 0, 0, 0, 8);
      // Shoulder joints
      sph(0.095, -0.35, 0.72, 0, 7, 6);
      sph(0.095,  0.35, 0.72, 0, 7, 6);
      // Left arm
      seg(0.08, 0.068, 0.36, -0.44, 0.52, 0, 0,  Math.PI / 9);
      seg(0.068, 0.055, 0.33, -0.60, 0.19, 0, 0,  Math.PI / 8);
      // Right arm
      seg(0.08, 0.068, 0.36,  0.44, 0.52, 0, 0, -Math.PI / 9);
      seg(0.068, 0.055, 0.33,  0.60, 0.19, 0, 0, -Math.PI / 8);
      // Left leg
      seg(0.12, 0.10, 0.48, -0.14, -0.37, 0);
      sph(0.08, -0.14, -0.63, 0, 7, 5);
      seg(0.09, 0.07, 0.46, -0.145, -0.88, 0);
      // Right leg
      seg(0.12, 0.10, 0.48,  0.14, -0.37, 0);
      sph(0.08,  0.14, -0.63, 0, 7, 5);
      seg(0.09, 0.07, 0.46,  0.145, -0.88, 0);
      // Feet
      const footGeo = new THREE.BoxGeometry(0.14, 0.08, 0.22);
      for (const xSign of [-1, 1]) {
        const fw = new THREE.Mesh(footGeo, new THREE.MeshBasicMaterial({ color: CYAN,  wireframe: true,  transparent: true, opacity: 0.82 }));
        const fs = new THREE.Mesh(footGeo, new THREE.MeshBasicMaterial({ color: LCYAN, wireframe: false, transparent: true, opacity: 0.08 }));
        fw.position.set(xSign * 0.14, -1.14, 0.04);
        fs.position.set(xSign * 0.14, -1.14, 0.04);
        body.add(fw);
        body.add(fs);
      }

      scene.add(body);

      // Floor rings
      const ringGeo  = new THREE.RingGeometry(0.5,  0.52, 48);
      const ringGeo2 = new THREE.RingGeometry(0.35, 0.36, 48);
      const ringMat  = new THREE.MeshBasicMaterial({ color: CYAN,  transparent: true, opacity: 0.28, side: THREE.DoubleSide });
      const ringMat2 = new THREE.MeshBasicMaterial({ color: LCYAN, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
      const ring  = new THREE.Mesh(ringGeo,  ringMat);
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring.rotation.x  = -Math.PI / 2;  ring.position.y  = -1.22;
      ring2.rotation.x = -Math.PI / 2;  ring2.position.y = -1.22;
      scene.add(ring);
      scene.add(ring2);

      // Scan line
      const scanLineMat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
      const scanGlowMat = new THREE.MeshBasicMaterial({ color: CYAN,     transparent: true, opacity: 0.18, side: THREE.DoubleSide });
      const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.012), scanLineMat);
      const scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.10),  scanGlowMat);
      scene.add(scanLine);
      scene.add(scanGlow);

      // Wire meshes for pulsing (collect references)
      const wireMeshes: THREE.Mesh[] = [];
      body.traverse((child) => {
        const m = child as THREE.Mesh;
        if (m.isMesh && (m.material as THREE.MeshBasicMaterial).wireframe) {
          wireMeshes.push(m);
        }
      });

      let scanY   = -1.2;
      let scanDir =  1;
      let pulse   =  0;

      function animate() {
        animId = requestAnimationFrame(animate);

        body.rotation.y += 0.007;
        pulse += 0.025;

        // Pulse opacity on wireframe meshes
        const op = 0.72 + Math.sin(pulse) * 0.12;
        for (const m of wireMeshes) {
          (m.material as THREE.MeshBasicMaterial).opacity = op;
        }

        // Scan line travel
        scanY += 0.013 * scanDir;
        if (scanY >  1.3) scanDir = -1;
        if (scanY < -1.3) scanDir =  1;
        scanLine.position.y = scanY;
        scanGlow.position.y = scanY;

        const edgeFade = 1 - Math.abs(scanY) / 1.4;
        scanLineMat.opacity = 0.95 * edgeFade;
        scanGlowMat.opacity = 0.18 * edgeFade;

        ringMat.opacity = 0.20 + Math.sin(pulse * 0.6) * 0.08;

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
      style={{ filter: "drop-shadow(0 0 8px #38BDF888) drop-shadow(0 0 20px #0EA5E944)" }}
    />
  );
}
