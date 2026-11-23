import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  Atom,
  BookOpen,
  Menu,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { ChapterSidebar } from './components/ChapterSidebar';
import { InspectorPanel } from './components/InspectorPanel';
import { FlipbookView } from './components/FlipbookView';
import { SimulationStage } from './components/SimulationStage';
import { topicFilmId } from './components/LabFilm';
import { CURATED_SIMULATIONS } from './simulations/registry';
import type { PendulumLiveStats } from './simulations/PendulumProjectileSim';
import type {
  AiProvider,
  GeneratedSimulation,
  RenderDimension,
  ViewMode,
} from './types/visualizer';
import type {
  OrderedPage,
  TextbookChapter,
  TextbookIndex,
  TextbookPageText,
  TextbookTopic,
} from './types/textbook';

export default function App() {
  const [index, setIndex] = useState<TextbookIndex | null>(null);
  const [pagesText, setPagesText] = useState<Record<string, TextbookPageText>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('flipbook');
  const [bookPopup,setBookPopup]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const [origin,setOrigin]=useState('50% 75%');
  useEffect(()=>{
    if(bookPopup && viewMode==='flipbook')dialog.current?.showModal();
  },[bookPopup,viewMode]);
  function liftFromPage(){
    const rect=document.activeElement?.getBoundingClientRect();
    setOrigin(rect?`${100*(rect.x+rect.width/2)/window.innerWidth}% ${100*(rect.y+rect.height/2)/window.innerHeight}%`:'50% 75%');
    setBookPopup(true);
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<AiProvider>('gemini');
  const [promptInput, setPromptInput] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');

  const [activeSimId, setActiveSimId] = useState<string | null>(null);
  const [watchLesson, setWatchLesson] = useState(true);
  const [lessonRun, setLessonRun] = useState(0);
  const [generatedSim, setGeneratedSim] = useState<GeneratedSimulation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [dimension, setDimension] = useState<RenderDimension>('2d');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, number | boolean | string>>({});
  const [cutSignal, setCutSignal] = useState(0);
  const [pendulumStats, setPendulumStats] = useState<PendulumLiveStats | null>(null);

  const [activeChapterNumber, setActiveChapterNumber] = useState<number | null>(null);
  const [activeTopic, setActiveTopic] = useState<{
    chapter: TextbookChapter;
    topic: TextbookTopic;
  } | null>(null);
  const [activePage, setActivePage] = useState<OrderedPage | null>(null);
  const [flipTargetBookPage, setFlipTargetBookPage] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/textbook-index.json')
      .then((r) => r.json())
      .then((data: TextbookIndex) => setIndex(data))
      .catch(console.error);

    fetch('/data/textbook-pages.json')
      .then((r) => r.json())
      .then((data: Record<string, TextbookPageText>) => setPagesText(data))
      .catch(console.error);
  }, []);

  const activeSim = activeSimId ? CURATED_SIMULATIONS[activeSimId] ?? null : null;

  const currentHotspots = activeSim
    ? activeSim.hotspots
    : generatedSim?.hotspots ?? [];
  const currentControls = activeSim
    ? activeSim.controls
    : generatedSim?.controls ?? [];
  const currentExperiments = activeSim
    ? activeSim.experiments
    : generatedSim?.experiments ?? [];

  const selectedHotspot = useMemo(() => {
    if (!selectedHotspotId) return null;
    const base = currentHotspots.find((h) => h.id === selectedHotspotId) ?? null;
    if (!base || activeSim?.id !== 'pendulum-projectile' || !pendulumStats) return base;

    const liveMetrics: Record<string, string | number> =
      base.id === 'bob'
        ? {
            Speed: `${pendulumStats.speed.toFixed(2)} m/s`,
            Height: `${pendulumStats.height.toFixed(2)} m`,
            Angle: `${pendulumStats.angleDeg.toFixed(1)}°`,
            Phase: pendulumStats.phase,
          }
        : base.id === 'tension'
        ? {
            Tension: `${pendulumStats.tension.toFixed(1)} N`,
            Phase: pendulumStats.phase,
          }
        : base.id === 'velocity'
        ? {
            vx: `${pendulumStats.vx.toFixed(2)} m/s`,
            vy: `${pendulumStats.vy.toFixed(2)} m/s`,
          }
        : base.id === 'energy'
        ? {
            KE: `${pendulumStats.ke.toFixed(1)} J`,
            PE: `${pendulumStats.pe.toFixed(1)} J`,
          }
        : base.liveMetrics ?? {};

    return { ...base, liveMetrics };
  }, [currentHotspots, activeSim, selectedHotspotId, pendulumStats]);

  const switchMode = (mode: ViewMode) => {
    setBookPopup(false);
    setViewMode(mode);
    setSidebarOpen(mode === 'simulator');
  };

  const generateWithAi = useCallback(
    async (opts: {
      prompt: string;
      chapterTitle?: string;
      topicTitle?: string;
      textbookExcerpt?: string;
      bypassCache?: boolean;
    }) => {
      const cacheKey = `lv_ai_v1:${aiProvider}:${opts.prompt.toLowerCase()}`;
      if (!opts.bypassCache) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed: GeneratedSimulation = JSON.parse(cached);
            setGeneratedSim(parsed);
            setSelectedHotspotId(parsed.hotspots[0]?.id ?? null);
            setControlValues(
              Object.fromEntries(
                parsed.controls
                  .filter((c) => c.defaultValue !== undefined)
                  .map((c) => [c.id, c.defaultValue!])
              )
            );
            setAiError(null);
            return;
          }
        } catch {
          // Ignore storage error
        }
      }

      setAiLoading(true);
      setAiError(null);
      setGeneratedSim(null);

      try {
        const res = await fetch('/api/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: opts.prompt,
            provider: aiProvider,
            chapterTitle: opts.chapterTitle,
            topicTitle: opts.topicTitle,
            textbookExcerpt: opts.textbookExcerpt,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || `Server returned ${res.status}`);
        }
        const sim: GeneratedSimulation = { ...data, provider: aiProvider };
        setGeneratedSim(sim);
        setSelectedHotspotId(sim.hotspots[0]?.id ?? null);
        setControlValues(
          Object.fromEntries(
            sim.controls
              .filter((c) => c.defaultValue !== undefined)
              .map((c) => [c.id, c.defaultValue!])
          )
        );
        try {
          localStorage.setItem(cacheKey, JSON.stringify(sim));
        } catch {
          // Ignore quota error
        }
      } catch (err) {
        setAiError(err instanceof Error ? err.message : 'Failed to generate simulation.');
      } finally {
        setAiLoading(false);
      }
    },
    [aiProvider]
  );

  const handleSelectCuratedSim = (simId: string) => {
    const sim = CURATED_SIMULATIONS[simId];
    if (!sim) return;
    setWatchLesson(true);
    setLessonRun(n => n + 1);
    setActiveSimId(simId);
    setGeneratedSim(null);
    setAiError(null);
    setDimension(sim.defaultDimension);
    setSelectedHotspotId(sim.hotspots[0]?.id ?? null);
    setActiveTopic(null);
    setActivePage(null);
    setViewMode('simulator');
    setControlValues(
      Object.fromEntries(
        sim.controls
          .filter((c) => c.defaultValue !== undefined)
          .map((c) => [c.id, c.defaultValue!])
      )
    );
  };

  const handleSelectTopic = (chapter: TextbookChapter, topic: TextbookTopic) => {
    setWatchLesson(Boolean(topicFilmId(topic.curatedSimId, topic.number)));
    setLessonRun(n => n + 1);
    setActiveChapterNumber(chapter.number);
    setActiveTopic({ chapter, topic });
    setActivePage(null);
    setFlipTargetBookPage(topic.bookPage);
    const label = `${topic.number} ${topic.title}`;
    setPromptInput(label);
    setSubmittedPrompt(label);
    setViewMode('simulator');

    if (topic.curatedSimId && CURATED_SIMULATIONS[topic.curatedSimId]) {
      const sim = CURATED_SIMULATIONS[topic.curatedSimId];
      setActiveSimId(topic.curatedSimId);
      setGeneratedSim(null);
      setAiError(null);
      setDimension(sim.defaultDimension);
      setSelectedHotspotId(sim.hotspots[0]?.id ?? null);
      setControlValues(
        Object.fromEntries(
          sim.controls
            .filter((c) => c.defaultValue !== undefined)
            .map((c) => [c.id, c.defaultValue!])
        )
      );
    } else {
      setActiveSimId(null);
      setSelectedHotspotId(null);
      generateWithAi({
        prompt: topic.title,
        chapterTitle: `Chapter ${chapter.number}: ${chapter.title}`,
        topicTitle: label,
        textbookExcerpt: pagesText[String(topic.pdfPage)]?.text,
      });
    }
  };

  const handleOpenChapterInBook = (chapter: TextbookChapter) => {
    setActiveChapterNumber(chapter.number);
    setFlipTargetBookPage(chapter.bookStart);
    setViewMode('flipbook');
    setSidebarOpen(false);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = promptInput.trim();
    if (!q) return;
    setSubmittedPrompt(q);
    const lower = q.toLowerCase();
    if (lower.includes('pendulum') && lower.includes('projectile')) {
      handleSelectCuratedSim('pendulum-projectile');
    } else if (lower.includes('atom') || lower.includes('bohr')) {
      handleSelectCuratedSim('bohr-atom');
    } else if (lower.includes('sound') || lower.includes('wave')) {
      handleSelectCuratedSim('sound-waves');
    } else if (lower.includes('newton') || lower.includes('force') || lower.includes('friction')) {
      handleSelectCuratedSim('forces-newton');
    } else if (lower.includes('work') || lower.includes('energy') || lower.includes('machine')) {
      handleSelectCuratedSim('work-energy');
    } else if (lower.includes('motion') || lower.includes('velocity') || lower.includes('graph')) {
      handleSelectCuratedSim('motion-graphs');
    } else if (lower.includes('cell') || lower.includes('osmosis') || lower.includes('mitosis')) {
      handleSelectCuratedSim('cell-explorer');
    } else if (lower.includes('tissue') || lower.includes('joint') || lower.includes('meristem')) {
      handleSelectCuratedSim('tissues-joints');
    } else if (lower.includes('mixture') || lower.includes('distill') || lower.includes('chromato') || lower.includes('tyndall') || lower.includes('solub')) {
      handleSelectCuratedSim('mixtures-lab');
    } else if (lower.includes('reproduc') || lower.includes('pollin') || lower.includes('meiosis') || lower.includes('fertilis')) {
      handleSelectCuratedSim('reproduction-life');
    } else if (lower.includes('biodivers') || lower.includes('kingdom') || lower.includes('classif') || lower.includes('fossil')) {
      handleSelectCuratedSim('biodiversity-tree');
    } else if (lower.includes('earth') || lower.includes('sphere') || lower.includes('cycle') || lower.includes('wind')) {
      handleSelectCuratedSim('earth-system');
    } else if (lower.includes('inquiry') || lower.includes('variable') || lower.includes('exploration')) {
      handleSelectCuratedSim('scientific-inquiry');
    } else {
      setActiveSimId(null);
      setActiveTopic(null);
      setActivePage(null);
      setViewMode('simulator');
      generateWithAi({ prompt: q });
    }
  };

  const handleRegenerateAi = () => {
    const pdfPage = activeTopic?.topic.pdfPage ?? activePage?.pdfPage;
    generateWithAi({
      prompt: activeTopic
        ? activeTopic.topic.title
        : activePage
        ? `${activePage.chapterTitle} — Page ${activePage.bookPage}`
        : submittedPrompt,
      chapterTitle: activeTopic
        ? `Chapter ${activeTopic.chapter.number}: ${activeTopic.chapter.title}`
        : activePage
        ? `Chapter ${activePage.chapterNumber}: ${activePage.chapterTitle}`
        : undefined,
      topicTitle: activeTopic
        ? `${activeTopic.topic.number} ${activeTopic.topic.title}`
        : undefined,
      textbookExcerpt: pdfPage ? pagesText[String(pdfPage)]?.text : undefined,
      bypassCache: true,
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAF9F6] text-stone-800 overflow-hidden">
      {/* Slim Clean Top Bar */}
      <header className="h-13 shrink-0 border-b border-stone-200 bg-white/95 backdrop-blur px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
            title="Toggle Chapters"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center">
            <Atom className="w-4 h-4 text-violet-700" />
          </div>
          <button title="Browse science labs" onClick={() => switchMode('home')} className="text-sm font-semibold text-stone-900 tracking-tight hover:text-violet-700">
            Science Visualizer
          </button>
        </div>

        {/* Prompt Input */}
        <form
          onSubmit={handlePromptSubmit}
          className="flex-1 max-w-lg flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Enter any Grade 9 concept..."
              className="w-full bg-stone-50 border border-stone-200 rounded-full pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-violet-400 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white flex items-center gap-1.5 transition shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Visualize
          </button>
        </form>

        {/* Mode & AI Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center rounded-full bg-stone-100 border border-stone-200 p-0.5 text-xs">
            <button
              onClick={() => switchMode('simulator')}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition ${
                viewMode === 'simulator'
                  ? 'bg-white text-stone-900 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-violet-600" />
              Simulator
            </button>
            <button
              onClick={() => switchMode('flipbook')}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition ${
                viewMode === 'flipbook'
                  ? 'bg-white text-stone-900 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Textbook
            </button>
          </div>

          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value as AiProvider)}
            title="AI Provider for custom topics"
            className="px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-600 text-xs focus:outline-none cursor-pointer"
          >
            <option value="gemini">Gemini</option>
            <option value="ollama">Ollama (Local)</option>
          </select>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {sidebarOpen && index && (
          <ChapterSidebar
            chapters={index.chapters}
            activeChapterNumber={activeChapterNumber}
            activeTopicId={activeTopic?.topic.id ?? null}
            onSelectTopic={viewMode==='flipbook' ? (chapter,topic)=>{
              setActiveChapterNumber(chapter.number);setActiveTopic({chapter,topic});setFlipTargetBookPage(topic.bookPage);setSidebarOpen(false);
            }:handleSelectTopic}
            onOpenChapterInBook={handleOpenChapterInBook}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {viewMode === 'home' ? (
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">Grade 9 · Interactive science</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">What would you like to explore?</h1>
              <p className="mt-3 text-stone-600">Start with your textbook, choose a lab below, or enter a concept in the search bar.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200" onClick={() => setSidebarOpen(true)}>Browse chapters</button>
                <button className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm hover:bg-amber-50" onClick={() => switchMode('flipbook')}>Open textbook</button>
              </div>
              <h2 className="mt-10 mb-3 font-semibold">Science labs</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.values(CURATED_SIMULATIONS).sort((a,b) => a.title.localeCompare(b.title)).map(sim =>
                  <button key={sim.id} className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left hover:border-violet-300" onClick={() => {
                    setSubmittedPrompt(sim.title); setPromptInput(sim.title); setActiveChapterNumber(sim.chapterRefs[0]);
                    setFlipTargetBookPage(index?.chapters.find(c => c.number === sim.chapterRefs[0])?.bookStart ?? null);
                    handleSelectCuratedSim(sim.id);
                  }}>
                    <span className="block text-xs text-stone-500">Ch. {sim.chapterRefs.join(', ')}</span>
                    <span className="text-sm font-medium">{sim.title}</span>
                  </button>
                )}
              </div>
            </div>
          </main>
        ) : null}
        {viewMode === 'flipbook' && (index ? (
          <FlipbookView
            index={index}
            page={flipTargetBookPage??0}
            onNavigate={n=>{setFlipTargetBookPage(n);setActiveTopic(null);setActiveChapterNumber(index.orderedPages[n-1]?.chapterNumber??null);}}
            onVisualizeTopic={(c,t)=>{handleSelectTopic(c,t);setFlipTargetBookPage(flipTargetBookPage);setViewMode('flipbook');liftFromPage();}}
            onToggleChapters={() => setSidebarOpen((v) => !v)}
          />
        ) : <p>Opening book…</p>)}
        {(viewMode==='simulator' || (viewMode==='flipbook' && bookPopup)) && (()=>{
          const content=<>
            <SimulationStage
              key={lessonRun}
              watchLesson={watchLesson}
              onWatchLesson={setWatchLesson}
              activeSim={activeSim}
              generatedSim={generatedSim}
              aiLoading={aiLoading}
              aiError={aiError}
              onRegenerateAi={handleRegenerateAi}
              dimension={dimension}
              onDimensionChange={setDimension}
              controlValues={controlValues}
              cutSignal={cutSignal}
              onCellControl={(id, value) => setControlValues(prev => ({ ...prev, [id]: value }))}
              onPendulumStats={setPendulumStats}
              selectedTopic={activeTopic}
              selectedPage={activePage}
              promptQuery={submittedPrompt}
              onSelectHotspot={setSelectedHotspotId}
              onOpenFlipbook={() => switchMode('flipbook')}
            />
            {(!activeSim || !watchLesson) && <InspectorPanel
              selectedHotspot={selectedHotspot}
              hotspots={currentHotspots}
              onSelectHotspot={setSelectedHotspotId}
              controls={currentControls}
              controlValues={controlValues}
              onControlChange={(id, value) =>
                setControlValues((prev) => ({ ...prev, [id]: value }))
              }
              onControlAction={(id) => {
                if (id === 'cutString') setCutSignal((n) => n + 1);
              }}
              experiments={currentExperiments}
              onResetAll={() =>
                setControlValues(
                  Object.fromEntries(
                    currentControls
                      .filter((c) => c.defaultValue !== undefined)
                      .map((c) => [c.id, c.defaultValue!])
                  )
                )
              }
            />}
          </>;
          return viewMode==='simulator'?content:<dialog ref={dialog} className="page-pop" style={{transformOrigin:origin}}
            aria-label="Visualization above textbook page" onCancel={()=>setBookPopup(false)} onClose={()=>setBookPopup(false)}>
            <div className="projection-bar flex justify-between items-center px-4 py-2 text-sm"><span>From page {activeTopic?.topic.bookPage ?? activePage?.bookPage ?? flipTargetBookPage}</span>
              <button autoFocus className="rounded-full bg-violet-100 px-3 py-1" onClick={()=>dialog.current?.close()}>Back to page ×</button></div>
            <div className="flex flex-1 overflow-hidden min-h-0">{content}</div>
          </dialog>;
        })()}
      </div>
    </div>
  );
}
