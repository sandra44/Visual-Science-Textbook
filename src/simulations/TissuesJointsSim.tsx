import { useEffect, useRef, useState } from 'react';

type TissueMode = 'joints' | 'plant' | 'animal';

interface TissuesJointsSimProps {
  controlValues: Record<string, number | boolean | string>;
  topicHint?: string;
  onSelectHotspot: (id: string) => void;
}

export function TissuesJointsSim({
  controlValues,
  topicHint,
  onSelectHotspot,
}: TissuesJointsSimProps) {
  const [mode, setMode] = useState<TissueMode>('joints');
  const [jointType, setJointType] = useState<'hinge' | 'ball' | 'pivot' | 'fixed'>('hinge');
  const flexAngle = Number(controlValues.flexAngle ?? 45);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!topicHint) return;
    const h = topicHint.toLowerCase();
    if (h.includes('3.1') || h.includes('3.2') || h.includes('meristem') || h.includes('plant')) setMode('plant');
    else if (h.includes('3.3') || h.includes('epithelial') || h.includes('nerv')) setMode('animal');
    else setMode('joints');

    if (h.includes('ball')) setJointType('ball');
    else if (h.includes('pivot')) setJointType('pivot');
    else if (h.includes('fixed')) setJointType('fixed');
    else if (h.includes('hinge')) setJointType('hinge');
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

          if (mode === 'joints') {
            const rad =
              jointType === 'fixed'
                ? 0
                : ((flexAngle - 45) * Math.PI) / 180;

            // Upper bone
            ctx.fillStyle = '#F5F5F4';
            ctx.strokeStyle = '#78716C';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(cx - 140, cy - 14, 120, 28, 12);
            ctx.fill();
            ctx.stroke();

            // Joint capsule
            ctx.fillStyle = jointType === 'ball' ? '#DDD6FE' : jointType === 'fixed' ? '#E7E5E4' : '#FEF3C7';
            ctx.strokeStyle = '#7C3AED';
            ctx.beginPath();
            ctx.arc(cx, cy, jointType === 'ball' ? 24 : 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Lower bone rotating around joint
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rad);
            ctx.fillStyle = '#F5F5F4';
            ctx.strokeStyle = '#78716C';
            ctx.beginPath();
            ctx.roundRect(14, -13, 125, 26, 12);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Biceps muscle contracting
            ctx.fillStyle = '#FECDD3';
            ctx.strokeStyle = '#E11D48';
            ctx.beginPath();
            ctx.ellipse(cx - 65, cy - 28, 42, 10 + (120 - flexAngle) * 0.06, 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#44403C';
            ctx.font = '600 13px system-ui, sans-serif';
            ctx.fillText(
              `${jointType.toUpperCase()} JOINT • Range: ${
                jointType === 'fixed' ? '0° (Immovable)' : jointType === 'ball' ? '360° Multi-axis' : '180° Single-plane'
              }`,
              cx - 145,
              cy + 95
            );
            ctx.fillStyle = '#78716C';
            ctx.font = '10px system-ui, sans-serif';
            ctx.fillText('Upper Bone', cx - 125, cy + 26);
            ctx.fillText('Joint Capsule', cx - 28, cy - 30);
            ctx.fillStyle = '#BE123C';
            ctx.fillText('Muscle (Contracts)', cx - 108, cy - 44);
          } else if (mode === 'plant') {
            // Plant stem showing Apical, Intercalary, Lateral meristems
            ctx.fillStyle = '#BBF7D0';
            ctx.strokeStyle = '#15803D';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(cx - 32, cy - 110, 64, 220, 14);
            ctx.fill();
            ctx.stroke();

            const zones = [
              { y: cy - 90, label: 'Apical Meristem (Length)', col: '#7C3AED' },
              { y: cy - 10, label: 'Intercalary Meristem (Nodes)', col: '#0284C7' },
              { y: cy + 70, label: 'Lateral Meristem (Girth)', col: '#D97706' },
            ];
            zones.forEach((z) => {
              ctx.fillStyle = z.col;
              ctx.fillRect(cx - 30, z.y - 6, 60, 12);
              ctx.fillStyle = '#292524';
              ctx.font = '600 11px system-ui, sans-serif';
              ctx.fillText(z.label, cx + 48, z.y + 4);
            });
          } else {
            // Nervous tissue signal impulse
            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx - 180, cy);
            ctx.lineTo(cx + 180, cy);
            ctx.stroke();

            ctx.fillStyle = '#DDD6FE';
            ctx.beginPath();
            ctx.arc(cx - 180, cy, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            const pulseX = cx - 160 + ((t * 140) % 340);
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(pulseX, cy, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#44403C';
            ctx.font = '600 12px system-ui, sans-serif';
            ctx.fillText('Nerve Impulse Travelling Along Axon', cx - 110, cy - 35);
          }

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, jointType, flexAngle]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'joints', label: 'Joints & Muscles' },
              { id: 'plant', label: 'Plant Meristems' },
              { id: 'animal', label: 'Animal Tissues' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-full transition ${
                mode === m.id
                  ? 'bg-emerald-100 text-emerald-900 font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'joints' && (
          <div className="flex items-center gap-1">
            {(['hinge', 'ball', 'pivot', 'fixed'] as const).map((j) => (
              <button
                key={j}
                onClick={() => setJointType(j)}
                className={`px-2 py-0.5 rounded-full text-[11px] capitalize ${
                  jointType === j
                    ? 'bg-violet-100 text-violet-900 font-medium'
                    : 'bg-white border border-stone-200 text-stone-600'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('joint')}
          className="w-full h-full block cursor-pointer"
        />
      </div>
    </div>
  );
}
