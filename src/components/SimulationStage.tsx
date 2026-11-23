import { Box, Layers, Sparkles, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import type {
  GeneratedSimulation,
  RenderDimension,
  SimulationMeta,
} from '../types/visualizer';
import type { OrderedPage, TextbookChapter, TextbookTopic } from '../types/textbook';
import {
  PendulumProjectileSim,
  type PendulumLiveStats,
} from '../simulations/PendulumProjectileSim';
import { MotionGraphsSim } from '../simulations/MotionGraphsSim';
import { ForcesNewtonSim } from '../simulations/ForcesNewtonSim';
import { WorkEnergySim } from '../simulations/WorkEnergySim';
import { BohrAtomSim } from '../simulations/BohrAtomSim';
import { SoundWavesSim } from '../simulations/SoundWavesSim';
import { ScientificInquirySim } from '../simulations/ScientificInquirySim';
import { CellExplorerSim } from '../simulations/CellExplorerSim';
import { TissuesJointsSim } from '../simulations/TissuesJointsSim';
import { MixturesLabSim } from '../simulations/MixturesLabSim';
import { ReproductionSim } from '../simulations/ReproductionSim';
import { BiodiversityTreeSim } from '../simulations/BiodiversityTreeSim';
import { EarthSystemSim } from '../simulations/EarthSystemSim';
import { AiVisualizerFrame } from './AiVisualizerFrame';
import { LabFilm, topicFilmId } from './LabFilm';
import { lessonModels } from './models/registry';

interface SimulationStageProps {
  watchLesson: boolean;
  onWatchLesson: (watch: boolean) => void;
  onCellControl: (id: 'solute' | 'mitosisStage', value: number) => void;
  activeSim: SimulationMeta | null;
  generatedSim: GeneratedSimulation | null;
  aiLoading: boolean;
  aiError: string | null;
  onRegenerateAi: () => void;
  dimension: RenderDimension;
  onDimensionChange: (dim: RenderDimension) => void;
  controlValues: Record<string, number | boolean | string>;
  cutSignal: number;
  onPendulumStats?: (stats: PendulumLiveStats) => void;
  selectedTopic: { chapter: TextbookChapter; topic: TextbookTopic } | null;
  selectedPage: OrderedPage | null;
  promptQuery: string;
  onSelectHotspot: (id: string) => void;
  onOpenFlipbook: () => void;
}

export function SimulationStage({
  watchLesson,
  onWatchLesson,
  onCellControl,
  activeSim,
  generatedSim,
  aiLoading,
  aiError,
  onRegenerateAi,
  dimension,
  onDimensionChange,
  controlValues,
  cutSignal,
  onPendulumStats,
  selectedTopic,
  selectedPage,
  promptQuery,
  onSelectHotspot,
  onOpenFlipbook,
}: SimulationStageProps) {
  const filmId = (selectedTopic && topicFilmId(activeSim?.id ?? null, selectedTopic.topic.number)) || activeSim?.id;
  const explorerId = selectedTopic && !topicFilmId(activeSim?.id??null,selectedTopic.topic.number) ? `topic:${selectedTopic.topic.number}` : null;
  const explorerModel = explorerId && lessonModels[explorerId] ? explorerId : null;
  const has3d = watchLesson ? !!(filmId && lessonModels[filmId]) : !!explorerModel || activeSim?.supports3d;
  return (
    <main className="flex-1 flex flex-col h-full bg-[#FAF9F6] overflow-hidden">
      {/* Stage Header */}
      <div className="px-6 py-3 border-b border-stone-200 bg-white/70 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-stone-900 truncate">
            {selectedTopic
              ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}`
              : activeSim
              ? activeSim.title
              : generatedSim
              ? generatedSim.title
              : promptQuery || 'Select a topic or enter a concept'}
          </h2>
          <p className="text-xs text-stone-500 truncate">
            {activeSim
              ? activeSim.subtitle
              : generatedSim
              ? generatedSim.subtitle
              : selectedTopic
              ? `Chapter ${selectedTopic.chapter.number}: ${selectedTopic.chapter.title}`
              : selectedPage
              ? `Chapter ${selectedPage.chapterNumber} • Book Page ${selectedPage.bookPage}`
              : 'Grade 9 Science Textbook'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeSim && !watchLesson && <button className="text-xs font-medium text-violet-800" onClick={() => onWatchLesson(true)}>{selectedTopic && !topicFilmId(activeSim.id, selectedTopic.topic.number) ? 'Watch chapter overview' : 'Watch lesson'}</button>}
          {activeSim && !has3d && <span className="text-xs text-stone-600">2D illustration</span>}
          {activeSim && has3d && (
            <div className="flex items-center rounded-xl bg-stone-100 border border-stone-200 p-0.5 text-xs">
              <button
                onClick={() => onDimensionChange('2d')}
                aria-pressed={dimension === '2d'}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  dimension === '2d'
                    ? 'bg-white text-stone-900 shadow-xs font-medium'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                2D
              </button>
              <button
                onClick={() => onDimensionChange('3d')}
                aria-pressed={dimension === '3d'}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  dimension === '3d'
                    ? 'bg-white text-stone-900 shadow-xs font-medium'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                3D
              </button>
            </div>
          )}
          <button
            onClick={onOpenFlipbook}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-amber-50/70 hover:border-amber-200 text-xs text-stone-700 flex items-center gap-1.5 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            Read in Textbook
          </button>
        </div>
      </div>

      {/* Stage Body */}
      <div className={`flex-1 p-5 flex items-center justify-center min-h-0 ${activeSim && watchLesson ? 'overflow-auto' : 'overflow-hidden'}`}>
        {activeSim && watchLesson ? (
          <LabFilm dimension={has3d?dimension:'2d'} id={filmId!} onExplore={() => onWatchLesson(false)} />
        ) : explorerModel && dimension==='3d' ? (
          <LabFilm dimension="3d" id={explorerModel} onExplore={()=>onDimensionChange('2d')}/>
        ) : activeSim?.id === 'pendulum-projectile' ? (
          <PendulumProjectileSim
            dimension={dimension}
            controlValues={controlValues}
            cutSignal={cutSignal}
            onSelectHotspot={onSelectHotspot}
            onStatsUpdate={onPendulumStats}
          />
        ) : activeSim?.id === 'motion-graphs' ? (
          <MotionGraphsSim
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'forces-newton' ? (
          <ForcesNewtonSim
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'work-energy' ? (
          <WorkEnergySim
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'bohr-atom' ? (
          <BohrAtomSim
            dimension={dimension}
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'sound-waves' ? (
          <SoundWavesSim
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'scientific-inquiry' ? (
          <ScientificInquirySim
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'cell-explorer' ? (
          <CellExplorerSim
            key={selectedTopic?.topic.id ?? promptQuery}
            onControl={onCellControl}
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'tissues-joints' ? (
          <TissuesJointsSim
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'mixtures-lab' ? (
          <MixturesLabSim
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'reproduction-life' ? (
          <ReproductionSim
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'biodiversity-tree' ? (
          <BiodiversityTreeSim
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : activeSim?.id === 'earth-system' ? (
          <EarthSystemSim
            controlValues={controlValues}
            topicHint={selectedTopic ? `${selectedTopic.topic.number} ${selectedTopic.topic.title}` : promptQuery}
            onSelectHotspot={onSelectHotspot}
          />
        ) : aiLoading ? (
          <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col items-center justify-center gap-3 text-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-sm font-medium text-stone-800">
              Building interactive visual…
            </p>
            <p className="text-xs text-stone-500 max-w-sm">
              Grounding in Grade 9 textbook context and generating interactive
              controls &amp; hotspots.
            </p>
          </div>
        ) : aiError ? (
          <div className="w-full max-w-lg rounded-3xl border border-rose-200 bg-rose-50/60 p-7 text-center space-y-3">
            <p className="text-sm font-semibold text-rose-900">
              Could not generate visualization
            </p>
            <p className="text-xs text-rose-700 leading-relaxed">{aiError}</p>
            <button
              onClick={onRegenerateAi}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100 text-xs font-medium text-rose-900 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        ) : generatedSim ? (
          <AiVisualizerFrame
            sim={generatedSim}
            controlValues={controlValues}
            onSelectHotspot={onSelectHotspot}
            onRegenerate={onRegenerateAi}
          />
        ) : (
          <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white shadow-xs p-8 text-center space-y-3">
            <Sparkles className="w-7 h-7 text-violet-500 mx-auto" />
            <h3 className="text-base font-semibold text-stone-900">
              Pick any topic or ask a concept
            </h3>
            <p className="text-xs text-stone-500">
              Choose a chapter from the sidebar, flip through the textbook, or
              type any 9th-grade science concept above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
