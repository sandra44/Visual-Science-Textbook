import { useEffect, useRef } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import type { GeneratedSimulation } from '../types/visualizer';

interface AiVisualizerFrameProps {
  sim: GeneratedSimulation;
  controlValues: Record<string, number | boolean | string>;
  onSelectHotspot: (id: string) => void;
  onRegenerate: () => void;
  onRuntimeError?: (message: string) => void;
}

export function AiVisualizerFrame({
  sim,
  controlValues,
  onSelectHotspot,
  onRegenerate,
  onRuntimeError,
}: AiVisualizerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Listen for hotspot clicks & runtime errors from the sandboxed iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'select-hotspot' && typeof e.data.id === 'string') {
        onSelectHotspot(e.data.id);
      } else if (e.data.type === 'sim-error' && typeof e.data.message === 'string') {
        onRuntimeError?.(e.data.message);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelectHotspot, onRuntimeError]);

  // Forward control slider/toggle updates into the iframe
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    for (const [id, value] of Object.entries(controlValues)) {
      win.postMessage({ type: 'control-change', id, value }, '*');
    }
  }, [controlValues]);

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Generated with {sim.provider === 'gemini' ? 'Gemini' : 'Ollama (Local)'}
        </span>
        <button
          onClick={onRegenerate}
          className="px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-[11px] font-medium flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-[#FAF9F6]">
        <iframe
          ref={iframeRef}
          title={sim.title}
          sandbox="allow-scripts"
          srcDoc={sim.html}
          className="w-full h-full border-0 block"
        />
      </div>
    </div>
  );
}
