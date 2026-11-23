import {useId} from 'react';
import {many, Note, Onion, phase, type SceneProps} from './CellsArt';

const ink='#4c6673', violet='#886796', gold='#e39249';
function Nucleus({x,y,r=8}:{x:number;y:number;r?:number}){
  return <g><ellipse cx={x} cy={y} rx={r} ry={r*.84} fill="#b7a2ca" stroke="#69547d" strokeWidth="1.6"/><circle cx={x+r*.2} cy={y-1} r={r*.32} fill="#765882"/></g>;
}
function Peel({p=1}:{p?:number}){
  return <g>{many(25,i=>{
    const row=Math.floor(i/5),x=(i%5-2)*52+(row%2)*26,y=(row-2)*24;
    return <g key={i}><rect x={x-26} y={y-12} width="52" height="24" rx="4" fill="#fae9cc" stroke="#a96e41" strokeWidth={1.6+p*1.6}/><rect x={x-23} y={y-9} width="46" height="18" rx="4" stroke="#cfab82" fill="none"/><Nucleus x={x+14} y={y+2} r={3.6}/></g>;
  })}</g>;
}
function Cheek({x,y,s=1}:{x:number;y:number;s?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-38 -12q8 -23 34 -21q29 -2 42 24q7 15 -13 29q-28 21 -50 3q-19 -11 -13 -35Z" fill="#ecd5e4" stroke="#9d688f" strokeWidth="2"/><Nucleus x={3} y={0} r={10}/></g>;
}
function Scope({p,slides}:{p:number;slides:boolean}){
  const id=useId(), field=(x:number,r:number,onion:boolean,scale:number)=><g transform={`translate(${x} 105)`}>
    <circle r={r+4} fill="#526973"/><circle r={r} fill="#f8f2e8"/><clipPath id={`${id}${x}`}><circle r={r}/></clipPath><g clipPath={`url(#${id}${x})`}><g transform={`scale(${scale})`}>
    {onion?<Peel p={p}/>:<><Cheek x={-17} y={-12}/><Cheek x={44} y={38} s={.83}/><Cheek x={-37} y={56} s={.74}/><Cheek x={44} y={-59} s={.9}/></>}</g></g></g>;
  return slides?<g>{field(117,76,true,1+.17*phase(p,0,.5))}{field(355,76,false,1+.26*phase(p,.45,1))}
    <Note x={117} y={205}>Onion peel · rigid walls</Note><Note x={355} y={205}>Cheek · membranes only</Note></g>:<g>
    <path d="M159 57C202 84 206 137 169 164l18 9 12 14H62l7 -15 57 -6q61 -37 23 -91Z" fill="#88a7ae" stroke={ink} strokeWidth="3"/>
    <g transform="rotate(25 135 69)"><rect x="123" y="23" width="25" height="55" fill="#639198" stroke={ink} strokeWidth="2"/><rect x="120" y="20" width="31" height="10" rx="2" fill={ink}/><path d="M121 78h28l-5 20h-18Z" fill="#bcc9ca" stroke={ink} strokeWidth="2"/></g>
    <circle cx="161" cy="80" r="13" fill="#d5e1df" stroke={ink} strokeWidth="4"/>
    <path d="M67 129h94" stroke={ink} strokeWidth="7"/><path d="M79 124h60" stroke="#96cbd4" strokeWidth="4"/><ellipse cx="116" cy="122" rx="7" ry="2" fill={gold}/>
    <path d="m108 122 4 -24 11 4 -3 20Z" fill="#f4db8a" opacity={.4+.5*p}/>
    {field(339,70,true,.62+.84*p)}<Note x={120} y={207}>Same specimen on slide</Note><Note x={340} y={204}>Magnified field of view</Note></g>;
}
function Division({p,tissue}:{p:number;tissue:boolean}){
  const copy=phase(p,.12,.47), split=phase(p,.44,.92), sep=55*split, waist=48*(1-split);
  return <g>
    {tissue&&<g opacity={phase(p,.58,1)}>{many(12,i=><g key={i} transform={`translate(${53+74*(i%6)} ${i<6?41:174})`}><rect x="-36" y="-28" width="72" height="56" rx="16" fill="#efcfcd" stroke="#a66c76"/><Nucleus x={0} y={0}/></g>)}</g>}
    <g transform={`translate(240 106) scale(${.82+.18*phase(p,0,.35)})`}>
    <path d={`M0 ${-waist} C${-26-sep} -65 ${-55-sep} -40 ${-55-sep} 0 S${-32-sep} 65 0 ${waist} C${32+sep} 65 ${55+sep} 39 ${55+sep} 0 S${28+sep} -66 0 ${-waist}Z`} fill="#f2d5d1" stroke="#a16470" strokeWidth="3"/>
    {[-1,1].map((s,i)=><g key={s} opacity={i?copy:1} transform={`translate(${s*(8*copy+sep)} 0)`}>
      <ellipse rx={19} ry={23} fill="#ded0e4" stroke={violet} opacity={1-.8*Math.sin(split*Math.PI)}/>
      <path d="m-8 -9 6 17m0 -17 -6 17m10 -18 6 17m0 -17 -6 17" stroke="#785379" strokeWidth="2.4"/></g>)}</g>
    <Note x={240} y={214}>{tissue?(p<.55?'A pre-existing cell divides':'Daughters join a living tissue'):(p<.45?'Growth and DNA copying':'A copy goes to each daughter')}</Note></g>;
}
export default function Micro({number,p}:SceneProps){
  switch(number){
    case '2.1':return <Scope p={p} slides={false}/>;
    case 'Activity 2.3':return <Scope p={p} slides/>;
    case '2.2.1':return <g>
      <path d="M42 118H438v64H42Z" fill="#e1eee7"/>{many(29,i=><g key={i} transform={`translate(${44+i*14} 0)`}>{[1,-1].map(s=><g key={s} transform={`translate(0 ${s===1?92:127}) scale(1 ${s})`}><path d="m-2 3 -2 8 2 6m4 -14 2 9 -1 6" stroke="#bf9068" strokeWidth="2" fill="none"/><circle r="5" fill="#e3af77" stroke="#9a7352"/></g>)}</g>)}
      <g transform={`translate(${183+40*p+10*Math.sin(8*p)} ${44+122*p})`}><circle r="6.5" fill="#b45054"/><circle cx="9" cy="3" r="6.5" fill="#df7976"/></g>
      <g transform={`translate(331 ${47+32*Math.sin(2.4*p)})`}><circle r="10" fill="#b7ddee" stroke="#377895"/><text y="4" textAnchor="middle" fill={ink}>+</text></g>
      <Note x={191} y={24}>Oxygen</Note><Note x={333} y={24}>Dissolved ion</Note><Note x={105} y={158}>Cytoplasm</Note><Note x={245} y={204}>Lipid bilayer · selective crossing</Note></g>;
    case 'Activity 2.4':return <g>
      <g transform="translate(80 108) rotate(-15)"><path d="M33 6q20 -22 28 -8t18 -6" fill="none" stroke="#629180" strokeWidth="2"/><rect x="-44" y="-23" width="89" height="46" rx="23" fill="#cbe2ce" stroke="#53816b" strokeWidth="3"/><path d="M-25 1q6 -19 13 -2t10 -1t14 -2t11 5q-10 9 -18 2t-16 0t-14 -2Z" stroke={violet} fill="none" strokeWidth="2"/></g>
      <Cheek x={235} y={108} s={1.17}/><g transform="translate(388 109)"><path d="m-47 -37 67 -9 33 22 -4 57 -75 8 -24 -25Z" fill="#c3dda8" stroke="#67804d" strokeWidth={3+2*p}/><path d="m-29 -21 47 -9 16 15 -4 34 -48 6 -14 -14Z" fill="#d7edf1" stroke="#75a7b6" strokeWidth={1+2*p}/><Nucleus x={-34} y={11}/></g>
      <Note x={80} y={51}>Unenclosed DNA</Note><Note x={233} y={51}>Nucleus</Note><Note x={389} y={51}>Central vacuole</Note>
      <Note x={80} y={187}>Bacterium</Note><Note x={233} y={187}>Animal cell</Note><Note x={389} y={187}>Plant cell</Note></g>;
    case '2.3':{
      const x=138+244*p,y=110-28*Math.sin(p*Math.PI*2);
      return <g><path d="M46 165C17 111 50 40 121 38C238 13 375 19 391 78q12 45 -17 77q-110 64 -264 37Z" fill="#ebeeea" stroke="#628d8c" strokeWidth="3"/><Nucleus x={85} y={106} r={28}/>
        {many(5,i=><g key={i}><path d={`M${97+i*6} ${68+i*4}q29 39 -3 77`} fill="none" stroke="#977ea2" strokeWidth="4"/>{many(5,j=><circle key={j} cx={104+i*6+14*Math.sin(j*.75)} cy={73+j*13+i*3} r="2" fill="#57475d"/>)}</g>)}
        {many(5,i=><path key={i} d={`M215 ${87+i*8}q34 15 65 -4q-19 24 -60 11Z`} fill="#e8a969" stroke="#ac754b"/>)}
        <circle cx={x} cy={y} r="9" stroke="#749b98" fill="#e0f0e8" opacity={1-phase(p,.9,1)}/><path d={`M${x-5} ${y+1}l3 -5 4 8 4 -8`} fill="none" stroke="#9d4973" strokeWidth="3"/>
        <Note x={107} y={198}>Rough ER</Note><Note x={247} y={163}>Golgi stacks</Note><Note x={396} y={192}>Cell surface</Note></g>;
    }
    case '2.3.1':return <g><path d="M34 172Q5 65 103 36q160 -45 310 18q62 84 -11 122q-170 54 -368 -4Z" fill="#e9f0e7" stroke="#6e9691" strokeWidth="2"/><Nucleus x={93} y={114} r={27}/><ellipse cx="240" cy="109" rx="60" ry="51" fill="#e8dcea" stroke="#836c8f" strokeWidth="3"/>
      <path transform={`translate(238 110) scale(${1-phase(p,.14,.68)})`} d="m-26 -7 16 -13 17 4 13 -3 9 18 -15 19 -24 -1Z" fill="#d59b54" stroke="#a4774b"/>
      {many(9,i=>{const a=i*2.4,t=phase(p,.44,1);return <g key={i}><path d={`M${235+42*Math.cos(a)} ${107+31*Math.sin(a)}l5 5 4 -6`} fill="none" stroke="#80516c" strokeWidth="3"/><circle cx={238+18*Math.cos(a)+t*(80+13*Math.sin(a))} cy={112+18*Math.sin(a)+25*t*Math.cos(a)} r={4*phase(p,.16,.64)} fill={gold}/></g>;})}
      <Note x={240} y={43}>Membrane-bound digestion</Note><Note x={240} y={203}>{p<.45?'Food and enzymes enclosed':'Small products released into cytoplasm'}</Note></g>;
    case '2.4':return <Division p={p} tissue={false}/>;
    case '2.5':return <Division p={p} tissue/>;
    case 'Activity 2.5':return <g><Onion x={106} y={78} length={65+43*p}/><path d={`M114 ${134+43*p}L245 83m-131 ${67+43*p} 131 7`} fill="none" stroke="#96a192" strokeDasharray="3 4"/>
      <path d="M249 32h79v111q-1 31 -40 48q-38 -18 -39 -48Z" fill="#f7dfb2" stroke="#a98455" strokeWidth="2"/>
      {many(5,i=><path key={i} d={`M250 ${43+i*(16+2*p)}h77M${266+i*12} 33v98`} stroke="#ac8d5c"/>)}{many(5,i=><path key={i} d={`M253 ${136+i*6}h70M${258+i*14} 129v36`} stroke="#ab715e"/>)}
      <Note x={393} y={81}>Elongating cells</Note><Note x={394} y={152}>Dividing cells</Note><Note x={106} y={208}>Growing onion root</Note></g>;
    case '2.5.1':return <g><ellipse cx="255" cy="110" rx="150" ry="78" fill="#e6eeea" stroke="#639796" strokeWidth="3"/><ellipse cx="271" cy="110" rx="66" ry="49" fill="#dfd4e9" stroke={violet} strokeWidth="2"/>
      <path d="M227 109q8 -25 21 0l8 6m12 3 11 -21q9 -10 18 14t14 -3" fill="none" stroke={violet} strokeWidth="4"/><path d="m258 97 6 8 -8 6 6 7" fill="none" stroke="#bf6554" strokeWidth={2+2*p}/>
      <path d="m95 99 10 8 11 -10m-11 10v14" fill="none" stroke="#447d85" strokeWidth="5"/><circle cx={49+55*phase(p,0,.45)} cy={97} r="6" fill={gold}/>
      <Note x={80} y={66}>Growth signal</Note><Note x={271} y={149}>DNA damage</Note><Note x={249} y={206}>{p<.45?'Signal reaches the cell':'Checkpoint pauses division'}</Note></g>;
    default:throw new Error(`Unknown cell scene: ${number}`);
  }
}
