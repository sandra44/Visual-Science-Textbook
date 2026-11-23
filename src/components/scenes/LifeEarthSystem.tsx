import { useId, type ReactNode } from 'react';
import type { LifeEarthProps } from './LifeEarth';

type Film = {p:number; flat:boolean; id:string};
const span = (p:number, from:number, to:number) => Math.min(1, Math.max(0, (p-from)/(to-from)));
const sky = '#e8f4f4', sea = '#82c3cc', land = '#c3a16e', warm = '#b9412c', cool = '#17627c', gold = '#c28311';
const fill = (film:Film, material:'sky'|'water'|'dirt'|'ocean') =>
  film.flat ? {sky,water:sea,dirt:land,ocean:'#79b5c8'}[material] : `url(#${film.id}-${material})`;

function Paint({id}: {id:string}) {
  return <defs>{([
    ['sky','#d1e9ed','#faf6e4'],['water','#a3d8d9','#458795'],
    ['dirt','#daba91','#967453'],['ocean','#b7e0df','#488ba7'],
  ] as const).map(([name,from,to])=><linearGradient key={name} id={`${id}-${name}`} x2={name==='ocean'?'.8':'0'} y2="1">
    <stop stopColor={from}/><stop offset="1" stopColor={to}/>
  </linearGradient>)}</defs>;
}
function Note({x,y,children,anchor='middle',size=13}:{x:number;y:number;children:ReactNode;anchor?:'start'|'middle'|'end';size?:number}) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="600" fill="#233b3e" stroke="#faf8ed" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round">{children}</text>;
}
function Curve({d,c,t,width=3}:{d:string;c:string;t:number;width?:number}) {
  return <path d={d} fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1 2" strokeDashoffset={1-Math.max(0,Math.min(1,t))} opacity={t<=0?0:1}/>;
}
function Head({x,y,angle,c,show}:{x:number;y:number;angle:number;c:string;show:number}){
  return <path transform={`translate(${x} ${y}) rotate(${angle})`} d="M-8 -4L0 0l-8 4" fill="none" stroke={c} strokeWidth="2.8" strokeLinejoin="round" opacity={show}/>;
}
function Sun({x,y,r=15}:{x:number;y:number;r?:number}) {
  return <g transform={`translate(${x} ${y})`}><circle r={r} fill="#f3cc66" stroke="#ce9e3f" strokeWidth="1.4"/>
    {Array.from({length:10},(_,i)=><path key={i} transform={`rotate(${36*i})`} d={`M${r+4} 0h4`} fill="none" stroke="#d2a441" strokeWidth="2" strokeLinecap="round"/>)}</g>;
}
function Tree({x,y,s=1}:{x:number;y:number;s?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-3 0l1-25-9-8 3-1 7 5 7-12 3 2-7 16 2 23Z" fill="#76553e"/>
    <path d="M-14-28q-10-2-7-11 0-8 9-9 2-10 13-8 8-5 14 4 11 1 11 11 6 10-5 15-9 4-16-1-10 5-19-1Z" fill="#54816b" stroke="#365e54" strokeWidth="1.4"/>
    <path d="M-18-39q3-8 12-5 2-9 13-7" fill="none" stroke="#83a586" strokeWidth="3"/></g>;
}
function Fish({x,y,s=1}:{x:number;y:number;s?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-13 0q12-12 25-2l9-5-2 11-7-4Q0 11-13 0Z" fill="#cfac74" stroke="#60594b" strokeWidth="1.5"/><circle cx="-6" cy="-1" r="1.4" fill="#233b3e"/></g>;
}
function Coast({f}:{f:Film}){
  return <g><rect width="480" height="220" fill={fill(f,'sky')}/>
    {!f.flat&&<path d="M0 123Q66 89 126 111T228 126Q303 109 364 129H480V152H0Z" fill="#b8c9b7"/>}
    <path d="M0 150Q60 136 116 141T222 152Q253 184 306 192L480 204V220H0Z" fill={fill(f,'dirt')}/>
    <path d="M0 149Q71 134 120 141T219 150" stroke="#78855b" fill="none" strokeWidth="5"/>
    <path d="M222 152Q265 150 320 152T480 152V204L306 192Q255 182 222 152Z" fill={fill(f,'water')}/>
    {[0,1,2,3].map(i=><path key={i} d={`M${260+i*51} ${157+i%2*6}q8 2 23 0`} fill="none" stroke="#d3e8df" strokeWidth="2"/>)}
    <Tree x={24} y={146} s={.58}/><Tree x={49} y={141} s={.4}/>
  </g>;
}
function Thermometer({x,rise}:{x:number;rise:number}){
  return <g transform={`translate(${x} 141)`}>
    <path d="M-4-12v-56a4 4 0 0 1 8 0v56a8 8 0 1 1-8 0Z" fill="#fffcf1" stroke="#597275" strokeWidth="1.5"/>
    <path d={`M0-7v${-14-rise}`} stroke={warm} strokeWidth="4" strokeLinecap="round"/>
    <circle cy="-5" r="5.5" fill={warm}/>
  </g>;
}
function ShoreHeat({f,breeze}:{f:Film;breeze:boolean}) {
  const {p}=f,t=span(p,.26,.7),u=span(p,.48,1);
  return <g><Coast f={f}/><Sun x={breeze?62:224} y={35}/>
    {breeze?<><Curve d="M132 130C112 106 118 74 137 57" c={warm} t={.12+.88*t} width={5}/>
      <Head x={137} y={57} angle={-40} c={warm} show={span(t,.84,1)}/>
      <Curve d="M145 52Q229 23 311 62" c="#978874" t={span(p,.44,.83)} />
      <Curve d="M367 124Q281 140 151 130" c={cool} t={u} width={5}/><Head x={151} y={130} angle={185} c={cool} show={span(u,.85,1)}/>
      <Note x={112} y={36}>Warm air rises</Note><Note x={352} y={104}>Cool sea air moves inland</Note>
      <Note x={121} y={182}>Sun-warmed shore</Note><Note x={367} y={187}>Cooler water</Note></>
    :<>{[109,326].map(x=><g key={x}>{[0,1,2].map(i=><Curve key={i} d={`M${x-45+i*12} 39l47 87`} c="#dfb94f" t={.18+.82*span(p,0,.48)} width={2.5}/>)}</g>)}
      <Thermometer x={152} rise={42*p}/><Thermometer x={366} rise={16*p}/>
      <Note x={240} y={71}>Equal sunlight</Note><Note x={116} y={184}>Land warms faster</Note><Note x={356} y={186}>Water warms more slowly</Note></>}
  </g>;
}
function Solar({f,albedo,infrared}:{f:Film;albedo?:boolean;infrared?:boolean}) {
  const {p}=f, incident=span(p,0,.4), reflected=span(p,.3,.78), heat=span(p,.45,1);
  return <g><rect width="480" height="220" fill={fill(f,'sky')}/>
    {infrared&&<path d="M0 34Q238 14 480 34v38Q235 55 0 71Z" fill="#9ed4d5" opacity=".55"/>}
    <path d="M0 157Q76 144 145 155T287 158Q367 145 480 158V220H0Z" fill={fill(f,'dirt')}/>
    {albedo&&<path d="M0 157Q76 139 149 150T233 158l-23 9-45-4-27 7-39-9-49 9-50-5Z" fill="#fcfffa" stroke="#8cb3b6"/>}
    <Sun x={albedo?41:73} y={28}/>
    {(albedo?[109,322]:[184]).map((x,i)=><g key={x}>
      {[0,1,2].map(j=><Curve key={j} d={`M${x-65+j*8} 53l65 99`} c="#d9a735" t={.12+.88*incident} width={3}/>)}
      {!infrared&&Array.from({length:albedo&&!i?3:1},(_,j)=><g key={j}><Curve d={`M${x+9*j} 152l65 -96`} c={gold} t={reflected} width={albedo&&i?1.6:3}/><Head x={x+9*j+65} y={56} angle={-56} c={gold} show={span(reflected,.9,1)}/></g>)}
      {(!albedo||i===1)&&<ellipse cx={x+8} cy={159} rx={19+14*heat} ry={3+5*heat} fill="#db743a" opacity={.52*heat}/>}
    </g>)}
    {albedo?<><Note x={128} y={195}>Snow: more reflected</Note><Note x={359} y={195}>Dark soil: more absorbed</Note></>
    :infrared?<><Curve d="M196 148q11-8 7-16t9-18 8-17 9-19 7-19" c={warm} t={span(p,.28,.68)} width={3.5}/>
      <g transform="translate(240 52) rotate(-16)"><path d="M-12 0h24" stroke="#596966" strokeWidth="4"/>{[-12,0,12].map((x,i)=><circle key={x} cx={x} r={i===1?6:5} fill={i===1?'#485a5f':'#be634e'}/>)}</g>
      <Curve d="M255 57q12 4 12 14t13 13 12 16 13 12 11 16 13 14" c={warm} t={heat}/>
      <Curve d="M257 49q9-2 12-10t13-11 13-10" c={warm} t={heat}/>
      <Note x={371} y={51}>Greenhouse gas</Note><Note x={358} y={117}>Re-emitted infrared</Note><Note x={179} y={191}>Warmed surface emits infrared</Note></>
    :<><Note x={86} y={89}>Sunlight</Note><Note x={322} y={75}>Reflected to space</Note><Note x={232} y={194}>Absorbed energy warms soil</Note></>}
  </g>;
}
function MountainLake({f}:{f:Film}) {
  const {p}=f,t=span(p,.18,.8),dry=span(p,.48,1),waterY=141+22*t;
  return <g><rect width="480" height="220" fill={fill(f,'sky')}/>
    {!f.flat&&<path d="M0 122L67 66l44 43 58-62 83 75 77-43 65 46 86-38v71H0Z" fill="#acc7c4"/>}
    <path d="M0 135L103 29l28 24 14-9 92 108 64-26 85 39 94-23v78H0Z" fill="#8b9c87"/>
    <path d={`M${46+35*t} ${88-36*t}l${57-35*t} ${-59+36*t} 28 24 14-9 ${36-20*t} ${43-24*t} -26 -10 -12 6 -15 -15 -14 10 -10 -12Z`} fill="#fffdf1"/>
    <path d="M115 76q11 17 21 23t16 21q7 11 27 17l17 11" stroke="#a4d6d6" strokeWidth={8-5*t} fill="none"/>
    <path d="M0 149q53-15 111-11 51 5 91 29 47 21 151 0l127-33v86H0Z" fill={fill(f,'dirt')}/>
    <path d={`M${157+38*t} ${waterY}q50 2 87 -2t${117-38*t} 0q-52 ${39-29*t} -102 ${39-29*t}t-${102-38*t} -${37-29*t}Z`} fill={fill(f,'water')}/>
    {Array.from({length:17},(_,i)=><g key={i} transform={`translate(${285+10*i} ${194-i*1.8}) scale(1 ${1-.48*dry})`} stroke={i%3===0&&dry>.4?'#ab8b49':'#678855'} fill="none" strokeWidth="2.2"><path d="M0 0q-1-9-6-15M0 0q1-12 6-18M0 0q-1-8 1-21"/></g>)}
    <Note x={100} y={18}>Winter snowpack</Note><Note x={227} y={126}>Summer meltwater</Note><Note x={380} y={211}>Lakeside grasses</Note>
  </g>;
}
function Globe({f,x=240,y=113,r=81}:{f:Film;x?:number;y?:number;r?:number}) {
  const clip=`${f.id}-globe`;
  return <g transform={`translate(${x} ${y}) scale(${r/80})`}><defs><clipPath id={clip}><circle r="80"/></clipPath></defs>
    <circle r="80" fill={fill(f,'ocean')} stroke="#55818e" strokeWidth="1.7"/>
    <g clipPath={`url(#${clip})`}><g fill="#8baf87" stroke="#719578" strokeWidth="1">
      <path d="M-88-54l25-16 20 3 13 15-6 9-10 1-4 15-12 4 6 15-7-3-12-17-15-6ZM-52-4l22 4 16 13-7 18-11 11-8 22-10-17 1-20-8-19Z"/>
      <path d="M8-50l10-10 18 1 16-11 39 16-1 32-13 8-16-11-7 13-11-17-18-2-12-7-14 3Z M0-29l16-7 19 8 10 13-5 15-9 9-4 15-10 9-6-11-4-17-9-10Z"/>
    </g>{[-50,0,50].map(a=><path key={a} d={`M-80 ${a}q80 8 160 0`} fill="none" stroke="#eef5e8" strokeDasharray="3 4" opacity=".65"/>)}
    </g></g>;
}
function Latitude({f}:{f:Film}){
  const {p}=f;return <g><rect width="480" height="220" fill={fill(f,'sky')}/><Globe f={f} x={299} y={128} r={86}/>
    {/* Identical horizontal beam widths; intersections lie on the same circular limb. */}
    {[{y:43,x:286,y2:56,x2:252},{y:116,x:214,y2:129,x2:213}].map(({y,x,y2,x2},i)=>{
      const t=i?span(p,0,.5):span(p,.33,.98);
      return <g key={y}><path d={`M57 ${y}H${x}L${x2} ${y2}H57Z`} fill="#f2cd62" opacity={.25+.44*t}/>
        <path d={`M57 ${y}H${x}M57 ${y2}H${x2}`} stroke="#b68e30" fill="none"/>
        <path d={`M${x} ${y}A86 86 0 0 0 ${x2} ${y2}`} stroke={warm} strokeWidth={3+2*t} fill="none"/>
        <path d={`M${64+(x2-75)*t} ${y+3}l5 3-5 3`} stroke="#9a6819" strokeWidth="2" fill="none"/></g>;
    })}<Note x={145} y={31}>Toward the pole</Note><Note x={140} y={105}>Near the equator</Note><Note x={103} y={171}>Equal-width beams</Note>
    <Note x={368} y={26}>Wider footprint</Note><Note x={318} y={154}>Shorter footprint</Note></g>;
}
function PlanetWind({f}:{f:Film}){
  const {p}=f;return <g><rect width="480" height="220" fill={fill(f,'sky')}/><Globe f={f} x={203} y={110} r={90}/>
    <path d="M114 110q89 9 178 0" fill="none" stroke="#d87847" strokeWidth={3+5*span(p,0,.45)} opacity=".85"/>
    <path d="M126 66q78 6 154 0M126 154q78 6 154 0" fill="none" stroke="#455c87" strokeWidth="2" strokeDasharray="5 4"/>
    {[158,199,240].map(x=><g key={x}>{[1,-1].map(sign=><g key={sign}>
      <Curve d={`M${x+13} ${110-42*sign}q-4 ${24*sign} -25 ${37*sign}`} c={cool} t={span(p,.25,.94)} width={3}/>
      <Head x={x-12} y={110-5*sign} angle={sign===1?148:-148} c={cool} show={span(p,.85,.95)}/></g>)}</g>)}
    <Note x={316} y={63} anchor="start">30° N: high pressure</Note><Note x={311} y={114} anchor="start">Equator: rising air</Note><Note x={316} y={161} anchor="start">30° S: high pressure</Note>
    <Note x={220} y={212}>Trade winds turn westward on their way to the equator.</Note>
  </g>;
}
function Current({f}:{f:Film}){
  const {p}=f;return <g><rect width="480" height="220" fill={fill(f,'ocean')}/>
    <g fill="#b1bf91" stroke="#6d916f" strokeWidth="1.5"><path d="M0 0h215l-47 22-5 14-24 12-23 29-20 12-7 31 10 20-11-2-15-23-30 8-9 27-34-3Z"/>
      <path d="M0 162l31-2 26 10 42 5 17 19 29 3 10 23H0Z"/><path d="M418 0h62v220h-51l9-35-22-20-25-13-8-19-18-17 12-34 21-17 29-3 8-16-14-6-8-17 12-7Z"/></g>
    <Curve d="M340 160Q244 167 148 155" c="#e4f7ed" t={.15+.85*span(p,0,.4)} width={5}/>
    <Head x={148} y={155} angle={185} c="#e4f7ed" show={span(p,.28,.4)}/>
    <Curve d="M126 154C90 144 95 117 110 103S144 70 171 64Q232 52 289 32" c="#f6ae53" t={span(p,.24,.95)} width={9}/>
    <Head x={289} y={32} angle={-18} c={warm} show={span(p,.86,.95)}/>
    <Note x={65} y={35}>North America</Note><Note x={379} y={121}>Atlantic Ocean</Note>
    <Note x={249} y={190}>Trade winds push surface water west</Note><Note x={225} y={90}>Warm Gulf Stream</Note><Note x={302} y={20}>Toward higher latitudes</Note>
  </g>;
}
function Circulation({f}:{f:Film}){
  const {p}=f;
  return <g><rect width="480" height="220" fill="#f8f5e9"/>
    <path d="M70 43v123q0 11 12 11h312q12 0 12-11V43" fill="none" stroke="#648087" strokeWidth="4"/>
    <path d="M73 61q45-5 84 0t87 0 86 0 73 0v105q0 8-10 8H82q-9 0-9-8Z" fill={fill(f,'water')}/>
    <path d="M80 166q1-51 27-92 8-14 43-10-21 23-26 52-2 26-20 51Z" fill="#e79e6d" opacity={.18+.55*p}/>
    <path d="M332 63q32 20 40 69l15 30-29-3q-8-41-40-81Z" fill="#497eaa" opacity={.17+.45*p}/>
    {[104,119,134].map(x=><path key={x} d={`M${x} 193q-4-4 0-8t0-8`} fill="none" stroke={warm} strokeWidth="2.5"/>)}
    <Curve d="M106 153Q101 112 132 77" c={warm} t={.08+.92*span(p,0,.58)} width={4}/>
    <Head x={132} y={77} angle={-52} c={warm} show={span(p,.48,.58)}/>
    <Curve d="M149 74Q242 64 324 77Q357 90 370 142" c={cool} t={span(p,.22,.8)} width={3.5}/>
    <Head x={370} y={142} angle={75} c={cool} show={span(p,.72,.8)}/>
    <Curve d="M354 154Q260 170 138 154" c={cool} t={span(p,.6,1)} width={3.5}/><Head x={138} y={154} angle={187} c={cool} show={span(p,.94,1)}/>
    <Note x={124} y={32}>Warmer water rises</Note><Note x={345} y={32}>Cooler water sinks</Note><Note x={113} y={212}>Heat source</Note><Note x={291} y={208}>Circulation in water</Note>
  </g>;
}

function RootPlant({nodules=false}:{nodules?:boolean}) {
  return <g transform="translate(225 144)">
    <path d="M0 0q5-36-3-88m4 61-27-22m28 5 24-26" fill="none" stroke="#547b4d" strokeWidth="4"/>
    {[[-23,-47,-64],[24,-66,38],[-4,-82,-20],[2,-33,48]].map(([x,y,a],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d="M0 0Q-15-18 0-33Q17-16 0 0Z" fill={i%2?'#82a16a':'#669862'} stroke="#477a52" strokeWidth="1.3"/>
      <path d="M0-1v-28m0 18-5-6m5 1 5-6" stroke="#497a54" fill="none"/>
    </g>)}
    <g fill="none" stroke="#e8d2a9" strokeWidth="2"><path d="M0 0q1 14-6 27t-8 23M-3 13q-17 2-26 18l-16 8m43-20 23 14 21 5M-6 26l-16 14M10 27l1 15"/></g>
    {nodules&&[[-13,18],[-21,24],[-29,30],[9,26],[18,31]].map(([x,y])=><ellipse key={x} cx={x} cy={y} rx="4.6" ry="3.7" fill="#dda591" stroke="#875d50"/>)}
  </g>;
}
type CycleKind='water'|'carbon'|'nitrogen'|'oxygen';
function Matter({f,kind}:{f:Film;kind:CycleKind}){
  const {p}=f;
  const route: Record<CycleKind,readonly (readonly [number,number])[]>={
    water:[[93,174],[158,175],[221,157],[226,124],[222,82],[234,64],[274,46],[327,33]],
    carbon:[[106,57],[146,62],[192,76],[205,84],[223,101],[225,115],[253,87],[317,65]],
    nitrogen:[[86,56],[123,68],[154,101],[185,141],[205,169],[224,157],[228,120],[243,86]],
    oxygen:[[194,173],[221,155],[227,112],[206,84],[238,55],[294,60],[339,86],[387,111]]
  };
  const a=route[kind], k=Math.min(p*(a.length-1),a.length-1), i=Math.min(Math.floor(k),a.length-2), q=k-i;
  const px=a[i][0]*(1-q)+a[i+1][0]*q,py=a[i][1]*(1-q)+a[i+1][1]*q;
  return <g><rect width="480" height="220" fill={fill(f,'sky')}/>
    <path d="M0 142Q96 133 191 142T370 144q61-6 110-3v79H0Z" fill={fill(f,'dirt')}/>
    {kind==='water'&&<><path d="M17 164q29-17 55-8t65 6q40-9 72 4-40 8-68 6-36 13-69 6-26-8-55-4Z" fill={fill(f,'water')}/><Note x={77} y={201}>Soil water</Note><Note x={114} y={28}>Tracking oxygen in water</Note><Note x={331} y={24}>Water vapour</Note><Note x={323} y={112}>Leaves transpire</Note></>}
    {kind==='carbon'&&<><Sun x={49} y={83} r={12}/><Note x={104} y={39}>Air: CO₂</Note><Note x={217} y={209}>Plant tissue stores carbon</Note><Note x={359} y={47}>CO₂ from respiration</Note></>}
    {kind==='nitrogen'&&<><Note x={96} y={36}>Air: N₂</Note><Note x={120} y={199}>Fixation in root nodules</Note><Note x={329} y={79}>Plant proteins</Note></>}
    {kind==='oxygen'&&<><Note x={132} y={194}>Water in roots</Note><Note x={263} y={36}>O₂ released</Note>
      <path d="M343 112q-3-27 26-35 32-12 55 8 20 17 1 38-14 13-46 12-24 3-36-23Z" fill="#edcfb8" stroke="#ae8070" strokeWidth="2"/>
      <path d="M369 111q-4-12 13-16 19-4 26 6t-10 15q-21 6-29-5Z" fill="#d79575" stroke="#986952"/>
      <path d="M374 109q2-11 7-5t6 0 6-1 7 3" stroke="#915e46" fill="none" strokeWidth="2"/>
      <Note x={388} y={156}>Respiring cell</Note><Note x={384} y={182}>Oxygen becomes</Note><Note x={384} y={198}>part of water</Note></>}
    <RootPlant nodules={kind==='nitrogen'}/>
    <polyline points={a.slice(0,i+1).map(v=>v.join(',')).concat(`${px},${py}`).join(' ')} stroke={kind==='nitrogen'?'#735682':'#487a82'} strokeDasharray="3 4" fill="none" strokeWidth="2"/>
    <circle cx={px} cy={py} r="7" fill="#fff6c6" stroke="#996e28" strokeWidth="2"/>
    <text x={px} y={py+3.8} textAnchor="middle" fill="#523e24" fontSize="10" fontWeight="700">{kind==='carbon'?'C':kind==='nitrogen'?'N':'O'}</text>
  </g>;
}
function Erosion({f}:{f:Film}){
  const {p}=f, loss=span(p,.02,.45), run=span(p,.33,.8), silt=span(p,.52,1);
  return <g><rect width="480" height="220" fill={fill(f,'sky')}/>
    {!f.flat&&<path d="M0 76q55-48 114-26t117 27q91-41 160-17t89 10v77H0Z" fill="#b6c9b8"/>}
    <path d="M0 86Q108 76 185 119T288 168q98 19 192-3v55H0Z" fill={fill(f,'dirt')}/>
    <path d="M247 150q74-3 140 1t93-1v15q-92 24-192 3Z" fill={fill(f,'water')}/>
    <path d="M0 84q104-5 183 34" stroke="#75875b" strokeWidth={6-4*loss} fill="none"/>
    {[[23,84,.81],[68,87,.65],[103,93,.85],[139,102,.6],[173,114,.64]].map(([x,y,s],i)=><g key={x}>
      <path d={`M${x-3} ${y}l1-8 5 1 1 7Z`} fill="#775a3e"/>
      <g opacity={i===0?1:1-loss}><Tree x={x} y={y} s={s}/></g></g>)}
    {[0,1,2,3].map(i=><Curve key={i} d={`M${63+i*13} ${84+i*2}q36 5 76 28t${106-i*13} ${43-i*2}`} t={run} c="#6c8a87" width={2}/>)}
    <path d={`M249 150q${30+142*silt} 0 ${41+143*silt} 6-64 12-${41+143*silt} -6Z`} fill="#ad8a59" opacity={silt*.78}/>
    <Fish x={344+74*silt} y={162} s={.66}/>
    <Note x={94} y={20}>Forest cover</Note><Note x={201} y={86}>Soil washed downslope</Note><Note x={376} y={203}>Sediment enters stream</Note>
  </g>;
}
export default function EarthSystem({number,p,flat}:LifeEarthProps){
  const id=useId();
  const f={p:Math.max(0,Math.min(1,p)),flat,id:`earth-${id}`};
  let scene:ReactNode;
  switch(number){
    case 'Activity 13.1': scene=<MountainLake f={f}/>; break;
    case '13.1': scene=<ShoreHeat f={f} breeze={false}/>; break;
    case '13.1.1': scene=<Solar f={f}/>; break;
    case 'Activity 13.2': scene=<Solar f={f} albedo/>; break;
    case '13.1.2': scene=<Latitude f={f}/>; break;
    case '13.1.3': scene=<Solar f={f} infrared/>; break;
    case '13.2': scene=<Circulation f={f}/>; break;
    case '13.2.1': scene=<ShoreHeat f={f} breeze/>; break;
    case '13.2.2': scene=<PlanetWind f={f}/>; break;
    case '13.2.3': scene=<Current f={f}/>; break;
    case '13.3': scene=<Matter f={f} kind="water"/>; break;
    case '13.3.2': scene=<Matter f={f} kind="carbon"/>; break;
    case '13.3.3': scene=<Matter f={f} kind="nitrogen"/>; break;
    case '13.3.4': scene=<Matter f={f} kind="oxygen"/>; break;
    case '13.4': scene=<Erosion f={f}/>; break;
    default: throw new Error(`No Earth system scene for ${number}`);
  }
  return <g fill="none" stroke="none" fontFamily="system-ui, sans-serif"><Paint id={f.id}/>{scene}</g>;
}
