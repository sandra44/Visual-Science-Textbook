import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface ForcesNewtonSimProps {
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function ForcesNewtonSim({
  controlValues,
  onSelectHotspot,
}: ForcesNewtonSimProps) {
  const applied = Number(controlValues.appliedForce ?? 40);
  const mu = Number(controlValues.friction ?? 0.2);
  const mass = 10; // kg
  const g = 9.8;

  const [playing, setPlaying] = useState(true);
  const posRef = useRef({ x: 0, v: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const maxFriction = mu * mass * g;
  const frictionForce = Math.min(applied, maxFriction);
  const netForce = Math.max(0, applied - frictionForce);
  const accel = netForce / mass;

  const reset = () => {
    posRef.current = { x: 0, v: 0 };
    setPlaying(true);
  };

  useEffect(() => {
    let animId = 0;
    let last = performance.now();

    const drawArrow = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      dx: number,
      dy: number,
      color: string,
      label: string
    ) => {
      if (Math.hypot(dx, dy) < 3) return;
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const ang = Math.atan2(dy, dx);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(ang - 0.4), y2 - 9 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(ang + 0.4), y2 - 9 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(label, x2 + (dx >= 0 ? 6 : -54), y2 - 6);
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;

      if (playing) {
        if (accel > 0) {
          posRef.current.v += accel * dt;
          posRef.current.x += posRef.current.v * dt * 28;
        } else {
          posRef.current.v = Math.max(0, posRef.current.v - mu * g * dt);
          posRef.current.x += posRef.current.v * dt * 28;
        }
      }

      const canvas = canvasRef.current;
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

          const groundY = H * 0.66;
          // Ground
          ctx.fillStyle = '#E7E5DF';
          ctx.fillRect(0, groundY, W, H - groundY);
          ctx.strokeStyle = '#C7C3BA';
          ctx.beginPath();
          ctx.moveTo(0, groundY);
          ctx.lineTo(W, groundY);
          ctx.stroke();

          // Wrapping crate position
          const crateW = 84;
          const crateH = 62;
          const cx = ((posRef.current.x % (W + 120)) + (W + 120)) % (W + 120) - 60;
          const cy = groundY - crateH / 2;

          // Crate
          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(cx - crateW / 2, groundY - crateH, crateW, crateH, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#78350F';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.fillText(`${mass} kg`, cx - 16, cy + 4);

          // Force Vectors
          const scale = 1.3;
          drawArrow(ctx, cx + crateW / 2, cy, applied * scale, 0, '#7C3AED', `F_app = ${applied}N`);
          drawArrow(ctx, cx - crateW / 2, cy, -frictionForce * scale, 0, '#E11D48', `f = ${frictionForce.toFixed(1)}N`);
          drawArrow(ctx, cx, groundY - crateH, 0, -55, '#059669', `N = ${(mass * g).toFixed(0)}N`);
          drawArrow(ctx, cx, groundY, 0, 55, '#0284C7', `mg = ${(mass * g).toFixed(0)}N`);

          // Top-left Legend
          ctx.fillStyle = '#57534E';
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText('Free-Body Diagram: Purple = Push (F_app) | Red = Friction (f) | Green = Normal (N) | Blue = Weight (mg)', 20, 26);

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playing, applied, frictionForce, accel, mu]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs text-stone-600">
        <span>
          F_net = <strong className="text-stone-900">{netForce.toFixed(1)} N</strong> •
          a = <strong className="text-violet-700">{accel.toFixed(2)} m/s²</strong>
          {netForce === 0 ? ' (Balanced — Static)' : ' (Unbalanced — Accelerating)'}
        </span>
        <button
          onClick={() => onSelectHotspot('net-force')}
          className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-medium hover:bg-violet-100 transition"
        >
          Inspect Net Force
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('net-force')}
          className="w-full h-full block cursor-pointer"
        />
      </div>

      <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-center gap-2">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={reset}
          className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
