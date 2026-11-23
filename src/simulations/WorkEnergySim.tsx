import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface WorkEnergySimProps {
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function WorkEnergySim({
  controlValues,
  onSelectHotspot,
}: WorkEnergySimProps) {
  const angleDeg = Number(controlValues.incline ?? 25);
  const mass = 5; // kg
  const g = 9.8;
  const heightM = 3.0; // m vertical lift target
  const theta = (angleDeg * Math.PI) / 180;
  const rampLenM = heightM / Math.sin(theta);
  const effortForce = mass * g * Math.sin(theta);
  const mechAdv = 1 / Math.sin(theta);
  const workTotal = mass * g * heightM;

  const [playing, setPlaying] = useState(true);
  const progressRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const reset = () => {
    progressRef.current = 0;
    setPlaying(true);
  };

  useEffect(() => {
    reset();
  }, [angleDeg]);

  useEffect(() => {
    let animId = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (playing) {
        progressRef.current = (progressRef.current + dt * 0.25) % 1;
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

          const groundY = H - 54;
          const baseW = Math.min(W * 0.65, Math.max(140, (H * 0.55) / Math.tan(theta)));
          const rampH = Math.min(H * 0.55, baseW * Math.tan(theta));
          const xRight = W * 0.78;
          const xLeft = xRight - baseW;

          // Ground
          ctx.fillStyle = '#E7E5DF';
          ctx.fillRect(0, groundY, W, H - groundY);

          // Ramp triangle
          ctx.fillStyle = '#EDE9FE';
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xLeft, groundY);
          ctx.lineTo(xRight, groundY);
          ctx.lineTo(xRight, groundY - rampH);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Angle & ramp labels
          ctx.fillStyle = '#5B21B6';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.fillText(`θ = ${angleDeg}°`, xLeft + 22, groundY - 10);
          ctx.fillText(`Height h = ${heightM.toFixed(1)} m`, xRight + 10, groundY - rampH / 2);
          ctx.fillStyle = '#44403C';
          ctx.fillText(`Ramp Distance d = ${rampLenM.toFixed(2)} m (Effort × d = Weight × h)`, xLeft, 30);

          // Block sliding up the ramp
          const p = progressRef.current;
          const bx = xLeft + (xRight - xLeft) * p;
          const by = groundY - rampH * p;

          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(-theta);
          ctx.fillStyle = '#F59E0B';
          ctx.strokeStyle = '#B45309';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-18, -32, 36, 28, 5);
          ctx.fill();
          ctx.stroke();

          // Effort arrow along ramp
          ctx.strokeStyle = '#059669';
          ctx.fillStyle = '#059669';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(18, -18);
          ctx.lineTo(58, -18);
          ctx.stroke();
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText(`Effort ${effortForce.toFixed(1)}N`, 20, -26);
          ctx.restore();

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playing, angleDeg, theta, effortForce]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <span>
          Effort = <strong className="text-emerald-700">{effortForce.toFixed(1)} N</strong> •
          Ramp Length = <strong>{rampLenM.toFixed(2)} m</strong> •
          MA = <strong className="text-violet-700">{mechAdv.toFixed(2)}x</strong> •
          Work = <strong>{workTotal.toFixed(0)} J</strong>
        </span>
        <button
          onClick={() => onSelectHotspot('ramp')}
          className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-medium hover:bg-violet-100 transition"
        >
          Inspect Inclined Plane
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('ramp')}
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
