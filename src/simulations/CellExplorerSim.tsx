import { useEffect, useState, type ReactNode } from 'react';
import { CURATED_SIMULATIONS } from './registry';
import { CellInterior, Mitochondrion, NucleusCutaway } from '../components/SpecimenArt';

const modes = ['Cell Organelles', 'Osmosis', 'Cell Division', 'Size Scale'] as const;
type Mode = typeof modes[number];
const steps = [
  ['Interphase', 'Before mitosis, DNA is copied inside the nucleus.'],
  ['Prophase', 'The copied DNA coils into visible chromosomes. Each X has two sister chromatids.'],
  ['Metaphase', 'The chromosomes line up across the middle of the cell.'],
  ['Anaphase', 'Sister chromatids separate. One copy of each chromosome moves toward each pole.'],
  ['Telophase', 'A new nucleus forms around each matching set of chromosomes.'],
  ['Cytokinesis', 'The animal cell finishes pinching in two. Each daughter cell has a complete set of chromosomes.'],
];
const specimens = [['Plant cell', 50], ['Red blood cell', 7], ['Bacterium', 1], ['Frog egg', 1000]] as const;
const hot = CURATED_SIMULATIONS['cell-explorer'].hotspots;
const pill = 'rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs hover:border-violet-500 aria-pressed:bg-violet-100 disabled:opacity-40';
function startingMode(hint: string): Mode {
  if (/size|microscop|^2\.1\b/i.test(hint)) return 'Size Scale';
  if (/osmosis|membrane|^Activity 2\.[23]\b/i.test(hint)) return 'Osmosis';
  if (/division|mitosis|grow|^Activity 2\.5\b/i.test(hint)) return 'Cell Division';
  return 'Cell Organelles';
}

export function CellExplorerSim({controlValues, topicHint = '', onSelectHotspot, onControl}: {
  controlValues: Record<string, number | boolean | string>; topicHint?: string;
  onSelectHotspot: (id: string) => void; onControl: (id: 'solute' | 'mitosisStage', value: number) => void;
}) {
  const [mode, setMode] = useState(() => startingMode(topicHint));
  const [plant, setPlant] = useState(true);
  const [organ, setOrgan] = useState(/wall/i.test(topicHint) ? 'wall' : 'nucleus');
  const [specimen, setSpecimen] = useState(0);
  const [zoom, setZoom] = useState(1);
  const solute = Number(controlValues.solute ?? 50);
  const stage = Number(controlValues.mitosisStage ?? 0);
  const selected = mode === 'Cell Organelles' ? organ : mode === 'Osmosis' ? 'membrane' : mode === 'Size Scale' ? 'scale' : 'division';
  useEffect(() => { onSelectHotspot(selected); }, [selected, onSelectHotspot]);
  function part(id: string, drawing: ReactNode) {
    const label = hot.find(h => h.id === id)!.label;
    return <g role="button" tabIndex={0} aria-label={label} aria-pressed={organ === id}
      className="cursor-pointer hover:brightness-95 focus:brightness-90" strokeWidth={organ === id ? 5 : 2}
      onClick={() => {setOrgan(id); onSelectHotspot(id);}}
      onKeyDown={e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); setOrgan(id); onSelectHotspot(id);}}}>
      <title>{label}</title>{drawing}</g>;
  }
  const [name, diameter] = specimens[specimen];
  const field = 120 / zoom;
  const scaleBar = zoom < 1 ? 100 : zoom <= 4 ? 10 : 1;
  const prompt = {
    'Cell Organelles': 'Select a structure inside the cell. Switch to an animal cell: which structures disappear?',
    'Osmosis': 'Change the solution outside this animal cell. Predict whether water will enter or leave.',
    'Cell Division': 'Advance one step at a time. Follow each colour: does each daughter cell get both chromosomes?',
    'Size Scale': 'Choose a specimen and zoom. Compare its diameter with the ruler, not its size on your screen.',
  }[mode];
  return <section aria-label="Cell lab" className="w-full h-full overflow-auto rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-800">
    <nav aria-label="Cell experiments" className="flex flex-wrap gap-2">{modes.map(m =>
      <button key={m} className={pill} aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}</nav>
    <p className="my-4 font-medium">{prompt}</p>
    {mode === 'Cell Organelles' && <>
      <div className="flex gap-2">{['Plant cell', 'Animal cell'].map((text,i) =>
        <button className={pill} key={text} aria-pressed={plant === !i} onClick={() => {setPlant(!i); setOrgan('nucleus');}}>{text}</button>)}</div>
      <svg viewBox="0 0 420 225" className="mx-auto w-full max-w-xl" aria-label="Selectable cell structures">
        {plant && part('wall', <rect x="15" y="10" width="390" height="205" rx="30" fill="#bbf7d0" stroke="#15803d"/>)}
        {part('membrane', plant ? <rect x="27" y="22" width="366" height="181" rx="23" fill="#f5edd3" stroke="#948153"/> : <g transform="translate(-24 -10) scale(1.05)"><CellInterior/></g>)}
        {part('nucleus', <g transform="translate(132 112)"><NucleusCutaway/><text y="52" textAnchor="middle">Nucleus</text></g>)}
        {part('mitochondrion', <g transform="translate(230 61) scale(1.4)"><Mitochondrion/></g>)}
        {plant && part('vacuole', <><ellipse cx="278" cy="136" rx="72" ry="46" fill="#e0f2fe" stroke="#0284c7"/><text x="278" y="141" textAnchor="middle">Vacuole</text></>)}
        {plant && part('chloroplast', <g>{[[80,57],[108,172]].map(([x,y])=><g key={x} transform={`translate(${x} ${y}) rotate(-14)`}><ellipse rx="26" ry="13" fill="#b5d78e" stroke="#54815b"/>{[-13,0,13].map(dx=><path key={dx} d={`M${dx-4} -4h8m-8 3h8m-8 3h8m-8 3h8`} stroke="#54815b" strokeWidth="2"/>)}</g>)}</g>)}
      </svg>
      <p aria-live="polite"><strong>{hot.find(h => h.id === organ)?.label}: </strong>{hot.find(h => h.id === organ)?.explanation}</p>
    </>}
    {mode === 'Osmosis' && <>
      <label className="flex flex-wrap items-center gap-3">Outside solute (relative concentration)
        <input type="range" min="10" max="90" step="5" value={solute} onChange={e => onControl('solute', +e.target.value)}/><output>{solute}</output></label>
      <svg viewBox="0 0 400 220" className="mx-auto w-full max-w-xl" aria-label="Model of cell swelling or shrinking">
        <rect width="400" height="220" rx="16" fill="#f0f9ff"/>
        {Array.from({length: Math.round(solute/3)}, (_,i) => <circle key={i} cx={i%2 ? 32+(i*17)%65 : 308+(i*17)%65} cy={20+(i*43)%180} r="4" fill="#a16207"/>)}
        <circle cx="200" cy="110" r="63" fill="none" stroke="#78716c" strokeDasharray="4 4"/>
        <circle cx="200" cy="110" r={63+(50-solute)*0.6} fill="#bbf7d0" fillOpacity=".65" stroke="#15803d" className="transition-all duration-500"/>
        <text x="200" y="115" textAnchor="middle">Animal cell</text>
        <text x="96" y="117" textAnchor="middle" fill="#0369a1" fontSize="28">{solute < 50 ? '→' : solute > 50 ? '←' : '⇄'}</text>
      </svg>
      <p aria-live="polite">{solute === 50 ? 'Balanced: water crosses both ways with no net change in size.' : solute > 50 ? 'Net water movement is out. The more concentrated outside solution draws water from the cell, so it shrinks.' : 'Net water movement is in. The more dilute outside solution supplies water to the cell, so it swells.'}</p>
      <small>Brown dots: outside solute. Dashed outline: starting size at concentration 50. Size changes are illustrative.</small>
    </>}
    {mode === 'Cell Division' && <>
      <div className="flex flex-wrap items-center gap-3"><button className={pill} disabled={!stage} onClick={() => onControl('mitosisStage',stage-1)}>Previous step</button>
        <strong>{stage+1}/6 · {steps[stage][0]}</strong><button className={pill} disabled={stage===5} onClick={() => onControl('mitosisStage',stage+1)}>Next step</button></div>
      <svg viewBox="0 0 400 200" className="mx-auto w-full max-w-xl" aria-label={steps[stage][0]}>
        {(stage===5 ? [112,288] : [200]).map(x => <ellipse key={x} cx={x} cy="100" rx={stage===5 ? 78 : 156} ry="76" fill="#fef9c3" stroke="#ca8a04"/>)}
        {(stage>=4 ? [stage===5?112:132,stage===5?288:268] : stage===0 ? [200] : []).map(x => <circle key={x} cx={x} cy="100" r="42" fill="#ede9fe" stroke="#a78bfa"/>)}
        {['#7c3aed','#0284c7'].map((color,i) => <g key={color} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
          {(stage<3 ? [stage===2 ? 200 : 180+i*40] : [stage===5?112:132,stage===5?288:268]).map(x => <path key={x} transform={`translate(${x},${80+i*40})`}
            d={stage===0 ? 'M-12 0 q6 -16 13 0 t13 0' : stage<=2 ? 'M-8 -12 L8 12 M8 -12 L-8 12' : 'M8 -9 L0 0 L8 9'}/>)}</g>)}
      </svg><p aria-live="polite">{steps[stage][1]}</p>
    </>}
    {mode === 'Size Scale' && <>
      <div className="flex flex-wrap gap-4"><label>Specimen <select value={specimen} onChange={e => {const i=+e.target.value; setSpecimen(i); setZoom([1,4,16,0.0625][i]);}}>
        {specimens.map(([n],i) => <option key={n} value={i}>{n}</option>)}</select></label>
        <label>Zoom <select value={zoom} onChange={e => setZoom(+e.target.value)}>{[0.0625,1,4,16].map(z => <option key={z} value={z}>{z}×</option>)}</select></label></div>
      <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-xl" aria-label="Scaled specimen and ruler">
        <rect width="360" height="200" fill="#fafaf9"/><circle cx="180" cy="92" r={diameter*180/field} fill={['#bbf7d0','#fecdd3','#ddd6fe','#fde68a'][specimen]} stroke="#57534e"/>
        <path d={`M18 173 v6 h${scaleBar*360/field} v-6`} fill="none" stroke="#292524" strokeWidth="2"/>
        <text x="18" y="196" fontSize="12">{scaleBar} µm</text>
      </svg><p aria-live="polite">{name}: about <strong>{diameter} µm</strong> across. The field is {field} µm wide. {diameter>field ? 'Zoom out to see the whole specimen.' : 'Increasing zoom changes the field of view, not the specimen’s diameter.'}</p>
    </>}
  </section>;
}
