import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pause, Play, RotateCcw, Scissors } from 'lucide-react';
import type { RenderDimension } from '../types/visualizer';

export interface PendulumLiveStats {
  phase: 'swinging' | 'projectile' | 'landed';
  speed: number;
  vx: number;
  vy: number;
  tension: number;
  height: number;
  ke: number;
  pe: number;
  range: number | null;
  angleDeg: number;
}

interface PendulumProjectileSimProps {
  dimension: RenderDimension;
  controlValues: Record<string, number | boolean | string>;
  cutSignal: number;
  onSelectHotspot: (id: string) => void;
  onStatsUpdate?: (stats: PendulumLiveStats) => void;
}

interface SimState {
  phase: 'swinging' | 'projectile' | 'landed';
  theta: number; // rad from downward vertical (+ = right)
  omega: number; // rad/s
  x: number; // meters, pivot is at x=0
  y: number; // meters above ground (pivot is at y = PIVOT_Y)
  vx: number;
  vy: number;
  cutPoint: { x: number; y: number } | null;
  trail: { x: number; y: number; phase: 'swinging' | 'projectile' }[];
  flightTime: number;
  landingX: number | null;
}

const PIVOT_Y = 6.2; // meters above ground

export function PendulumProjectileSim({
  dimension,
  controlValues,
  cutSignal,
  onSelectHotspot,
  onStatsUpdate,
}: PendulumProjectileSimProps) {
  const L = Number(controlValues.length ?? 2.4);
  const startAngleDeg = Number(controlValues.angle ?? 55);
  const g = Number(controlValues.gravity ?? 9.8);
  const mass = Number(controlValues.mass ?? 1.5);
  const showVectors = controlValues.showVectors !== false;
  const showTrail = controlValues.showTrail !== false;

  const [playing, setPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState<number>(1);
  const [stats, setStats] = useState<PendulumLiveStats>({
    phase: 'swinging',
    speed: 0,
    vx: 0,
    vy: 0,
    tension: mass * g,
    height: PIVOT_Y - L,
    ke: 0,
    pe: 0,
    range: null,
    angleDeg: startAngleDeg,
  });

  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const mount3dRef = useRef<HTMLDivElement | null>(null);

  const initSimState = useCallback((): SimState => {
    const theta0 = (startAngleDeg * Math.PI) / 180;
    return {
      phase: 'swinging',
      theta: theta0,
      omega: 0,
      x: L * Math.sin(theta0),
      y: PIVOT_Y - L * Math.cos(theta0),
      vx: 0,
      vy: 0,
      cutPoint: null,
      trail: [],
      flightTime: 0,
      landingX: null,
    };
  }, [L, startAngleDeg]);

  const simRef = useRef<SimState>(initSimState());
  const draggingRef = useRef(false);
  const viewTransformRef = useRef({ ppm: 50, groundY: 400, pivotX: 260, pivotY: 90 });
  const boundsRef = useRef({ minX: -4.5, maxX: 5.5 });

  const resetSim = useCallback(() => {
    simRef.current = initSimState();
    boundsRef.current = { minX: -4.5, maxX: 5.5 };
    setPlaying(true);
  }, [initSimState]);

  // Reset when L or startAngleDeg changes
  useEffect(() => {
    simRef.current = initSimState();
    boundsRef.current = { minX: -4.5, maxX: 5.5 };
  }, [initSimState]);

  const cutString = useCallback(() => {
    const s = simRef.current;
    if (s.phase !== 'swinging') return;
    s.phase = 'projectile';
    s.cutPoint = { x: s.x, y: s.y };
    setPlaying(true);
  }, []);

  // Trigger cut from Inspector button
  const prevCutSignal = useRef(cutSignal);
  useEffect(() => {
    if (cutSignal !== prevCutSignal.current) {
      prevCutSignal.current = cutSignal;
      cutString();
    }
  }, [cutSignal, cutString]);

  // Physics step (sub-stepped RK2/Symplectic)
  const stepPhysics = useCallback(
    (dtRaw: number) => {
      const s = simRef.current;
      if (!playing || draggingRef.current || s.phase === 'landed') return;

      const dtTotal = Math.min(dtRaw, 0.04) * timeScale;
      const subSteps = 6;
      const dt = dtTotal / subSteps;

      for (let i = 0; i < subSteps; i++) {
        if (s.phase === 'swinging') {
          const alpha = -(g / L) * Math.sin(s.theta);
          s.omega += alpha * dt;
          s.theta += s.omega * dt;
          s.x = L * Math.sin(s.theta);
          s.y = PIVOT_Y - L * Math.cos(s.theta);
          s.vx = L * s.omega * Math.cos(s.theta);
          s.vy = L * s.omega * Math.sin(s.theta);
        } else if (s.phase === 'projectile') {
          s.vy -= g * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.flightTime += dt;
          if (s.y <= 0.16) {
            s.y = 0.16;
            s.phase = 'landed';
            s.landingX = s.x;
            break;
          }
        }
      }

      const last = s.trail[s.trail.length - 1];
      if (!last || Math.hypot(s.x - last.x, s.y - last.y) > 0.08) {
        s.trail.push({ x: s.x, y: s.y, phase: s.phase === 'swinging' ? 'swinging' : 'projectile' });
        if (s.trail.length > 350) s.trail.shift();
      }
    },
    [playing, timeScale, g, L]
  );

  // Compute live stats helper
  const computeStats = useCallback((): PendulumLiveStats => {
    const s = simRef.current;
    const speed = Math.hypot(s.vx, s.vy);
    const tension =
      s.phase === 'swinging'
        ? Math.max(0, mass * g * Math.cos(s.theta) + mass * L * s.omega * s.omega)
        : 0;
    const h = Math.max(0, s.y - 0.16);
    const ke = 0.5 * mass * speed * speed;
    const pe = mass * g * h;
    const range =
      s.cutPoint && s.phase !== 'swinging'
        ? Math.abs(s.x - s.cutPoint.x)
        : null;
    return {
      phase: s.phase,
      speed,
      vx: s.vx,
      vy: s.vy,
      tension,
      height: h,
      ke,
      pe,
      range,
      angleDeg: (s.theta * 180) / Math.PI,
    };
  }, [mass, g, L]);

  // 2D Render Loop
  useEffect(() => {
    if (dimension !== '2d') return;
    let animId = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const drawArrow = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      dx: number,
      dy: number,
      color: string,
      label: string
    ) => {
      const len = Math.hypot(dx, dy);
      if (len < 4) return;
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(angle - 0.4), y2 - 9 * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(angle + 0.4), y2 - 9 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();

      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(label, x2 + 6, y2 - 4);
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      stepPhysics(dt);

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

          const s = simRef.current;

          // Auto-expand horizontal world bounds so projectile never leaves viewport
          const targetMinX = Math.min(boundsRef.current.minX, s.x - 1.8);
          const targetMaxX = Math.max(boundsRef.current.maxX, s.x + 1.8);
          boundsRef.current.minX += (targetMinX - boundsRef.current.minX) * 0.25;
          boundsRef.current.maxX += (targetMaxX - boundsRef.current.maxX) * 0.25;

          const worldSpanX = boundsRef.current.maxX - boundsRef.current.minX;
          const groundY = H - 62;
          const ppm = Math.min((W - 48) / worldSpanX, (H - 96) / (PIVOT_Y + 0.9));
          const pivotX = 24 + (-boundsRef.current.minX) * ppm;
          const pivotY = groundY - PIVOT_Y * ppm;
          viewTransformRef.current = { ppm, groundY, pivotX, pivotY };

          const toPx = (wx: number, wy: number) => ({
            px: pivotX + wx * ppm,
            py: groundY - wy * ppm,
          });

          // Subtle pastel grid
          const gridMin = Math.floor(boundsRef.current.minX) - 2;
          const gridMax = Math.ceil(boundsRef.current.maxX) + 2;
          ctx.strokeStyle = '#F1EFEA';
          ctx.lineWidth = 1;
          for (let gx = gridMin; gx <= gridMax; gx++) {
            const x = pivotX + gx * ppm;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, groundY);
            ctx.stroke();
          }
          for (let gy = 0; gy <= 7; gy++) {
            const y = groundY - gy * ppm;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
          }

          // Ground floor
          ctx.fillStyle = '#E7E5DF';
          ctx.fillRect(0, groundY, W, H - groundY);
          ctx.strokeStyle = '#C7C3BA';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, groundY);
          ctx.lineTo(W, groundY);
          ctx.stroke();

          // Meter ticks on ground
          ctx.fillStyle = '#78716C';
          ctx.font = '10px system-ui, sans-serif';
          const tickStep = worldSpanX > 18 ? 2 : 1;
          for (let m = gridMin; m <= gridMax; m += tickStep) {
            const tx = pivotX + m * ppm;
            if (tx < 10 || tx > W - 15) continue;
            ctx.beginPath();
            ctx.moveTo(tx, groundY);
            ctx.lineTo(tx, groundY + 5);
            ctx.stroke();
            ctx.fillText(`${m}m`, tx - 7, groundY + 17);
          }

          const bobPx = toPx(s.x, s.y);

          // Faint circular arc guide
          ctx.save();
          ctx.setLineDash([4, 5]);
          ctx.strokeStyle = '#D6D3CD';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(pivotX, pivotY, L * ppm, Math.PI * 0.05, Math.PI * 0.95);
          ctx.stroke();
          ctx.restore();

          // Trajectory Trail
          if (showTrail && s.trail.length > 1) {
            for (let i = 1; i < s.trail.length; i++) {
              const p0 = toPx(s.trail[i - 1].x, s.trail[i - 1].y);
              const p1 = toPx(s.trail[i].x, s.trail[i].y);
              ctx.strokeStyle =
                s.trail[i].phase === 'swinging' ? '#A78BFA' : '#F59E0B';
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              ctx.moveTo(p0.px, p0.py);
              ctx.lineTo(p1.px, p1.py);
              ctx.stroke();
            }
          }

          // Cut point marker
          if (s.cutPoint) {
            const cp = toPx(s.cutPoint.x, s.cutPoint.y);
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(cp.px, cp.py, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#B45309';
            ctx.font = '600 10px system-ui, sans-serif';
            ctx.fillText('Cut Point', cp.px + 8, cp.py - 6);
          }

          // String (only when attached)
          if (s.phase === 'swinging') {
            ctx.strokeStyle = '#57534E';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(pivotX, pivotY);
            ctx.lineTo(bobPx.px, bobPx.py);
            ctx.stroke();
          }

          // Pivot stand
          ctx.fillStyle = '#44403C';
          ctx.beginPath();
          ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Vectors
          if (showVectors) {
            const curStats = computeStats();
            // Gravity (always down, capped so it stays inside ground band)
            drawArrow(ctx, bobPx.px, bobPx.py, 0, Math.min(42, mass * g * 2.0), '#E11D48', 'mg');

            // Tension (along string toward pivot)
            if (s.phase === 'swinging') {
              const ux = (pivotX - bobPx.px) / (L * ppm || 1);
              const uy = (pivotY - bobPx.py) / (L * ppm || 1);
              const tLen = Math.min(68, curStats.tension * 2.2);
              drawArrow(ctx, bobPx.px, bobPx.py, ux * tLen, uy * tLen, '#0284C7', 'T');
            }

            // Velocity vector (hidden once landed; capped so it never clips viewport)
            if (s.phase !== 'landed') {
              const vScale = 10;
              let vdx = s.vx * vScale;
              let vdy = -s.vy * vScale;
              const vLen = Math.hypot(vdx, vdy);
              const maxVLen = 58;
              if (vLen > maxVLen) {
                vdx = (vdx / vLen) * maxVLen;
                vdy = (vdy / vLen) * maxVLen;
              }
              drawArrow(ctx, bobPx.px, bobPx.py, vdx, vdy, '#7C3AED', 'v');
            }
          }

          // Bob
          const bobRadius = 11 + mass * 1.5;
          ctx.fillStyle = s.phase === 'swinging' ? '#7C3AED' : '#D97706';
          ctx.beginPath();
          ctx.arc(bobPx.px, bobPx.py, bobRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Landing Range Banner
          if (s.phase === 'landed' && s.cutPoint && s.landingX !== null) {
            const cp = toPx(s.cutPoint.x, 0);
            const lp = toPx(s.landingX, 0);
            ctx.strokeStyle = '#059669';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cp.px, groundY - 8);
            ctx.lineTo(lp.px, groundY - 8);
            ctx.stroke();
            ctx.fillStyle = '#047857';
            ctx.font = '600 11px system-ui, sans-serif';
            ctx.fillText(
              `Range Δx = ${Math.abs(s.landingX - s.cutPoint.x).toFixed(2)} m`,
              (cp.px + lp.px) / 2 - 40,
              groundY - 14
            );
          }

          ctx.restore();
        }
      }

      frameCount++;
      if (frameCount % 4 === 0) {
        const nextStats = computeStats();
        setStats(nextStats);
        onStatsUpdate?.(nextStats);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [dimension, stepPhysics, computeStats, L, mass, g, showVectors, showTrail, onStatsUpdate]);

  // 3D Three.js Render Loop
  useEffect(() => {
    if (dimension !== '3d' || !mount3dRef.current) return;
    const container = mount3dRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF9F6');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.set(1.5, 4.2, 13.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.5, 3.0, 0);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(32, 32, 0xd6d3cd, 0xedeae4);
    scene.add(grid);

    // Pivot stand (subtle post + crossbar behind z = -0.35)
    const standMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e });
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, PIVOT_Y + 0.2, 12), standMat);
    post.position.set(0, (PIVOT_Y + 0.2) / 2, -0.4);
    scene.add(post);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), standMat);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, PIVOT_Y, -0.2);
    scene.add(arm);

    // Pivot sphere
    const pivotMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x44403c })
    );
    pivotMesh.position.set(0, PIVOT_Y, 0);
    pivotMesh.userData = { hotspotId: 'tension' };
    scene.add(pivotMesh);

    // Bob sphere
    const bobMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22 + mass * 0.03, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 })
    );
    bobMesh.userData = { hotspotId: 'bob' };
    scene.add(bobMesh);

    // Cut point marker
    const cutMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    cutMarker.visible = false;
    scene.add(cutMarker);

    // 3D Force & Velocity Arrows
    const gravityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, PIVOT_Y - L, 0),
      1.2,
      0xe11d48,
      0.28,
      0.16
    );
    const tensionArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, PIVOT_Y - L, 0),
      1.2,
      0x0284c7,
      0.28,
      0.16
    );
    const velocityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, PIVOT_Y - L, 0),
      1.0,
      0x7c3aed,
      0.28,
      0.16
    );
    scene.add(gravityArrow, tensionArrow, velocityArrow);

    // String cylinder/line
    const stringGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, PIVOT_Y, 0),
      new THREE.Vector3(0, PIVOT_Y - L, 0),
    ]);
    const stringLine = new THREE.Line(
      stringGeom,
      new THREE.LineBasicMaterial({ color: 0x57534e })
    );
    scene.add(stringLine);

    // Trail line
    const trailGeom = new THREE.BufferGeometry();
    const trailLine = new THREE.Line(
      trailGeom,
      new THREE.LineBasicMaterial({ color: 0xd97706 })
    );
    scene.add(trailLine);

    // Click raycasting
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([bobMesh, pivotMesh]);
      if (hits.length > 0 && hits[0].object.userData?.hotspotId) {
        onSelectHotspot(hits[0].object.userData.hotspotId);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    let animId = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      stepPhysics(dt);

      const s = simRef.current;
      bobMesh.position.set(s.x, s.y, 0);
      (bobMesh.material as THREE.MeshStandardMaterial).color.setHex(
        s.phase === 'swinging' ? 0x7c3aed : 0xd97706
      );

      stringLine.visible = s.phase === 'swinging';
      if (s.phase === 'swinging') {
        const pos = stringGeom.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, 0, PIVOT_Y, 0);
        pos.setXYZ(1, s.x, s.y, 0);
        pos.needsUpdate = true;
      }

      if (showTrail && s.trail.length > 1) {
        trailLine.visible = true;
        trailGeom.setFromPoints(
          s.trail.map((p) => new THREE.Vector3(p.x, p.y, 0))
        );
      } else {
        trailLine.visible = false;
      }

      if (s.cutPoint) {
        cutMarker.visible = true;
        cutMarker.position.set(s.cutPoint.x, s.cutPoint.y, 0);
      } else {
        cutMarker.visible = false;
      }

      // Update 3D Force & Velocity Vectors
      const bobPos = bobMesh.position;
      const curStats = computeStats();

      gravityArrow.visible = showVectors;
      if (showVectors) {
        gravityArrow.position.copy(bobPos);
        const gLen = Math.min(2.2, Math.max(0.6, mass * g * 0.08));
        gravityArrow.setLength(gLen, 0.25, 0.14);
      }

      tensionArrow.visible = showVectors && s.phase === 'swinging';
      if (tensionArrow.visible) {
        tensionArrow.position.copy(bobPos);
        const tDir = new THREE.Vector3(-s.x, PIVOT_Y - s.y, 0).normalize();
        tensionArrow.setDirection(tDir);
        const tLen = Math.min(2.6, Math.max(0.5, curStats.tension * 0.07));
        tensionArrow.setLength(tLen, 0.25, 0.14);
      }

      const vMag = Math.hypot(s.vx, s.vy);
      velocityArrow.visible = showVectors && s.phase !== 'landed' && vMag > 0.15;
      if (velocityArrow.visible) {
        velocityArrow.position.copy(bobPos);
        velocityArrow.setDirection(new THREE.Vector3(s.vx, s.vy, 0).normalize());
        const vLen = Math.min(2.8, Math.max(0.45, vMag * 0.35));
        velocityArrow.setLength(vLen, 0.25, 0.14);
      }

      // Gently keep projectile in 3D view if it travels far horizontally
      if (s.phase === 'projectile') {
        const desiredTargetX = s.x * 0.5;
        controls.target.x += (desiredTargetX - controls.target.x) * 0.08;
      }

      controls.update();
      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 4 === 0) {
        const nextStats = computeStats();
        setStats(nextStats);
        onStatsUpdate?.(nextStats);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
    };
  }, [dimension, L, mass, g, showTrail, showVectors, stepPhysics, computeStats, onSelectHotspot, onStatsUpdate]);

  // 2D Canvas Click & Drag
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const { ppm, groundY, pivotX, pivotY } = viewTransformRef.current;

    const s = simRef.current;
    const bx = pivotX + s.x * ppm;
    const by = groundY - s.y * ppm;

    if (Math.hypot(cx - bx, cy - by) < 28) {
      onSelectHotspot('bob');
      if (s.phase === 'swinging') {
        draggingRef.current = true;
      }
      return;
    }
    if (Math.hypot(cx - pivotX, cy - pivotY) < 20) {
      onSelectHotspot('tension');
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || !canvas2dRef.current) return;
    const rect = canvas2dRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const { pivotX, pivotY } = viewTransformRef.current;

    const dx = cx - pivotX;
    const dy = cy - pivotY;
    const theta = Math.max(-Math.PI * 0.48, Math.min(Math.PI * 0.48, Math.atan2(dx, dy)));
    const s = simRef.current;
    s.theta = theta;
    s.omega = 0;
    s.vx = 0;
    s.vy = 0;
    s.x = L * Math.sin(theta);
    s.y = PIVOT_Y - L * Math.cos(theta);
    s.trail = [];
  };

  const handleCanvasPointerUp = () => {
    draggingRef.current = false;
  };

  const totalE = Math.max(0.001, stats.ke + stats.pe);
  const kePct = Math.round((stats.ke / totalE) * 100);
  const pePct = 100 - kePct;

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden relative">
      {/* Top Floating Energy & Phase Bar */}
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              stats.phase === 'swinging'
                ? 'bg-violet-50 text-violet-800 border-violet-200'
                : stats.phase === 'projectile'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {stats.phase === 'swinging'
              ? '1. Circular Pendulum Swing'
              : stats.phase === 'projectile'
              ? '2. Free-Fall Projectile!'
              : '3. Landed'}
          </span>
          <span className="text-xs text-stone-500 tabular-nums">
            v = <strong className="text-stone-800">{stats.speed.toFixed(2)} m/s</strong>
            {' • '}T = <strong className="text-sky-700">{stats.tension.toFixed(1)} N</strong>
          </span>
        </div>

        {/* Clickable Energy Bar */}
        <button
          onClick={() => onSelectHotspot('energy')}
          className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:border-violet-300 transition cursor-pointer"
          title="Click to inspect Energy Conservation"
        >
          <span className="text-[10px] font-semibold text-violet-700">
            KE {kePct}%
          </span>
          <div className="w-28 h-2 rounded-full bg-stone-100 overflow-hidden flex">
            <div
              className="bg-violet-500 transition-all duration-75"
              style={{ width: `${kePct}%` }}
            />
            <div
              className="bg-emerald-400 transition-all duration-75"
              style={{ width: `${pePct}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-emerald-700">
            PE {pePct}%
          </span>
        </button>
      </div>

      {/* Canvas / 3D Viewport */}
      <div className="flex-1 relative min-h-0">
        {dimension === '2d' ? (
          <canvas
            ref={canvas2dRef}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerUp}
            className="w-full h-full block cursor-grab active:cursor-grabbing"
          />
        ) : (
          <div ref={mount3dRef} className="w-full h-full" />
        )}
      </div>

      {/* Dedicated Bottom Playback Bar (never overlaps ground or bob) */}
      <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-center gap-2 shrink-0">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition"
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() =>
            setTimeScale((t) => (t === 1 ? 0.35 : t === 0.35 ? 0.15 : 1))
          }
          className="px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-[11px] font-medium text-stone-700 tabular-nums transition"
          title="Toggle slow motion"
        >
          {timeScale}x
        </button>

        <button
          onClick={resetSim}
          className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition"
          title="Reset Pendulum"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-stone-200 mx-1" />

        <button
          onClick={cutString}
          disabled={stats.phase !== 'swinging'}
          className="px-4 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 disabled:opacity-40 text-amber-950 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-700" />
          Cut String
        </button>
      </div>
    </div>
  );
}
