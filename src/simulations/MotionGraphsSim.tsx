import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface MotionGraphsSimProps {
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function MotionGraphsSim({
  controlValues,
  onSelectHotspot,
}: MotionGraphsSimProps) {
  const u = Number(controlValues.velocity ?? 5);
  const a = Number(controlValues.accel ?? 1.5);

  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const reset = () => {
    tRef.current = 0;
    setT(0);
    setPlaying(true);
  };

  useEffect(() => {
    reset();
  }, [u, a]);

  useEffect(() => {
    let animId = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (playing) {
        tRef.current = Math.min(8, tRef.current + dt);
        setT(tRef.current);
        if (tRef.current >= 8) setPlaying(false);
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

          const curT = tRef.current;
          const x = u * curT + 0.5 * a * curT * curT;
          const v = u + a * curT;

          // 1. Top Motion Track
          const trackY = 54;
          const trackLeft = 40;
          const trackRight = W - 40;
          ctx.fillStyle = '#57534E';
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText('1D Motion Track (Position x vs. Time t)', trackLeft, 24);
          ctx.fillStyle = '#F5F5F4';
          ctx.fillRect(trackLeft, trackY - 12, trackRight - trackLeft, 24);
          ctx.strokeStyle = '#D6D3D1';
          ctx.strokeRect(trackLeft, trackY - 12, trackRight - trackLeft, 24);
          ctx.fillStyle = '#78716C';
          ctx.font = '10px system-ui, sans-serif';
          ctx.fillText('Start (0m)', trackLeft, trackY + 26);
          ctx.fillText(`x = ${x.toFixed(1)} m`, trackRight - 55, trackY + 26);

          const maxRange = Math.max(80, Math.abs(u * 8 + 0.5 * a * 64) + 10);
          const carX = trackLeft + Math.max(0, Math.min(1, (x + 20) / (maxRange + 40))) * (trackRight - trackLeft);

          // Car
          ctx.fillStyle = '#7C3AED';
          ctx.beginPath();
          ctx.roundRect(carX - 16, trackY - 10, 32, 20, 6);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '600 10px system-ui, sans-serif';
          ctx.fillText(`${v.toFixed(1)}m/s`, carX - 15, trackY - 16);

          // 2. Two Side-by-Side Graphs: x-t and v-t
          const graphTop = 105;
          const graphH = H - graphTop - 38;
          const gap = 36;
          const graphW = (W - 80 - gap) / 2;

          const drawGraph = (
            gx: number,
            title: string,
            yLabel: string,
            color: string,
            fn: (tt: number) => number,
            minY: number,
            maxY: number
          ) => {
            ctx.fillStyle = '#FAF9F6';
            ctx.fillRect(gx, graphTop, graphW, graphH);
            ctx.strokeStyle = '#E7E5E4';
            ctx.strokeRect(gx, graphTop, graphW, graphH);

            ctx.fillStyle = '#44403C';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText(title, gx + 8, graphTop - 8);

            const mapX = (tt: number) => gx + (tt / 8) * graphW;
            const mapY = (val: number) =>
              graphTop + graphH - ((val - minY) / (maxY - minY || 1)) * graphH;

            // Zero line
            if (minY < 0 && maxY > 0) {
              ctx.strokeStyle = '#D6D3D1';
              ctx.beginPath();
              ctx.moveTo(gx, mapY(0));
              ctx.lineTo(gx + graphW, mapY(0));
              ctx.stroke();
            }

            // Curve up to curT
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let i = 0; i <= 80; i++) {
              const tt = (i / 80) * curT;
              const px = mapX(tt);
              const py = Math.max(graphTop, Math.min(graphTop + graphH, mapY(fn(tt))));
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Current dot
            const dotX = mapX(curT);
            const dotY = Math.max(graphTop, Math.min(graphTop + graphH, mapY(fn(curT))));
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#78716C';
            ctx.font = '10px system-ui, sans-serif';
            ctx.fillText('0s', gx, graphTop + graphH + 14);
            ctx.fillText('Time (s) →', gx + graphW / 2 - 24, graphTop + graphH + 14);
            ctx.fillText('8s', gx + graphW - 12, graphTop + graphH + 14);
            ctx.fillStyle = color;
            ctx.font = '600 11px system-ui, sans-serif';
            ctx.fillText(yLabel, gx + 8, graphTop + 16);
          };

          drawGraph(
            40,
            'Position-Time (x-t)',
            `x = ${x.toFixed(1)} m`,
            '#7C3AED',
            (tt) => u * tt + 0.5 * a * tt * tt,
            -40,
            240
          );
          drawGraph(
            40 + graphW + gap,
            'Velocity-Time (v-t)',
            `v = ${v.toFixed(1)} m/s`,
            '#0284C7',
            (tt) => u + a * tt,
            -20,
            60
          );

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playing, u, a]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs text-stone-600">
        <span>
          t = <strong className="text-stone-900 tabular-nums">{t.toFixed(2)} s</strong> •
          u = <strong>{u} m/s</strong> • a = <strong>{a} m/s²</strong>
        </span>
        <button
          onClick={() => onSelectHotspot('slope')}
          className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-medium hover:bg-violet-100 transition"
        >
          Inspect Graph Slope
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('slope')}
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
