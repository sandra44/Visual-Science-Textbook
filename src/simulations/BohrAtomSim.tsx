import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { RenderDimension } from '../types/visualizer';

const ELEMENTS = [
  { z: 1, sym: 'H', name: 'Hydrogen', n: 0 },
  { z: 2, sym: 'He', name: 'Helium', n: 2 },
  { z: 3, sym: 'Li', name: 'Lithium', n: 4 },
  { z: 4, sym: 'Be', name: 'Beryllium', n: 5 },
  { z: 5, sym: 'B', name: 'Boron', n: 6 },
  { z: 6, sym: 'C', name: 'Carbon', n: 6 },
  { z: 7, sym: 'N', name: 'Nitrogen', n: 7 },
  { z: 8, sym: 'O', name: 'Oxygen', n: 8 },
  { z: 9, sym: 'F', name: 'Fluorine', n: 10 },
  { z: 10, sym: 'Ne', name: 'Neon', n: 10 },
  { z: 11, sym: 'Na', name: 'Sodium', n: 12 },
  { z: 12, sym: 'Mg', name: 'Magnesium', n: 12 },
  { z: 13, sym: 'Al', name: 'Aluminium', n: 14 },
  { z: 14, sym: 'Si', name: 'Silicon', n: 14 },
  { z: 15, sym: 'P', name: 'Phosphorus', n: 16 },
  { z: 16, sym: 'S', name: 'Sulfur', n: 16 },
  { z: 17, sym: 'Cl', name: 'Chlorine', n: 18 },
  { z: 18, sym: 'Ar', name: 'Argon', n: 22 },
];

function getShells(z: number): number[] {
  const k = Math.min(2, z);
  const l = Math.min(8, Math.max(0, z - 2));
  const m = Math.max(0, z - 10);
  return [k, l, m].filter((c) => c > 0);
}

interface BohrAtomSimProps {
  dimension: RenderDimension;
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function BohrAtomSim({
  dimension,
  controlValues,
  onSelectHotspot,
}: BohrAtomSimProps) {
  const z = Math.max(1, Math.min(18, Number(controlValues.atomicNumber ?? 6)));
  const el = ELEMENTS[z - 1];
  const shells = getShells(z);

  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const mount3dRef = useRef<HTMLDivElement | null>(null);

  // 2D Bohr Diagram
  useEffect(() => {
    if (dimension !== '2d') return;
    let animId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const elapsed = (now - start) / 1000;
      const canvas = canvas2dRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
          canvas.width = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;
          ctx.clearRect(0, 0, W, H);

          const cx = W / 2;
          const cy = H / 2;
          const maxR = Math.min(W, H) * 0.4;

          // Shells
          const shellNames = ['K', 'L', 'M'];
          shells.forEach((count, idx) => {
            const r = ((idx + 1) / 3.2) * maxR + 26;
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = '600 10px system-ui, sans-serif';
            ctx.fillText(`${shellNames[idx]} (${count}e⁻)`, cx + r + 6, cy - 4);

            const speed = 0.8 / (idx + 1);
            for (let i = 0; i < count; i++) {
              const ang = (i / count) * Math.PI * 2 + elapsed * speed;
              const ex = cx + r * Math.cos(ang);
              const ey = cy + r * Math.sin(ang);
              ctx.fillStyle = '#0284C7';
              ctx.beginPath();
              ctx.arc(ex, ey, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          });

          // Legend
          ctx.fillStyle = '#57534E';
          ctx.font = '11px system-ui, sans-serif';
          ctx.fillText(`Nucleus: ${z}p⁺, ${el.n}n⁰  |  Blue Dots: Electrons (e⁻) in K/L/M shells`, 20, 24);

          // Nucleus
          ctx.fillStyle = '#F43F5E';
          ctx.beginPath();
          ctx.arc(cx, cy, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '700 13px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.sym, cx, cy);

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [dimension, z, el.sym, shells]);

  // 3D Three.js Atom
  useEffect(() => {
    if (dimension !== '3d' || !mount3dRef.current) return;
    const container = mount3dRef.current;
    const width = container.clientWidth || 680;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF9F6');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(5, 8, 6);
    scene.add(dl);

    // Nucleus cluster
    const nucleusGroup = new THREE.Group();
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
    const totalNuc = Math.min(20, z + el.n);
    for (let i = 0; i < totalNuc; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        i % 2 === 0 ? protonMat : neutronMat
      );
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNuc);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rad = i === 0 ? 0 : 0.22;
      m.position.set(
        rad * Math.sin(phi) * Math.cos(theta),
        rad * Math.sin(phi) * Math.sin(theta),
        rad * Math.cos(phi)
      );
      nucleusGroup.add(m);
    }
    scene.add(nucleusGroup);

    // Electron rings & spheres
    const electronMeshes: { mesh: THREE.Mesh; radius: number; angle: number; speed: number; tilt: number }[] = [];
    shells.forEach((count, idx) => {
      const radius = 1.2 + idx * 0.95;
      const tilt = idx * 0.45;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.015, 8, 64),
        new THREE.MeshBasicMaterial({ color: 0xcbd5e1 })
      );
      ring.rotation.x = Math.PI / 2 + tilt;
      scene.add(ring);

      for (let i = 0; i < count; i++) {
        const eMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.25 })
        );
        scene.add(eMesh);
        electronMeshes.push({
          mesh: eMesh,
          radius,
          angle: (i / count) * Math.PI * 2,
          speed: 1.2 / (idx + 1),
          tilt,
        });
      }
    });

    let animId = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) / 1000;
      for (const e of electronMeshes) {
        const a = e.angle + t * e.speed;
        const x = e.radius * Math.cos(a);
        const z0 = e.radius * Math.sin(a);
        const y = z0 * Math.sin(e.tilt);
        const zRot = z0 * Math.cos(e.tilt);
        e.mesh.position.set(x, y, zRot);
      }
      nucleusGroup.rotation.y = t * 0.3;
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, [dimension, z, el.n, shells]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <span>
          <strong className="text-stone-900">{el.name} ({el.sym})</strong> • Z ={' '}
          <strong>{z}</strong> • Config:{' '}
          <strong className="text-sky-700">{shells.join(', ')}</strong> •{' '}
          {shells[shells.length - 1] === 8 || z === 2
            ? 'Stable Octet/Duplet'
            : `Valence e⁻: ${shells[shells.length - 1]}`}
        </span>
        <button
          onClick={() => onSelectHotspot('nucleus')}
          className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium hover:bg-rose-100 transition"
        >
          Inspect Nucleus
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {dimension === '2d' ? (
          <canvas
            ref={canvas2dRef}
            onClick={() => onSelectHotspot('nucleus')}
            className="w-full h-full block cursor-pointer"
          />
        ) : (
          <div ref={mount3dRef} onClick={() => onSelectHotspot('nucleus')} className="w-full h-full cursor-grab" />
        )}
      </div>
    </div>
  );
}
