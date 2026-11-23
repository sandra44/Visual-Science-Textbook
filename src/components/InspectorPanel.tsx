import { useState } from 'react';
import {
  Info,
  Sliders,
  Lightbulb,
  MousePointerClick,
  RotateCcw,
} from 'lucide-react';
import type { ControlDef, ExperimentPrompt, Hotspot } from '../types/visualizer';

interface InspectorPanelProps {
  selectedHotspot: Hotspot | null;
  hotspots: Hotspot[];
  onSelectHotspot: (id: string) => void;
  controls: ControlDef[];
  controlValues: Record<string, number | boolean | string>;
  onControlChange: (id: string, value: number | boolean | string) => void;
  onControlAction?: (id: string) => void;
  experiments: ExperimentPrompt[];
  onResetAll?: () => void;
}

type TabId = 'inspect' | 'controls' | 'explore';

export function InspectorPanel({
  selectedHotspot,
  hotspots,
  onSelectHotspot,
  controls,
  controlValues,
  onControlChange,
  onControlAction,
  experiments,
  onResetAll,
}: InspectorPanelProps) {
  const [tab, setTab] = useState<TabId>('inspect');

  return (
    <aside className="w-80 shrink-0 border-l border-stone-200 bg-white flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-3 border-b border-stone-100 bg-stone-50/60">
        {(
          [
            { id: 'inspect', label: 'Inspect', icon: Info },
            { id: 'controls', label: 'Controls', icon: Sliders },
            { id: 'explore', label: 'Try This', icon: Lightbulb },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
              tab === id
                ? 'border-violet-500 text-violet-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'inspect' && (
          <>
            {selectedHotspot ? (
              <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 space-y-2.5">
                <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-violet-700 border border-violet-200 font-semibold">
                  {selectedHotspot.category}
                </span>
                <h3 className="text-sm font-semibold text-stone-900">
                  {selectedHotspot.label}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedHotspot.explanation}
                </p>
                {selectedHotspot.formula && (
                  <div className="rounded-xl bg-white border border-stone-200 px-3 py-2 font-mono text-xs text-teal-700">
                    {selectedHotspot.formula}
                  </div>
                )}
                {selectedHotspot.liveMetrics &&
                  Object.keys(selectedHotspot.liveMetrics).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {Object.entries(selectedHotspot.liveMetrics).map(
                        ([k, v]) => (
                          <div
                            key={k}
                            className="rounded-xl bg-white border border-stone-200 px-2.5 py-1.5"
                          >
                            <div className="text-[10px] text-stone-400">
                              {k}
                            </div>
                            <div className="text-xs font-semibold text-stone-800 tabular-nums">
                              {v}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5 text-center space-y-1.5">
                <MousePointerClick className="w-5 h-5 text-violet-500 mx-auto" />
                <p className="text-xs font-medium text-stone-700">
                  Click any part on the visual
                </p>
                <p className="text-[11px] text-stone-500">
                  Select an element below or click directly on the simulation to
                  see how it works.
                </p>
              </div>
            )}

            {hotspots.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Elements
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hotspots.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => onSelectHotspot(h.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                        selectedHotspot?.id === h.id
                          ? 'bg-violet-100 border-violet-300 text-violet-900 font-medium'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'controls' && (
          <div className="space-y-4">
            {onResetAll && (
              <button
                onClick={onResetAll}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs text-stone-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Parameters
              </button>
            )}
            {controls.length === 0 ? (
              <p className="text-xs text-stone-400">
                No adjustable controls for this view yet.
              </p>
            ) : (
              controls.map((ctrl) => {
                const val = controlValues[ctrl.id] ?? ctrl.defaultValue;
                if (ctrl.type === 'slider') {
                  return (
                    <div key={ctrl.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-700 font-medium">
                          {ctrl.label}
                        </span>
                        <span className="font-mono text-violet-700 tabular-nums">
                          {String(val)}
                          {ctrl.unit ? ` ${ctrl.unit}` : ''}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={ctrl.min ?? 0}
                        max={ctrl.max ?? 100}
                        step={ctrl.step ?? 1}
                        value={Number(val ?? 0)}
                        onChange={(e) =>
                          onControlChange(ctrl.id, Number(e.target.value))
                        }
                        className="w-full accent-violet-600 cursor-pointer"
                      />
                    </div>
                  );
                }
                if (ctrl.type === 'toggle') {
                  return (
                    <label
                      key={ctrl.id}
                      className="flex items-center justify-between gap-2 py-1 cursor-pointer"
                    >
                      <span className="text-xs text-stone-700">
                        {ctrl.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) =>
                          onControlChange(ctrl.id, e.target.checked)
                        }
                        className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                      />
                    </label>
                  );
                }
                if (ctrl.type === 'button') {
                  return (
                    <button
                      key={ctrl.id}
                      onClick={() => onControlAction?.(ctrl.id)}
                      className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition shadow-sm"
                    >
                      {ctrl.label}
                    </button>
                  );
                }
                return null;
              })
            )}
          </div>
        )}

        {tab === 'explore' && (
          <div className="space-y-3">
            {experiments.length === 0 ? (
              <p className="text-xs text-stone-400">
                Select a simulation to see guided experiments.
              </p>
            ) : (
              experiments.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5 space-y-1.5"
                >
                  <div className="text-xs font-semibold text-amber-900">
                    Experiment {idx + 1}: {exp.title}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {exp.prompt}
                  </p>
                  <p className="text-[11px] text-stone-500 italic">
                    Hint: {exp.hint}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
