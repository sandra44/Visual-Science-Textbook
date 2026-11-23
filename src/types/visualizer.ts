export type ViewMode = 'home' | 'simulator' | 'flipbook';
export type RenderDimension = '2d' | '3d';
export type AiProvider = 'gemini' | 'ollama';

export interface Hotspot {
  id: string;
  label: string;
  category: 'object' | 'vector' | 'concept' | 'energy';
  explanation: string;
  formula?: string;
  liveMetrics?: Record<string, string | number>;
}

export interface ControlDef {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'button' | 'select';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string }[];
  defaultValue?: number | boolean | string;
}

export interface ExperimentPrompt {
  id: string;
  title: string;
  prompt: string;
  hint: string;
}

export interface SimulationMeta {
  id: string;
  title: string;
  subtitle: string;
  chapterRefs: number[];
  supports3d: boolean;
  defaultDimension: RenderDimension;
  hotspots: Hotspot[];
  controls: ControlDef[];
  experiments: ExperimentPrompt[];
}

export interface GeneratedSimulation {
  title: string;
  subtitle: string;
  hotspots: Hotspot[];
  controls: ControlDef[];
  experiments: ExperimentPrompt[];
  html: string;
  provider: AiProvider;
}

