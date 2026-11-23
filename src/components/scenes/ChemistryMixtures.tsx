import { Ball, Beaker, Label, blue, clamp, gold, green, ink, mix, times, water, type SceneProps } from './ChemistryArt';

const grain=(i:number)=>[((i*43+8)%85)/85,((i*23+4)%69)/69];
function Samples({number,p,flat}:SceneProps){
  const simple=number==='5.1', single=number==='5.4.3'||number==='5.4.4', unknown=number==='A5.9';
  const samples=simple?['Salt water','Muddy water']:single?[number==='5.4.4'?'Diluted milk':'Muddy water']:unknown?['Unknown X','Unknown Y']:['Salt water','Chalk in water','Diluted milk'];
  return <g>{samples.map((name,i)=>{
    const colloid=name==='Diluted milk'||name==='Unknown Y', clear=name==='Salt water', x=(i+.5)*480/samples.length,w=single?190:104;
    return <g key={name}><Beaker x={x} flat={flat} w={w} color={clear?water:colloid?'#d8e9e7':name==='Chalk in water'?'#d9e1df':'#cfbda2'}>
      {!clear&&times(colloid?38:32,j=>{const [a,b]=grain(j);return <circle key={j} cx={(a-.5)*(w-12)+(colloid?2*Math.sin(p*8+j):0)} cy={colloid?-6-b*58+2*Math.cos(j+p*6):mix(-8-b*56,-4-(j%3)*3,p)} r={colloid?1.9:3} fill={colloid?'#82a6ac':name==='Chalk in water'?'#9aa4a5':'#876545'}/>;})}
      {!simple&&number!=='5.4.3'&&<g><path d={`M${-w/2-16} -38h16`} stroke="#e7a32a" strokeWidth="3"/>{!clear&&<g opacity={colloid?.65+.3*p:.8*(1-p)}><path d={`M${-w/2} -38l${w-5} -4v8Z`} fill="#edb844"/>{times(4,j=><path key={j} d={`M${(j-2)*w*.18} -38l9 -15`} stroke="#d59a25"/>)}</g>}</g>}
    </Beaker><Label x={x} y={188}>{name}</Label><Label x={x} y={208} size={12}>{simple?(clear?'Uniform throughout':'Visible grains'):clear?'No visible beam':colloid?'Beam stays visible':p>.65?'Sediment at base':'Suspended grains'}</Label></g>;
  })}</g>;
}
function Solute({number,p,flat}:SceneProps){
  const dissolving=number==='5.2', mass=number==='5.2.2', grow=number==='5.3.1'||number==='A5.3', recovery=number==='A5.3',level=number==='5.2.1'?.82-.4*p:.72;
  return <g><Beaker x={215} w={200} h={134} level={level} flat={flat} color={grow?'#95cee1':water}>
    {times(36,i=>{
      const [a,b]=grain(i), sx=(i%6-2.5)*8,sy=-5-Math.floor(i/6)*7, dx=(a-.5)*176,dy=-6-b*(134*level-16);
      const t=dissolving||mass?clamp(p*1.7-(35-i)/52):grow?1-clamp(p*1.55-i/48):1;
      return <Ball key={i} x={mix(sx,dx,t)} y={mix(sy,dy,t)} r={3.6} color={grow?blue:i%2?green:gold} flat={flat}/>;
    })}
    {recovery&&times(4,i=><g key={i} transform={`translate(${(i-1.5)*25} -2) scale(${p})`}><path d="M-12 0l-2-15 12-14 11 13-3 16Z" fill="#3395be" stroke={blue}/><path d="M-2-29l-2 28 13-15" stroke="#a0e5fa"/></g>)}
  </Beaker>
  <Label x={382} y={80}>{mass?'10 g solute':grow?'Crystal lattice':dissolving?'Solute particles':'Same solute'}</Label>
  <Label x={382} y={103} size={13}>{mass?'90 g water':grow?(recovery?'Cooling solution':'Growing nucleus'):dissolving?'Water solvent':'Less water'}</Label>
  <Label>{mass?'10 g ÷ 100 g solution = 10% by mass':grow?(recovery?'Blue copper sulfate crystals separate':'Dispersed particles join ordered rows'):dissolving?'Crystal separates into dispersed particles':'Solute concentration rises as water evaporates'}</Label></g>;
}
function Strip({p,flat,method}:{p:number;flat:boolean;method:boolean}){
  const base=154,front=base-99*p;
  return <g><Beaker x={220} w={170} h={139} level={.07} flat={flat}>
    <rect x="-34" y="-146" width="68" height="144" fill="#fff7dd" stroke="#aa9673"/>
    <rect x="-33" y={front-168} width="66" height={166-front} fill="#cce9e5"/>
    <path d="M-32 -14h64" stroke="#6b6b61" strokeDasharray="3 3"/>
    {['#f0ba37','#d36479','#4177a8'].map((color,i)=><ellipse key={color} cy={-14-p*[26,56,84][i]} rx={8+5*p} ry={4} fill={color} />)}
  </Beaker><Label x={368} y={front+3} size={12}>Solvent front</Label><Label x={79} y={156} size={12}>Origin</Label>
    <Label>{method?'Paper chromatography separates soluble dyes':'One ink spot separates into three dye bands'}</Label></g>;
}
function Layers({p,flat,oil}:{p:number;flat:boolean;oil:boolean}){
  // Vertical cross-section of the bulb; a fixed oil volume follows the draining water.
  const boundary=88+38*p;
  // The bulb narrows below y=92; keep the projected oil area constant as it drains.
  const taper=Math.max(0,boundary-92), top=boundary-23-.97*taper*taper/86;
  const half=(y:number)=>y<92?43:Math.max(7,43-(y-92)*.97);
  const fill=(a:number,b:number,color:string)=>{
    const levels=[a,...[92].filter(y=>y>a&&y<b),b];
    return <polygon points={[...levels.map(y=>`${220-half(y)},${y}`),...levels.reverse().map(y=>`${220+half(y)},${y}`)].join(' ')} fill={color}/>;
  };
  return <g><path d="M205 22h30v15q28 8 28 28v27l-36 37v12h-14v-12l-36-37V65q0-20 28-28Z" fill="#eef7fa" stroke={ink} strokeWidth="2"/>
    {fill(boundary,129,water)}{fill(top,boundary,gold)}
    <path d={`M${220-half(boundary)} ${boundary}h${half(boundary)*2}`} stroke="#856a35"/>
    <rect x="208" y="138" width="25" height="6" rx="2" fill={ink}/><path d="M217 144v9h6v-9" stroke={ink}/>
    <Beaker x={220} y={187} w={74} h={30} level={.03+.66*p} flat={flat}/>
    {p>0&&p<.98&&<path d="M220 153v18" stroke="#5ab5ca" strokeWidth="3"/>}
    <Label x={337} y={top+14}>{oil?'Mustard oil':'Oil'}</Label><Label x={110} y={115}>Water</Label><Label y={210}>Lower layer drains first; oil stays above the tap</Label></g>;
}
function Sublime({p,flat,sand}:{p:number;flat:boolean;sand:boolean}){
  return <g><path d="M125 53q115-30 230 0l-8 8q-108-23-214 0Z" fill="#c1dbe3" stroke={ink}/><Label y={24}>Cool collecting surface</Label>
    <path d="M116 159q124 31 248 0-17 31-124 31t-124-31Z" fill="#9eaeb4" stroke={ink}/>
    {times(26,i=>{const [a,b]=grain(i),t=clamp(p*1.65-i*.024);const x=160+a*153,y=mix(169-b*11,49-7*Math.sin(a*Math.PI),t);return t>0&&t<1?<circle key={i} cx={x+7*Math.sin(t*7+i)} cy={y} r="2.8" fill="#6a91ac"/>:<path key={i} d={`M${x} ${y-4}l5 4-3 4-5-2Z`} fill="#e9f1ef" stroke="#6f8696"/>;})}
    {sand&&times(28,i=><Ball key={i} x={157+grain(i)[0]*162} y={173-grain(i)[1]*10} r={2.8} color="#b5925f" flat={flat}/>)}
    <Label x={85} y={111}>{sand?'Camphor':'Vapour'}</Label><Label y={212}>{sand?'Camphor deposits above; sand remains below':'Solid → vapour → solid deposit'}</Label></g>;
}
function Solubility({p}:{p:number}){
  const k=[13,32,64,110,169], salt=[36,36,37,37,38],x=(i:number)=>82+i*78,y=(v:number)=>166-v*.73;
  const mark=(v:number[])=>mix(v[Math.min(3,Math.floor(4*p))],v[Math.min(3,Math.floor(4*p))+1],4*p-Math.min(3,Math.floor(4*p)));
  return <g><Label y={19}>Approximate solubility · g per 100 g water</Label><path d="M82 35v131h312" stroke={ink} strokeWidth="2"/>
    {[0,50,100,150].map(v=><g key={v}><Label x={57} y={y(v)+4} size={11}>{v}</Label><path d={`M82 ${y(v)}h312`} stroke="#cddade"/></g>)}
    {times(5,i=><Label key={i} x={x(i)} y={184} size={11}>{i*20}°</Label>)}
    <path d={`M${x(4*p)} 36V166`} stroke={ink} strokeDasharray="3 4"/>
    {[k,salt].map((v,j)=><g key={j}><polyline points={v.map((n,i)=>`${x(i)},${y(n)}`).join(' ')} stroke={j?green:blue} strokeWidth="3"/><circle cx={x(4*p)} cy={y(mark(v))} r="5" fill={j?green:blue}/><Label x={428} y={y(v[4])+4} size={13}>{j?'NaCl':'KNO₃'}</Label></g>)}<Label y={208}>Temperature (°C)</Label></g>;
}
export default function Mixtures(props:SceneProps){
  const {number,p,flat}=props;
  switch(number){
    case '5.1':case 'A5.1':case '5.4.3':case '5.4.4':case 'A5.9':return <Samples {...props}/>;
    case '5.2':case '5.2.1':case '5.2.2':case '5.3.1':case 'A5.3':return <Solute {...props}/>;
    case 'A5.2':return <Solubility p={p}/>;
    case '5.3':case 'A5.5':return <Strip p={p} flat={flat} method={number==='5.3'}/>;
    case '5.4.1':case 'A5.6':return <Layers p={p} flat={flat} oil={number==='A5.6'}/>;
    case '5.4.2':case 'A5.7':return <Sublime p={p} flat={flat} sand={number==='A5.7'}/>;
    case '5.4':return <g><Beaker x={235} w={94} y={177} h={62} level={.04+.59*p} flat={flat}/><path d="M159 62h152l-70 69v19h-12v-19Z" fill="#e2f1f1" stroke={ink} strokeWidth="2"/><path d="M169 64h132l-66 56Z" fill="#f3eacc" stroke="#b6a779"/>
      <path d={`M${183+37*p} ${79+38*p}h${104-74*p}l${-52+37*p} ${45-38*p}Z`} fill={water}/>
      {times(18,i=><Ball key={i} x={235+(grain(i)[0]-.5)*42} y={101-Math.abs(grain(i)[0]-.5)*34+grain(i)[1]*6} r={3.1} color="#a17e59" flat={flat}/>)}<path d="M235 149v15" stroke="#61b6ce" opacity={Math.sin(Math.PI*p)}/><Label x={83} y={90}>Sand retained</Label><Label x={362} y={160}>Filtrate</Label><Label y={207}>Filter paper holds back insoluble grains</Label></g>;
    case 'A5.4':return <g><circle cx="381" cy="42" r="21" fill={gold}/><path d="M23 147l59-61h316l58 61-25 26H46Z" fill="#c5a377" stroke="#8c7250"/><path d="M47 145l44-48h300l40 48Z" fill={water}/><path d="M47 145l44-48h300l40 48Z" fill="#ece5cb" opacity={p}/>
      {times(18,i=><g key={i} transform={`translate(${100+grain(i)[0]*274} ${106+grain(i)[1]*30}) scale(${clamp(p*1.6-i*.03)})`}><path d="M-6 0l5-5 8 2v7l-8 2-5-3Z" fill="#fff" stroke="#94a4a3"/>{!flat&&<path d="M-6 0l6 3 7-6M0 3v3" stroke="#b5c5c2"/>}</g>)}{times(4,i=><path key={i} d={`M${120+i*54} ${95-p*23}q-7-8 0-15t0-15`} stroke="#83b9c6" strokeWidth="2" opacity={.3+.6*p}/>)}<Label>Salt pan · seawater concentrates, salt crystallizes</Label></g>;
    case 'A5.8':return <g><g transform={`translate(240 105) scale(1 ${flat?1:.78}) rotate(${p*380})`}><circle r="86" fill="#d7ba8b" stroke="#8e7756" strokeWidth="3"/><circle r="70" stroke="#b2956b"/>{[0,180].map(a=><g key={a} transform={`rotate(${a})`}><rect x="17" y="-12" width="64" height="24" rx="9" fill={water} stroke={ink}/>{times(15,i=><circle key={i} cx={mix(22+grain(i)[0]*53,72+(i%3)*2,p)} cy={(grain(i)[1]-.5)*15} r="2.1" fill="#876347"/>)}</g>)}<circle r="7" fill={ink}/></g><Label y={210}>Rotating disc · dense particles collect at the outer ends</Label></g>;
    default:throw new Error(`Unknown mixture scene: ${number}`);
  }
}
