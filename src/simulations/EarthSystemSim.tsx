import { useEffect, useRef, useState } from 'react';

type EarthMode = 'spheres' | 'winds' | 'cycles';

interface EarthSystemSimProps {
  controlValues: Record<string, number | boolean | string>;
  topicHint?: string;
  onSelectHotspot: (id: string) => void;
}

export function EarthSystemSim({
  controlValues,
  topicHint,
  onSelectHotspot,
}: EarthSystemSimProps) {
  const [mode, setMode] = useState<EarthMode>('spheres');
  const warming = Number(controlValues.warming ?? 1.5);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!topicHint) return;
    const h = topicHint.toLowerCase();
    if (h.includes('13.1') || h.includes('13.2') || h.includes('wind') || h.includes('heat')) setMode('winds');
    else if (h.includes('13.3') || h.includes('13.4') || h.includes('cycle')) setMode('cycles');
    else setMode('spheres');
  }, [topicHint]);

  useEffect(() => {
    let animId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
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
          const cx = W / 2;
          const cy = H / 2;

          if (mode === 'spheres') {
            // Sky / Atmosphere
            ctx.fillStyle = '#E0F2FE';
            ctx.fillRect(0, 0, W, H * 0.65);

            // Sun
            ctx.fillStyle = '#FACC15';
            ctx.beginPath();
            ctx.arc(70, 62, 24 + warming * 3, 0, Math.PI * 2);
            ctx.fill();

            // Mountain (Geosphere) + Glacier (Cryosphere, shrinks with warming)
            ctx.fillStyle = '#D6D3D1';
            ctx.beginPath();
            ctx.moveTo(40, H * 0.65);
            ctx.lineTo(180, H * 0.22);
            ctx.lineTo(310, H * 0.65);
            ctx.closePath();
            ctx.fill();

            const iceScale = Math.max(0.25, 1 - warming * 0.18);
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(180, H * 0.22);
            ctx.lineTo(180 - 55 * iceScale, H * (0.22 + 0.18 * iceScale));
            ctx.lineTo(180 + 55 * iceScale, H * (0.22 + 0.18 * iceScale));
            ctx.closePath();
            ctx.fill();

            // Ocean / Lake (Hydrosphere, rises as glacier melts)
            const seaRise = warming * 6;
            ctx.fillStyle = '#38BDF8';
            ctx.fillRect(0, H * 0.65 - seaRise, W, H * 0.35 + seaRise);

            // Biosphere (Trees)
            [350, 395, 440].forEach((tx) => {
              ctx.fillStyle = '#22C55E';
              ctx.beginPath();
              ctx.arc(tx, H * 0.58, 16, 0, Math.PI * 2);
              ctx.fill();
            });

            ctx.fillStyle = '#292524';
            ctx.font = '600 11px system-ui, sans-serif';
            ctx.fillText('Cryosphere (Glaciers)', 125, H * 0.19);
            ctx.fillText('Atmosphere', W - 110, 42);
            ctx.fillText('Biosphere', 365, H * 0.5);
            ctx.fillText(`Hydrosphere (+${(warming * 0.4).toFixed(1)}m sea level)`, 24, H - 24);
          } else if (mode === 'winds') {
            // Sea Breeze / Convection
            ctx.fillStyle = '#FEF3C7';
            ctx.fillRect(cx, H * 0.68, W / 2, H * 0.32);
            ctx.fillStyle = '#BAE6FD';
            ctx.fillRect(0, H * 0.68, cx, H * 0.32);

            // Animated convection loop
            for (let i = 0; i < 8; i++) {
              const p = ((t * 0.35 + i * 0.125) % 1);
              const ang = p * Math.PI * 2;
              const wx = cx + Math.cos(ang) * 140;
              const wy = cy + Math.sin(ang) * 70;
              ctx.fillStyle = Math.sin(ang) < 0 ? '#E11D48' : '#0284C7';
              ctx.beginPath();
              ctx.arc(wx, wy, 5, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = '#292524';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText('Cool Sea Air →', 60, H * 0.63);
            ctx.fillText('Warm Land Air Rises ↑', cx + 40, H * 0.63);
          } else {
            // Biogeochemical Cycle Loop (Water / Carbon / Nitrogen / Oxygen)
            const nodes = [
              { x: cx, y: cy - 95, label: 'Atmosphere (CO₂ / H₂O / N₂)' },
              { x: cx + 150, y: cy, label: 'Biosphere (Plants & Animals)' },
              { x: cx, y: cy + 95, label: 'Geosphere & Soil' },
              { x: cx - 150, y: cy, label: 'Hydrosphere (Oceans & Rivers)' },
            ];
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 150, 95, 0, 0, Math.PI * 2);
            ctx.stroke();

            const ang = t * 0.9;
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.arc(cx + 150 * Math.cos(ang), cy + 95 * Math.sin(ang), 7, 0, Math.PI * 2);
            ctx.fill();

            nodes.forEach((n) => {
              ctx.fillStyle = '#F5F5F4';
              ctx.strokeStyle = '#78716C';
              ctx.beginPath();
              ctx.roundRect(n.x - 75, n.y - 16, 150, 32, 12);
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = '#292524';
              ctx.font = '600 10px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(n.label, n.x, n.y + 4);
            });
            ctx.textAlign = 'left';
          }

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, warming]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'spheres', label: 'Earth Spheres' },
              { id: 'winds', label: 'Heating & Winds' },
              { id: 'cycles', label: 'Matter Cycles' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-full transition ${
                mode === m.id
                  ? 'bg-teal-100 text-teal-900 font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="text-stone-500">
          Global Warming: <strong className="text-amber-700">+{warming.toFixed(1)}°C</strong>
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('spheres')}
          className="w-full h-full block cursor-pointer"
        />
      </div>
    </div>
  );
}
