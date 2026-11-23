import { useEffect, useRef, useState } from 'react';

type ReproMode = 'flower' | 'asexual' | 'meiosis' | 'fertilisation';

interface ReproductionSimProps {
  controlValues: Record<string, number | boolean | string>;
  topicHint?: string;
  onSelectHotspot: (id: string) => void;
}

export function ReproductionSim({
  controlValues,
  topicHint,
  onSelectHotspot,
}: ReproductionSimProps) {
  const [mode, setMode] = useState<ReproMode>('flower');
  const stage = Number(controlValues.reproStage ?? 50);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!topicHint) return;
    const h = topicHint.toLowerCase();
    if (h.includes('11.1') || h.includes('asexual') || h.includes('vegetative')) setMode('asexual');
    else if (h.includes('meiosis') || h.includes('11.2.1') || h.includes('11.5.4')) setMode('meiosis');
    else if (h.includes('11.5') || h.includes('human') || h.includes('sperm') || h.includes('pregnancy')) setMode('fertilisation');
    else setMode('flower');
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

          if (mode === 'flower') {
            // Petals
            ctx.fillStyle = '#FCE7F3';
            ctx.strokeStyle = '#EC4899';
            ctx.lineWidth = 2;
            [-70, 70].forEach((dx) => {
              ctx.beginPath();
              ctx.ellipse(cx + dx, cy - 10, 48, 72, dx > 0 ? 0.35 : -0.35, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            });

            // Pistil (Stigma -> Style -> Ovary)
            ctx.fillStyle = '#DCFCE7';
            ctx.strokeStyle = '#16A34A';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 55, 36, 42, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillRect(cx - 10, cy - 75, 20, 100);
            ctx.strokeRect(cx - 10, cy - 75, 20, 100);

            // Stamen (Anthers)
            [-45, 45].forEach((sx) => {
              ctx.strokeStyle = '#CA8A04';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(cx + sx * 0.4, cy + 30);
              ctx.lineTo(cx + sx, cy - 55);
              ctx.stroke();
              ctx.fillStyle = '#FACC15';
              ctx.beginPath();
              ctx.ellipse(cx + sx, cy - 58, 12, 7, 0, 0, Math.PI * 2);
              ctx.fill();
            });

            // Animated Pollen Tube growing down style based on stage slider
            const tubeLen = (stage / 100) * 125;
            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 75);
            ctx.lineTo(cx, cy - 75 + tubeLen);
            ctx.stroke();

            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(cx, cy - 75, 6, 0, Math.PI * 2);
            ctx.fill();

            // Ovule inside ovary
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#059669';
            ctx.beginPath();
            ctx.arc(cx, cy + 55, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#292524';
            ctx.font = '600 11px system-ui, sans-serif';
            ctx.fillText('Stigma + Pollen', cx + 18, cy - 75);
            ctx.fillText('Anther (Pollen)', cx + 62, cy - 55);
            ctx.fillText('Ovary & Ovule', cx + 44, cy + 58);
          } else if (mode === 'asexual') {
            // Binary fission / Budding animation
            const phase = (Math.sin(t * 1.4) + 1) / 2;
            const sep = phase * 65;
            ctx.fillStyle = '#DDD6FE';
            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(cx - sep, cy, 45, 36, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(cx + sep, cy, 45 * (0.5 + 0.5 * phase), 36 * (0.5 + 0.5 * phase), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#44403C';
            ctx.font = '600 13px system-ui, sans-serif';
            ctx.fillText('Asexual Reproduction: Identical Offspring (No Gametes)', cx - 175, cy + 85);
          } else if (mode === 'meiosis') {
            // 2n parent -> 4 haploid (n) gametes
            ctx.fillStyle = '#FEF3C7';
            ctx.strokeStyle = '#D97706';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx - 150, cy, 38, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#78350F';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText('2n Parent', cx - 178, cy + 56);

            [-75, -25, 25, 75].forEach((dy, idx) => {
              ctx.fillStyle = idx % 2 === 0 ? '#E0F2FE' : '#FCE7F3';
              ctx.strokeStyle = '#0284C7';
              ctx.beginPath();
              ctx.arc(cx + 130, cy + dy, 20, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = '#0369A1';
              ctx.font = '600 10px system-ui, sans-serif';
              ctx.fillText('n', cx + 126, cy + dy + 4);
            });

            ctx.fillStyle = '#44403C';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText('Meiosis → 4 Genetically Unique Gametes (n)', cx - 125, cy - 110);
          } else {
            // Gamete fusion -> Zygote
            const dist = Math.max(0, 120 - (stage / 100) * 120);
            ctx.fillStyle = '#FCE7F3';
            ctx.strokeStyle = '#DB2777';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx + dist * 0.4, cy, 38, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (dist > 5) {
              ctx.fillStyle = '#0284C7';
              ctx.beginPath();
              ctx.arc(cx - dist, cy, 10, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = '#44403C';
            ctx.font = '600 13px system-ui, sans-serif';
            ctx.fillText(
              dist <= 5 ? 'Fertilised Zygote (2n) Formed!' : 'Gametes Approaching (n + n → 2n)',
              cx - 110,
              cy + 75
            );
          }

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, stage]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'flower', label: 'Flower & Pollination' },
              { id: 'asexual', label: 'Asexual Division' },
              { id: 'meiosis', label: 'Meiosis (Variation)' },
              { id: 'fertilisation', label: 'Fertilisation' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-full transition ${
                mode === m.id
                  ? 'bg-rose-100 text-rose-900 font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('pollination')}
          className="w-full h-full block cursor-pointer"
        />
      </div>
    </div>
  );
}
