import { useEffect, useRef, useState } from 'react';

type ChemMode = 'distillation' | 'chromatography' | 'tyndall' | 'solubility';

interface MixturesLabSimProps {
  controlValues: Record<string, number | boolean | string>;
  topicHint?: string;
  onSelectHotspot: (id: string) => void;
}

export function MixturesLabSim({
  controlValues,
  topicHint,
  onSelectHotspot,
}: MixturesLabSimProps) {
  const [mode, setMode] = useState<ChemMode>('distillation');
  const temp = Number(controlValues.temperature ?? 78);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!topicHint) return;
    const h = topicHint.toLowerCase();
    if (h.includes('chromato')) setMode('chromatography');
    else if (h.includes('tyndall') || h.includes('colloid') || h.includes('suspension')) setMode('tyndall');
    else if (h.includes('solub') || h.includes('concentrat')) setMode('solubility');
    else setMode('distillation');
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

          if (mode === 'distillation') {
            // Left boiling flask
            ctx.fillStyle = '#E0F2FE';
            ctx.strokeStyle = '#57534E';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx - 120, cy + 30, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Condenser tube
            ctx.strokeStyle = '#0284C7';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(cx - 80, cy - 25);
            ctx.lineTo(cx + 80, cy + 25);
            ctx.stroke();

            // Vapor bubbles if temp >= 70
            if (temp >= 70) {
              for (let i = 0; i < 6; i++) {
                const p = ((t * 0.6 + i * 0.16) % 1);
                const bx = cx - 80 + p * 160;
                const by = cy - 25 + p * 50;
                ctx.fillStyle = '#38BDF8';
                ctx.beginPath();
                ctx.arc(bx, by, 4, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Right collection beaker
            ctx.fillStyle = '#BAE6FD';
            ctx.strokeStyle = '#57534E';
            ctx.lineWidth = 2.5;
            ctx.fillRect(cx + 95, cy + 35, 64, 65);
            ctx.strokeRect(cx + 95, cy + 20, 64, 80);

            ctx.fillStyle = '#292524';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText(`Boiling Flask (${temp}°C)`, cx - 175, cy + 100);
            ctx.fillText('Condenser', cx - 30, cy - 20);
            ctx.fillText('Pure Distillate', cx + 88, cy + 120);
          } else if (mode === 'chromatography') {
            // Paper strip
            ctx.fillStyle = '#FAF9F6';
            ctx.strokeStyle = '#A8A29E';
            ctx.lineWidth = 2;
            ctx.fillRect(cx - 45, cy - 120, 90, 230);
            ctx.strokeRect(cx - 45, cy - 120, 90, 230);

            // Solvent front
            const frontY = cy + 90 - Math.min(180, t * 25);
            ctx.strokeStyle = '#38BDF8';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(cx - 45, frontY);
            ctx.lineTo(cx + 45, frontY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Separated dye bands
            const bands = [
              { col: '#F59E0B', rf: 0.3, label: 'Yellow (Rf 0.3)' },
              { col: '#E11D48', rf: 0.6, label: 'Red (Rf 0.6)' },
              { col: '#0284C7', rf: 0.85, label: 'Blue (Rf 0.85)' },
            ];
            bands.forEach((b) => {
              const travel = (cy + 90 - frontY) * b.rf;
              const by = cy + 90 - travel;
              ctx.fillStyle = b.col;
              ctx.beginPath();
              ctx.ellipse(cx, by, 14, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#44403C';
              ctx.font = '600 11px system-ui, sans-serif';
              ctx.fillText(b.label, cx + 60, by + 4);
            });
          } else if (mode === 'tyndall') {
            // 3 beakers: Solution, Colloid, Suspension
            const jars = [
              { x: cx - 150, label: 'True Solution', scatter: false },
              { x: cx, label: 'Colloid (Milk+Water)', scatter: true },
              { x: cx + 150, label: 'Suspension (Chalk)', scatter: true },
            ];
            jars.forEach((j) => {
              ctx.fillStyle = '#F0F9FF';
              ctx.strokeStyle = '#78716C';
              ctx.lineWidth = 2;
              ctx.fillRect(j.x - 45, cy - 55, 90, 110);
              ctx.strokeRect(j.x - 45, cy - 55, 90, 110);

              if (j.scatter) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
                ctx.fillRect(j.x - 45, cy - 10, 90, 20);
              }
              ctx.fillStyle = '#44403C';
              ctx.font = '600 11px system-ui, sans-serif';
              ctx.fillText(j.label, j.x - 48, cy + 75);
            });

            // Laser beam
            ctx.strokeStyle = '#E11D48';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - 230, cy);
            ctx.lineTo(cx + 220, cy);
            ctx.stroke();
          } else {
            // Solubility vs Temperature curve
            const gx = cx - 150;
            const gy = cy - 90;
            ctx.strokeStyle = '#A8A29E';
            ctx.strokeRect(gx, gy, 300, 180);

            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(gx, gy + 150);
            ctx.quadraticCurveTo(gx + 160, gy + 120, gx + 290, gy + 20);
            ctx.stroke();

            const tx = gx + (temp / 100) * 290;
            const ty = gy + 150 - Math.pow(temp / 100, 1.4) * 130;
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.arc(tx, ty, 6, 0, Math.PI * 2);
            ctx.fill();

            // Axis & Title
            ctx.fillStyle = '#44403C';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText(`Solubility Curve: Dissolved Solute vs. Temperature (${temp}°C)`, gx + 8, gy - 12);
            ctx.fillStyle = '#78716C';
            ctx.font = '10px system-ui, sans-serif';
            ctx.fillText('0°C', gx, gy + 194);
            ctx.fillText('Temperature (°C) →', gx + 105, gy + 194);
            ctx.fillText('100°C', gx + 272, gy + 194);
            ctx.fillText('High', gx - 28, gy + 14);
            ctx.fillText('Low', gx - 24, gy + 178);
          }

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, temp]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'distillation', label: 'Distillation' },
              { id: 'chromatography', label: 'Chromatography' },
              { id: 'tyndall', label: 'Tyndall Effect' },
              { id: 'solubility', label: 'Solubility Curve' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-full transition ${
                mode === m.id
                  ? 'bg-amber-100 text-amber-950 font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="text-stone-500">
          Temp: <strong className="text-stone-900">{temp}°C</strong>
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('separation')}
          className="w-full h-full block cursor-pointer"
        />
      </div>
    </div>
  );
}
