import { useEffect, useState } from 'react';

interface KingdomInfo {
  id: string;
  name: string;
  cellType: string;
  body: string;
  nutrition: string;
  examples: string;
  color: string;
}

const KINGDOMS: KingdomInfo[] = [
  {
    id: 'monera',
    name: 'Monera',
    cellType: 'Prokaryotic (No true nucleus)',
    body: 'Unicellular',
    nutrition: 'Autotrophic or Heterotrophic',
    examples: 'Bacteria, Cyanobacteria',
    color: 'bg-violet-50 border-violet-200 text-violet-900',
  },
  {
    id: 'protista',
    name: 'Protista',
    cellType: 'Eukaryotic (True nucleus)',
    body: 'Unicellular',
    nutrition: 'Autotrophic or Heterotrophic',
    examples: 'Amoeba, Paramecium, Euglena',
    color: 'bg-sky-50 border-sky-200 text-sky-900',
  },
  {
    id: 'fungi',
    name: 'Fungi',
    cellType: 'Eukaryotic (Chitin cell wall)',
    body: 'Multicellular (except Yeast)',
    nutrition: 'Saprophytic (Absorbs nutrients)',
    examples: 'Mushroom, Yeast, Bread Mould',
    color: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  {
    id: 'plantae',
    name: 'Plantae',
    cellType: 'Eukaryotic (Cellulose cell wall)',
    body: 'Multicellular',
    nutrition: 'Autotrophic (Photosynthesis)',
    examples: 'Mosses, Ferns, Mango, Pine',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  {
    id: 'animalia',
    name: 'Animalia',
    cellType: 'Eukaryotic (No cell wall)',
    body: 'Multicellular',
    nutrition: 'Heterotrophic (Ingests food)',
    examples: 'Insects, Fish, Birds, Humans',
    color: 'bg-rose-50 border-rose-200 text-rose-900',
  },
];

const TAXA = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];

interface BiodiversityTreeSimProps {
  controlValues: Record<string, number | boolean | string>;
  topicHint?: string;
  onSelectHotspot: (id: string) => void;
}

export function BiodiversityTreeSim({
  controlValues,
  topicHint,
  onSelectHotspot,
}: BiodiversityTreeSimProps) {
  const [selectedKingdom, setSelectedKingdom] = useState<string>('plantae');
  const taxonLevel = Math.min(6, Math.max(0, Number(controlValues.taxonLevel ?? 3)));

  useEffect(() => {
    if (!topicHint) return;
    const h = topicHint.toLowerCase();
    if (h.includes('protista')) setSelectedKingdom('protista');
    else if (h.includes('fungi')) setSelectedKingdom('fungi');
    else if (h.includes('plantae')) setSelectedKingdom('plantae');
    else if (h.includes('animalia')) setSelectedKingdom('animalia');
    else if (h.includes('monera')) setSelectedKingdom('monera');
  }, [topicHint]);

  const active = KINGDOMS.find((k) => k.id === selectedKingdom) ?? KINGDOMS[3];

  return (
    <div className="w-full h-full rounded-3xl border border-stone-200 bg-white shadow-xs p-6 flex flex-col justify-between gap-5 overflow-auto">
      {/* Five Kingdoms Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Whittaker’s Five Kingdom Classification (Click a Kingdom)
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {KINGDOMS.map((k) => (
            <button
              key={k.id}
              onClick={() => {
                setSelectedKingdom(k.id);
                onSelectHotspot('five-kingdoms');
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedKingdom === k.id
                  ? `${k.color} ring-2 ring-violet-400`
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="text-xs font-bold">{k.name}</div>
              <div className="text-[10px] opacity-75 mt-1">{k.body}</div>
            </button>
          ))}
        </div>

        {/* Active Kingdom Card */}
        <div className={`rounded-2xl border p-4 grid grid-cols-2 gap-3 ${active.color}`}>
          <div>
            <div className="text-[10px] uppercase font-semibold opacity-70">Cell Structure</div>
            <div className="text-xs font-semibold mt-0.5">{active.cellType}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold opacity-70">Nutrition</div>
            <div className="text-xs font-semibold mt-0.5">{active.nutrition}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] uppercase font-semibold opacity-70">Examples</div>
            <div className="text-xs font-semibold mt-0.5">{active.examples}</div>
          </div>
        </div>
      </div>

      {/* Taxonomic Hierarchy Funnel */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Taxonomic Hierarchy &amp; Binomial Naming (Broad → Specific)
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TAXA.map((t, idx) => (
            <div
              key={t}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                idx <= taxonLevel
                  ? 'bg-violet-100 border-violet-300 text-violet-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              {t}
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-500">
          Binomial Nomenclature combines <em>Genus</em> + <em>species</em> (e.g.,{' '}
          <em className="text-stone-800 font-medium">Mangifera indica</em> for Mango).
        </p>
      </div>
    </div>
  );
}
