import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { RenderDimension } from '../types/visualizer';
import { SpatialLesson } from './SpatialLesson';
import { bookVisual } from '../simulations/bookVisuals';
import { topicStories } from '../simulations/topicStories';
import { TopicScene } from './TopicScene';
import { OrbitLesson } from './OrbitLesson';
import { lessonModels } from './models/registry';

// All positions and captions are sampled from the same clock, including after a seek.
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const limit = (x: number) => Math.max(0, Math.min(1, x));
const dot = (x:number,y:number,r:number,fill='#7c3aed') => <circle cx={x} cy={y} r={r} fill={fill}/>;
const line = (x:number,y:number,xx:number,yy:number,color='#78716c',width=3) => <line x1={x} y1={y} x2={xx} y2={yy} stroke={color} strokeWidth={width} strokeLinecap="round"/>;
const label = (x:number,y:number,text:string) => <text x={x} y={y} textAnchor="middle" fontSize="13" fill="#44403c">{text}</text>;
const many = (n:number, draw:(i:number)=>ReactNode) => Array.from({length:n},(_,i)=><g key={i}>{draw(i)}</g>);
type Film = { title:string; captions:string[]; draw:(p:number)=>ReactNode };
const films: Record<string,Film> = {
  'cell-structure': {
    title:'Inside a cell: follow the instructions for a protein',
    captions:['Inside the nucleus, the cell makes a messenger RNA copy of instructions stored in DNA. Watch the orange strand form.', 'DNA stays in the nucleus. The orange messenger RNA leaves through a nuclear pore and reaches a ribosome in the cytoplasm.', 'The ribosome reads the message and joins amino acids. The growing green chain will fold into a protein.'],
    draw:p=>{
      const q=limit(p*3-1), length=1+Math.floor(limit(p*3)*7);
      return <><ellipse cx="220" cy="111" rx="164" ry="83" fill="#f0fdf4" stroke="#15803d" strokeWidth="3"/>
        <ellipse cx="136" cy="106" rx="38" ry="33" fill="#ddd6fe" stroke="#7c3aed"/>
        <path d="M110 96q6 -9 12 0t12 0t12 0" fill="none" stroke="#7c3aed" strokeWidth="3"/>
        <ellipse cx="266" cy="112" rx="16" ry="12" fill="#bae6fd" stroke="#0284c7"/>
        {many(length,i=>dot(129+114*q+i*3.3,105+3*Math.sin(i+p*18),3,'#f59e0b'))}
        {many(Math.floor(limit(p*3-2)*11),i=>dot(278+i*5,109-8*Math.sin(i*.6+p*8),4,'#059669'))}
        {label(136,157,'Nucleus')}{label(266,147,'Ribosome')}{label(220,21,'Cell membrane')}{label(215,178,'Cytoplasm')}</>;
    },
  },
  'cell-size': {
    title:'Estimate the size of a cell',
    captions:['The width of this microscope field is 200 µm. Use it as a ruler.', 'Trace across the field: about four cells of equal width fit side by side.', 'Divide the field width by four. One cell is about 50 µm wide.'],
    draw:p=>{
      const count=limit(3*p-1)*4;
      return <>{many(4,i=><g><rect x={60+80*i} y="76" width="80" height="60" rx="14" fill={count>=i+1?'#bbf7d0':'#ecfdf5'} stroke="#059669"/>{dot(100+80*i,106,8,'#a78bfa')}{count>=i+1 && label(100+80*i,156,String(i+1))}</g>)}
        {line(60,61,380,61)}{line(60,56,60,66)}{line(380,56,380,66)}{label(220,46,'Field width: 200 µm')}
        {line(60,140,60+count*80,140,'#7c3aed')}{p>=2/3 && label(220,195,'200 µm ÷ 4 cells = 50 µm per cell')}</>;
    },
  },
  'cell-explorer': {
    title:'Follow two chromosomes through cell division',
    captions:['Before division, DNA is copied. Each colour tracks one chromosome.', 'The copied chromosomes condense and line up in the middle of the cell.', 'Sister chromatids separate. One copy of each colour moves to each end.', 'Two nuclei form and the cell pinches apart. Each daughter inherits both colours.'],
    draw:p=>{
      const split=limit((p-.5)*4), pinch=limit((p-.75)*5), align=limit((p-.25)*4);
      return <>{[-1,1].map(side=><ellipse key={side} cx={220+side*pinch*73} cy="106" rx={145-pinch*78} ry="65" fill="#fef3c7" stroke="#ca8a04"/>)}
        {many(2,i=><>{[-1,1].map(side=><path key={side} transform={`translate(${220+(i?26:-26)*(1-align)+side*(3+split*68)},${86+i*38})`} d={`M${side*8} -12 Q${-side*8} 0 ${side*8} 12`} fill="none" stroke={i?'#0284c7':'#7c3aed'} strokeWidth={4} opacity={side===1?.15+.85*limit(p*5):1}/>)}</>)}
        {pinch>0 && [-1,1].map(s=><ellipse key={s} cx={220+s*71} cy="104" rx="28" ry="39" stroke="#a78bfa" fill="none" opacity={pinch}/>)}
        {label(220,202,p<.5?'One parent cell':p<.85?'Matching copies move apart':'Two daughter cells')}</>;
    },
  },
  'pendulum-projectile': {
    title:'What changes when the string is cut?',
    captions:['Gravity speeds the bob up as it swings down.', 'At the bottom the string is cut. The bob keeps its sideways velocity.', 'Gravity bends the path downward until the bob reaches the ground.'],
    draw:p=>{const u=limit(p*3), a=-1.05*Math.cos(u*Math.PI/2), f=limit((p-1/3)*1.65);
      const x=175+94*Math.sin(a)+150*f, y=22+94*Math.cos(a)+68*f*f;
      return <>{line(30,191,410,191)}{dot(175,22,5,'#57534e')}{p<1/3?line(175,22,x,y):<path d={`M175 116 Q${175+75*f} 116 ${x} ${y}`} stroke="#d97706" fill="none" strokeDasharray="4 3"/>}{dot(x,y,8)}{label(217,212,p<1/3?'String pulls toward the pivot':'String tension = 0')}</>;},
  },
  'motion-graphs': {
    title:'Watch distance build a position–time graph',
    captions:['The cart starts from rest. Its dot starts at the origin.', 'Equal time intervals now carry the accelerating cart farther.', 'The graph gets steeper: its slope tells you the cart is moving faster.'],
    draw:p=><>{line(48,42,392,42)}{dot(48+344*p*p,36,9)}{line(48,178,392,178)}{line(48,178,48,65)}<path d={`M48 178 Q${48+172*p} 178 ${48+344*p} ${178-104*p*p}`} stroke="#7c3aed" fill="none" strokeWidth="3"/>{dot(48+344*p,178-104*p*p,5)}{label(98,78,'Position (m)')}{label(220,208,'Time (s) →')}</>,
  },
  'forces-newton': {
    title:'From balanced forces to acceleration',
    captions:['A small push is balanced by static friction. The crate stays still.', 'The push increases past the limit of static friction. The crate starts moving.', 'The push exceeds sliding friction. The net force makes the crate speed up.'],
    draw:p=>{const q=limit((p-1/3)*1.5), x=122+165*q*q, push=34+45*limit(q*5);
      return <>{line(24,149,416,149)}<rect x={x-23} y="101" width="46" height="46" rx="5" fill="#fde68a"/>
        {line(x+23,118,x+23+push,118,'#7c3aed')}{label(x+23+push,121,'▶')}{label(x+45,99,'Push')}
        {line(x-23,129,x-57,129,'#be123c')}{label(x-57,133,'◀')}{label(x-58,161,'Friction')}{label(220,203,q===0?'Net force = 0':'Net force points right →')}</>;},
  },
  'work-energy': {
    title:'Lift the same load on two ramps',
    captions:['Compare the two routes. Both lift the same load to the same height.', 'The gentler ramp needs less force, but the load travels farther.', 'Both loads gain the same gravitational potential energy. Without friction, the work is the same.'],
    draw:p=><>{many(2,i=>{const x=24+i*222, w=i?92:178, q=limit((p-.08)/.82);return <><path d={`M${x} 161 h${w} v-85 Z`} fill="#ede9fe" stroke="#a78bfa"/>{dot(x+w*q,154-85*q,8,'#d97706')}{label(x+w/2,185,i?'Steeper · more force':'Gentler · less force')}</>;})}</>,
  },
  'bohr-atom': {
    title:'Build a neutral carbon atom',
    captions:['Carbon has six protons in its nucleus. A neutral atom needs six electrons.', 'Place two electrons in the first shell. This inner shell is now full.', 'The other four occupy the second shell. Carbon has four outer electrons.'],
    draw:p=><>{many(2,i=><circle cx="220" cy="104" r={42+40*i} fill="none" stroke="#94a3b8"/>)}{dot(220,104,20,'#fb7185')}{label(220,109,'6 p⁺')}{many(6,i=>{const q=limit((p-.22-i*.10)*8), r=i<2?42:82, a=i*Math.PI/(i<2?1:2)+p*.8;return q>0 && dot(lerp(392,220+r*Math.cos(a),q),lerp(36,104+r*Math.sin(a),q),6,'#0284c7');})}{label(220,210,'Shell model · blue dots represent electrons')}</>,
  },
  'sound-waves': {
    title:'Follow the disturbance, not just one particle',
    captions:['A vibrating source nudges nearby air particles back and forth.', 'Crowded bands are compressions; spread-out bands are rarefactions.', 'The bands travel right. The marked particle only oscillates around its starting position.'],
    draw:p=><>{many(24,i=>many(4,j=>dot(35+16*i+9*Math.sin(i*.55-p*20),65+j*18,3.5,i===11?'#be123c':'#0284c7')))}{line(211,144,211,154,'#be123c')}{label(211,174,'Marked particle’s rest position')}{label(220,203,'Direction of wave travel →')}</>,
  },
  'scientific-inquiry': {
    title:'Change one variable and compare the evidence',
    captions:['Release a marble from rest. Measure how long it takes to reach the bottom.', 'Repeat on the same ramp surface and at the same angle, but increase the distance.', 'The second run takes longer. Holding the other conditions constant makes the comparison meaningful.'],
    draw:p=><>{many(2,i=>{const q=limit((p-i*.35)/(i?.47:.33)), x=48+i*194,w=i?146:73,h=w*.55;return <>{line(x,152-h,x+w,152)}{dot(x+w*q*q,145-h+h*q*q,7,'#d97706')}{label(x+w/2,178,i?'Longer path':'Shorter path')}{label(x+w/2,199,q===1?'Reached bottom':'Released from rest')}</>;})}</>,
  },
  'tissues-joints': {
    title:'How a muscle bends the elbow',
    captions:['The upper arm stays still. The forearm can rotate about its hinge joint.', 'The biceps shortens, pulling its attachment on the forearm toward the shoulder.', 'As the elbow bends, the forearm rises. Muscles pull on bones through tendons.'],
    draw:p=>{const a=.2+1.88*limit((p-.13)/.77), x=220+132*Math.cos(a), y=166-132*Math.sin(a);
      return <>{line(144,52,220,166,'#c6b89f',12)}{line(220,166,x,y,'#c6b89f',12)}{line(148,57,220+36*Math.cos(a),166-36*Math.sin(a),'#fb7185',10)}{dot(220,166,9,'#a78bfa')}{label(112,92,'Biceps')}{label(220,194,'Elbow hinge')}{label(x,y-13,'Forearm')}</>;},
  },
  'mixtures-lab': {
    title:'Watch a spot of ink separate on paper',
    captions:['A spot of mixed ink sits above the solvent. The solvent soaks up the paper.', 'Each dye moves with the solvent, but some are held more strongly by the paper.', 'The original spot separates into bands. The fastest dye is nearest the solvent front.'],
    draw:p=><><rect x="158" y="13" width="108" height="178" fill="#fffbeb" stroke="#d6d3d1"/><rect x="159" y={176-148*p} width="106" height={15+148*p} fill="#e0f2fe"/>{line(158,176-148*p,266,176-148*p,'#38bdf8')}{label(328,179-148*p,'Solvent front')}{many(3,i=><ellipse cx="212" cy={167-(32+i*42)*p} rx="15" ry="5" fill={['#d97706','#e11d48','#7c3aed'][i]}/>)}{label(212,211,'Ink on chromatography paper')}</>,
  },
  'reproduction-life': {
    title:'From pollen grain to fertilisation',
    captions:['A pollen grain moves from the anther to the stigma of a flower.', 'A tube grows from the pollen grain down the style toward an ovule.', 'A male gamete travels through the tube and fuses with the egg. The fertilised ovule can develop into a seed.'],
    draw:p=>{const q=limit(p*3), tube=limit(p*3-1), travel=limit(p*3-2);return <>{line(118,164,118,72,'#65a30d',7)}{dot(118,66,11,'#ca8a04')}{line(260,53,260,147,'#86efac',16)}{dot(260,155,30,'#86efac')}{dot(260,155,9,'#fff')}{line(260,53,260,53+102*tube,'#a78bfa',3)}{dot(lerp(118,260,q),lerp(62,53,q)-30*Math.sin(q*Math.PI),6,'#f59e0b')}{travel>0 && dot(260,53+102*travel,4)}{label(118,190,'Anther')}{label(307,49,'Stigma')}{label(315,159,'Ovule')}</>;},
  },
  'biodiversity-tree': {
    title:'Classify a mango tree by narrowing the group',
    captions:['Start with Plantae: mango, pine and fern are all plants.', 'Look for flowering plants. Mango belongs in this group; pine and fern do not.', 'Narrow the group to genus Mangifera, then species Mangifera indica. The scientific name identifies the species.'],
    draw:p=><>{many(3,i=>{const q=limit((p-i*.32)*3.15), y=48+i*65;return <g opacity={.22+.78*q}>{i>0 && line(220,y-42,220,y-18,'#059669')}<rect x={65+i*18} y={y-19} width={310-i*36} height="38" rx="15" fill={['#dcfce7','#ccfbf1','#ede9fe'][i]}/>{label(220,y+4,['Plants: fern · pine · mango','Flowering plants: mango','Mangifera indica'][i])}</g>;})}{dot(46+42*p,48+130*p,5,'#059669')}</>,
  },
  'earth-system': {
    title:'Follow water from sea to cloud to land',
    captions:['Sunlight warms the sea. Some liquid water evaporates and rises as invisible vapour.', 'As moist air cools, water condenses into tiny droplets that form a cloud.', 'Water falls as rain. Runoff flows downhill and returns water to the sea.'],
    draw:p=>{const points=[[90,166],[180,63],[300,63],[313,132],[90,166]], n=Math.min(3,Math.floor(p*4)), q=p*4-n;
      return <>{dot(63,42,18,'#facc15')}<path d="M0 170 H150 L322 121 L440 165 V204 H0 Z" fill="#bbf7d0"/><path d="M0 166 H155 L118 204 H0 Z" fill="#7dd3fc"/>{many(4,i=>dot(175+i*38,59,23,'#dbeafe'))}{dot(lerp(points[n][0],points[n+1][0],q),lerp(points[n][1],points[n+1][1],q),7,'#0369a1')}{label(220,216,'Blue marker tracks water, not a visible vapour droplet')}</>;},
  },
};

export function topicFilmId(labId: string | null, number: string) {
  const section = bookVisual(labId, number);
  if (section) return section.film;
  if (labId !== 'cell-explorer') return undefined;
  if (['2.2','2.3','2.3.1'].includes(number)) return 'cell-structure';
  if (['Activity 2.1', '2.1'].includes(number)) return 'cell-size';
  if (['2.4', '2.4.1', 'Activity 2.5'].includes(number)) return 'cell-explorer';
  return undefined;
}

export function LabFilm({id,dimension,onExplore}:{id:string;dimension:RenderDimension;onExplore:()=>void}) {
  const number=id.startsWith('topic:')?id.slice(6):'';
  const story=topicStories[number];
  const film=story??explorerModels[id]??films[id];
  const duration=film.captions.length*5;
  const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [time,setTime]=useState(0);
  const clock=useRef(0);
  useEffect(()=>{
    if(!playing) return;
    let last=performance.now(), frame=0;
    const tick=(now:number)=>{
      clock.current=Math.min(duration,clock.current+Math.min(now-last,100)/1000);
      last=now; setTime(clock.current);
      if(clock.current>=duration) setPlaying(false); else frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
  },[playing,duration]);
  function seek(t:number){clock.current=t;setTime(t);}
  const index=Math.min(film.captions.length-1,Math.floor(time/5));
  return <section aria-label="Animated lesson" className="m-auto w-full max-w-4xl rounded-3xl border border-stone-200 bg-white p-5 sm:p-7">
    <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Watch the science</p>
    <h3 className="mt-1 text-xl font-semibold">{film.title}</h3>
    {dimension==='3d' && lessonModels[id] ? <OrbitLesson id={id} title={film.title} p={time/duration}/> :
      story ? <TopicScene story={story} number={number} p={time/duration} flat/> :
      <SpatialLesson id={id} p={time/duration} title={film.title} flat/>}
    <p aria-live="polite" className="min-h-12 text-sm leading-relaxed"><strong className="mr-2 text-violet-800">{index+1}/{film.captions.length}</strong>{film.captions[index]}</p>
    <input aria-label="Lesson timeline" className="my-3 w-full accent-violet-600" type="range" min="0" max={duration} step=".05" value={time} onChange={e=>seek(+e.target.value)}/>
    <div className="flex flex-wrap gap-3 text-sm"><button className="rounded-full bg-violet-100 px-3 py-1" onClick={()=>{if(time>=duration)seek(0);setPlaying(!playing);}}>{playing?'Pause':'Play'}</button>
      <button onClick={()=>{seek(0);setPlaying(true);}}>Replay</button><button className="ml-auto text-violet-800" onClick={onExplore}>Explore the lab →</button></div>
  </section>;
}

const explorerModels:Record<string,{title:string;captions:string[]}> = {
  'topic:5.3.2':{title:'Distillation apparatus',captions:['Follow the vapour from the flask into the condenser.','The cooled vapour condenses and collects as liquid in the receiver.']},
  'topic:5.2.3':{title:'Solubility of a substance',captions:['Watch the solid in contact with the solvent.','At saturation, extra solute can remain undissolved.']},
  'topic:5.5':{title:'Light scattering in a colloid',captions:['Look along the path of the incident light.','Scattering by dispersed particles makes the beam visible from the side.']},
  'topic:2.2.2':{title:'Inspect the plant cell wall',captions:['Orbit the cell to see its outer wall.','The wall surrounds the cell membrane and provides structural support.']},
  'topic:11.2.1':{title:'Meiosis and variation',captions:['Follow the homologous chromosomes.','Their separation distributes different combinations to the resulting cells.']},
};
