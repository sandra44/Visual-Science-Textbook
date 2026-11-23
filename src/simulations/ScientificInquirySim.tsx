import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface ScientificInquirySimProps {
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function ScientificInquirySim({
  controlValues,
  onSelectHotspot,
}: ScientificInquirySimProps) {
  const dropHeight = Number(controlValues.dropHeight ?? 4);
  const rampAngle = Number(controlValues.rampAngle ?? 30);

  const [trialRunning, setTrialRunning] = useState(false);
  const [trials, setTrials] = useState<{ angle: number; dist: number }[]>([
    { angle: 15, dist: 2.1 },
    { angle: 30, dist: 4.0 },
    { angle: 45, dist: 4.9 },
  ]);
  const progressRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const runTrial = () => {
    progressRef.current = 0;
    setTrialRunning(true);
    const predictedDist = Number(
      (dropHeight * Math.sin((2 * rampAngle * Math.PI) / 180) * 1.25).toFixed(2)
    );
    setTrials((prev) => [...prev.slice(-6), { angle: rampAngle, dist: predictedDist }]);
  };

  useEffect(() => {
    let animId = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (trialRunning) {
        progressRef.current = Math.min(1, progressRef.current + dt * 0.7);
        if (progressRef.current >= 1) setTrialRunning(false);
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

          // Left: Experiment Apparatus (Marble on Ramp)
          const groundY = H - 56;
          const rampLeft = 36;
          const rampBase = Math.min(W * 0.42, 240);
          const rad = (rampAngle * Math.PI) / 180;
          const rampH = Math.min(140, (dropHeight / 6) * 130);
          const rampEndX = rampLeft + rampBase * Math.cos(rad * 0.4);

          ctx.fillStyle = '#44403C';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.fillText('1. Physical Model (Ramp & Marble)', 28, 32);
          ctx.fillStyle = '#78716C';
          ctx.font = '11px system-ui, sans-serif';
          ctx.fillText(`Controlled: Height = ${dropHeight}m  |  Tested: Angle = ${rampAngle}°`, 28, 48);

          ctx.fillStyle = '#E7E5DF';
          ctx.fillRect(20, groundY, W * 0.48, 8);

          ctx.fillStyle = '#EDE9FE';
          ctx.strokeStyle = '#7C3AED';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(rampLeft, groundY);
          ctx.lineTo(rampLeft, groundY - rampH);
          ctx.lineTo(rampEndX, groundY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Angle & Height labels on ramp
          ctx.fillStyle = '#5B21B6';
          ctx.font = '600 10px system-ui, sans-serif';
          ctx.fillText(`h=${dropHeight}m`, rampLeft + 6, groundY - rampH / 2);
          ctx.fillText(`θ=${rampAngle}°`, rampEndX - 42, groundY - 8);

          // Marble
          const p = progressRef.current;
          const mx =
            p < 0.5
              ? rampLeft + (rampEndX - rampLeft) * (p * 2)
              : rampEndX + (p - 0.5) * 180;
          const my =
            p < 0.5
              ? groundY - rampH * (1 - p * 2) - 8
              : groundY - 8;

          ctx.fillStyle = '#D97706';
          ctx.beginPath();
          ctx.arc(mx, my, 9, 0, Math.PI * 2);
          ctx.fill();

          // Right: Live Data Scatter Plot (Angle vs Distance) with full axes & ticks
          const gx = W * 0.56;
          const gy = 62;
          const gw = W - gx - 28;
          const gh = groundY - gy;
          ctx.fillStyle = '#FAF9F6';
          ctx.fillRect(gx, gy, gw, gh);
          ctx.strokeStyle = '#D6D3CD';
          ctx.strokeRect(gx, gy, gw, gh);

          ctx.fillStyle = '#44403C';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.fillText('2. How Ramp Angle Affects Roll Distance', gx, 32);
          ctx.fillStyle = '#78716C';
          ctx.font = '11px system-ui, sans-serif';
          ctx.fillText('Each dot = 1 trial (click "Run Experiment Trial" to add)', gx, 48);

          // Grid & Y-axis ticks (Roll Distance 0..8m)
          ctx.font = '10px system-ui, sans-serif';
          for (let d = 0; d <= 8; d += 2) {
            const py = gy + gh - (d / 8) * gh;
            ctx.strokeStyle = '#EDEAE4';
            ctx.beginPath();
            ctx.moveTo(gx, py);
            ctx.lineTo(gx + gw, py);
            ctx.stroke();
            ctx.fillStyle = '#78716C';
            ctx.fillText(`${d}m`, gx - 22, py + 3);
          }

          // Grid & X-axis ticks (Ramp Angle 0..70°)
          for (let ang = 0; ang <= 70; ang += 15) {
            const px = gx + (ang / 70) * gw;
            ctx.strokeStyle = '#EDEAE4';
            ctx.beginPath();
            ctx.moveTo(px, gy);
            ctx.lineTo(px, gy + gh);
            ctx.stroke();
            ctx.fillStyle = '#78716C';
            ctx.fillText(`${ang}°`, px - 8, gy + gh + 14);
          }

          // Axis Titles
          ctx.fillStyle = '#57534E';
          ctx.font = '600 10px system-ui, sans-serif';
          ctx.fillText('Independent Variable: Ramp Angle (θ)', gx + gw * 0.25, gy + gh + 32);

          ctx.save();
          ctx.translate(gx - 32, gy + gh * 0.72);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText('Roll Distance (m)', 0, 0);
          ctx.restore();

          // Plot points with value labels
          trials.forEach((tr, idx) => {
            const px = gx + (tr.angle / 70) * gw;
            const py = gy + gh - Math.min(1, tr.dist / 8) * gh;
            const isLatest = idx === trials.length - 1;
            ctx.fillStyle = isLatest ? '#7C3AED' : '#0284C7';
            ctx.beginPath();
            ctx.arc(px, py, isLatest ? 6 : 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isLatest ? '#5B21B6' : '#0369A1';
            ctx.font = '600 9.5px system-ui, sans-serif';
            ctx.fillText(`(${tr.angle}°, ${tr.dist}m)`, px + 7, py - 4);
          });

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [trialRunning, dropHeight, rampAngle, trials]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <span>
          Inquiry Model: Height = <strong>{dropHeight} m</strong> • Angle ={' '}
          <strong>{rampAngle}°</strong> • Trials: <strong>{trials.length}</strong>
        </span>
        <button
          onClick={() => onSelectHotspot('variables')}
          className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-medium hover:bg-violet-100 transition"
        >
          Inspect Variables
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('model')}
          className="w-full h-full block cursor-pointer"
        />
      </div>

      <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-center gap-2">
        <button
          onClick={runTrial}
          className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Play className="w-3.5 h-3.5" />
          Run Experiment Trial
        </button>
        <button
          onClick={() => setTrials([])}
          className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition"
          title="Clear Trials"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
