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

      /* ── scene ── */
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0.05, 4.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount!.appendChild(renderer.domElement);

      /* ── materials ── */
      const CYAN  = 0x38BDF8;
      const LCYAN = 0x7DD3FC;

      const wireMat  = new THREE.MeshBasicMaterial({ color: CYAN,  wireframe: true,  transparent: true, opacity: 0.82 });
      const solidMat = new THREE.MeshBasicMaterial({ color: LCYAN, wireframe: false, transparent: true, opacity: 0.10 });

      /* ── helper: add a segment ── */
      const body = new THREE.Group();

      function seg(
        rT: number, rB: number, h: number,
        x: number, y: number, z: number,
        rX = 0, rZ = 0, sides = 7
      ) {
        const geo = new THREE.CylinderGeometry(rT, rB, h, sides);
        body.add(Object.assign(new THREE.Mesh(geo, wireMat.clone()),
          { position: new THREE.Vector3(x, y, z), rotation: new THREE.Euler(rX, 0, rZ) }));
        body.add(Object.assign(new THREE.Mesh(geo, solidMat.clone()),
          { position: new THREE.Vector3(x, y, z), rotation: new THREE.Euler(rX, 0, rZ) }));
      }

      function sphere(r: number, x: number, y: number, z: number, segsH = 10, segsV = 8) {
        const geo = new THREE.SphereGeometry(r, segsH, segsV);
        body.add(Object.assign(new THREE.Mesh(geo, wireMat.clone()), { position: new THREE.Vector3(x, y, z) }));
        body.add(Object.assign(new THREE.Mesh(geo, solidMat.clone()), { position: new THREE.Vector3(x, y, z) }));
      }

      /* ── body parts ── */
      // Head
      sphere(0.20, 0, 1.08, 0, 9, 8);

      // Neck
      seg(0.08, 0.09, 0.16, 0, 0.87, 0);

      // Torso — chest, belly, pelvis
      seg(0.30, 0.27, 0.38, 0, 0.56, 0, 0, 0, 8);
      seg(0.27, 0.24, 0.26, 0, 0.22, 0, 0, 0, 8);
      seg(0.24, 0.27, 0.20, 0, -0.01, 0, 0, 0, 8);

      // Shoulders (spheres at joints)
      sphere(0.095, -0.35, 0.72, 0, 7, 6);
      sphere(0.095,  0.35, 0.72, 0, 7, 6);

      // Left arm
      seg(0.08, 0.068, 0.36, -0.44, 0.52, 0, 0,  Math.PI / 9);
      seg(0.068, 0.055, 0.33, -0.60, 0.19, 0, 0,  Math.PI / 8);

      // Right arm
      seg(0.08, 0.068, 0.36,  0.44, 0.52, 0, 0, -Math.PI / 9);
      seg(0.068, 0.055, 0.33,  0.60, 0.19, 0, 0, -Math.PI / 8);

      // Left leg
      seg(0.12, 0.10, 0.48, -0.14, -0.37, 0, 0, -0.04);
      sphere(0.08, -0.14, -0.63, 0, 7, 5); // knee
      seg(0.09, 0.07, 0.46, -0.145, -0.88, 0, 0, 0.02);

      // Right leg
      seg(0.12, 0.10, 0.48,  0.14, -0.37, 0, 0, 0.04);
      sphere(0.08,  0.14, -0.63, 0, 7, 5);
      seg(0.09, 0.07, 0.46,  0.145, -0.88, 0, 0, -0.02);

      // Feet
      const footGeo = new THREE.BoxGeometry(0.14, 0.08, 0.22);
      const addFoot = (xSign: number) => {
        const fw = new THREE.Mesh(footGeo, wireMat.clone());
        const fs = new THREE.Mesh(footGeo, solidMat.clone());
        fw.position.set(xSign * 0.14, -1.14, 0.04);
        fs.position.set(xSign * 0.14, -1.14, 0.04);
        body.add(fw); body.add(fs);
      };
      addFoot(-1); addFoot(1);

      scene.add(body);

      /* ── floor ring ── */
      const ringGeo = new THREE.RingGeometry(0.5, 0.52, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.22;
      scene.add(ring);

      const ring2Geo = new THREE.RingGeometry(0.35, 0.36, 48);
      const ring2 = new THREE.Mesh(ring2Geo, new THREE.MeshBasicMaterial({ color: LCYAN, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
      ring2.rotation.x = -Math.PI / 2;
      ring2.position.y = -1.22;
      scene.add(ring2);

      /* ── scan line ── */
      const scanLineMat = new THREE.MeshBasicMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
      const scanGlowMat = new THREE.MeshBasicMaterial({ color: CYAN,      transparent: true, opacity: 0.18, side: THREE.DoubleSide });

      const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.012), scanLineMat);
      const scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.10),  scanGlowMat);
      scene.add(scanLine);
      scene.add(scanGlow);

      /* ── animation ── */
      let scanY  = -1.2;
      let scanDir = 1;
      let pulse   = 0;

      function animate() {
        animId = requestAnimationFrame(animate);

        body.rotation.y += 0.007;
        pulse += 0.025;

        // Pulsing opacity on wire meshes
        const opacity = 0.72 + Math.sin(pulse) * 0.12;
        body.children.forEach((child) => {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (m && m.wireframe) m.opacity = opacity;
        });

        // Scan line travel
        scanY += 0.013 * scanDir;
        if (scanY >  1.3) scanDir = -1;
        if (scanY < -1.3) scanDir =  1;
        scanLine.position.y = scanY;
        scanGlow.position.y = scanY;

        // Scan line fades near edges
        const edgeFade = 1 - Math.abs(scanY) / 1.4;
        scanLineMat.opacity = 0.95 * edgeFade;
        scanGlowMat.opacity = 0.18 * edgeFade;

        // Ring gentle pulse
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
      style={{
        filter: "drop-shadow(0 0 8px #38BDF888) drop-shadow(0 0 20px #0EA5E944)",
      }}
    />
  );
}
