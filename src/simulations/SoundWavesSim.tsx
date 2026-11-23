import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundWavesSimProps {
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
}

export function SoundWavesSim({
  controlValues,
  onSelectHotspot,
}: SoundWavesSimProps) {
  const freq = Number(controlValues.frequency ?? 440);
  const amp = Number(controlValues.amplitude ?? 60);
  const speedOfSound = 343; // m/s
  const wavelength = speedOfSound / freq;

  const [audioOn, setAudioOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (oscRef.current && gainRef.current) {
      oscRef.current.frequency.value = freq;
      gainRef.current.gain.value = (amp / 100) * 0.12;
    }
  }, [freq, amp]);

  useEffect(() => {
    return () => {
      oscRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioOn) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = (amp / 100) * 0.12;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      setAudioOn(true);
    } else {
      oscRef.current?.stop();
      audioCtxRef.current?.close();
      oscRef.current = null;
      audioCtxRef.current = null;
      setAudioOn(false);
    }
  };

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

          const k = (freq / 440) * 0.035;
          const omega = 6.0;
          const dispAmp = (amp / 100) * 20;

          // Top: Longitudinal Air Particles
          ctx.fillStyle = '#57534E';
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText('Longitudinal Wave (Compressions & Rarefactions)', 24, 28);

          const cols = 42;
          const rows = 5;
          for (let r = 0; r < rows; r++) {
            const py = 54 + r * 22;
            for (let c = 0; c < cols; c++) {
              const baseX = 30 + (c / (cols - 1)) * (W - 60);
              const dx = dispAmp * Math.sin(k * baseX - omega * t);
              ctx.fillStyle = '#7C3AED';
              ctx.beginPath();
              ctx.arc(baseX + dx, py, 3.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Bottom: Transverse Pressure Representation
          const midY = H * 0.68;
          ctx.fillStyle = '#57534E';
          ctx.fillText(`Pressure / Density Wave  (Amplitude = ${amp}% • Wavelength λ = ${wavelength.toFixed(2)} m)`, 24, midY - 75);

          ctx.strokeStyle = '#E7E5E4';
          ctx.beginPath();
          ctx.moveTo(24, midY);
          ctx.lineTo(W - 24, midY);
          ctx.stroke();

          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 24; x <= W - 24; x += 3) {
            const y = midY - (amp / 100) * 58 * Math.sin(k * x - omega * t);
            if (x === 24) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [freq, amp]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs text-stone-600">
        <span>
          f = <strong className="text-stone-900">{freq} Hz</strong> •
          λ = <strong className="text-sky-700">{wavelength.toFixed(2)} m</strong> •
          Amplitude = <strong>{amp}%</strong>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium flex items-center gap-1.5 transition ${
              audioOn
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {audioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {audioOn ? 'Mute Tone' : 'Hear Tone'}
          </button>
          <button
            onClick={() => onSelectHotspot('wavelength')}
            className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-medium hover:bg-violet-100 transition"
          >
            Inspect Wavelength
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onClick={() => onSelectHotspot('wavelength')}
          className="w-full h-full block cursor-pointer"
        />
      </div>
    </div>
  );
}
