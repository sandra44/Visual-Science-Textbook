import {Arm, many, Note, phase, type SceneProps} from './CellsArt';

function Skin({p,scrape}:{p:number;scrape:boolean}){
  const gap=scrape?phase(p,0,.34):0, seal=scrape?phase(p,.45,.88):0;
  return <g><path d={`M44 88h177l${17*gap} ${23*gap}l${16*gap} ${-23*gap}H438v82H44Z`} fill="#ebc5b3" stroke="#b28e81" strokeWidth="2"/>
    {many(10,i=><path key={i} d={`M${55+38*i} 145q10 -25 25 -2t24 0`} fill="none" stroke="#ccaa95" strokeWidth="2"/>)}
    {many(16,i=><g key={i} transform={`translate(${44+24.5*i} 85)`} opacity={i===7||i===8?1-gap:1}>
      <path d="M0 1l2 -25q9 -4 20 -1l2 25Z" fill="#efb7aa" stroke="#a27374" strokeWidth="1.4"/><ellipse cx="12" cy="-10" rx="4.5" ry="6" fill="#a8748c"/></g>)}
    {scrape?<><path d="M54 135q90 -24 123 -8q27 10 45 -16l9 -8m15 0q19 30 53 29q63 -8 123 2" fill="none" stroke="#b36c70" strokeWidth="6"/>
      {many(13,i=><ellipse key={i} cx={236+14*Math.cos(i*2.4)*Math.sqrt(i/13)} cy={94+7*Math.sin(i*2.4)} rx={5*seal} ry={3*seal} fill={i%2?'#a46961':'#c78975'}/>)}
      <Note x={238} y={44}>{p<.45?'Scraped surface':'Clot seals the break'}</Note><Note x={110} y={194}>Small blood vessel</Note></>:<>
      {many(6,i=><circle key={i} cx={154+i*31} cy={28+28*phase(p,0,.64)-6*phase(p,.64,1)} r="4" fill="#b29d61"/>)}
      <Note x={239} y={115}>Continuous epithelial sheet</Note><Note x={239} y={195}>Protected tissue beneath</Note></>}</g>;
}
function Heart({p}:{p:number}){
  const s=1-.13*Math.pow(Math.sin(4*Math.PI*p),4);
  return <g transform={`translate(349 111) scale(${s})`}><path d="M-13 -30v-24q12 -8 18 2l-1 23m2 0q2 -24 15 -24l4 9q-10 3 -8 21" fill="#bf7270" stroke="#965c61" strokeWidth="3"/>
    <path d="M-17 -23q-21 -8 -28 17q-6 28 44 59q28 -21 32 -49q5 -33 -21 -34q-15 -2 -27 7Z" fill="#cd847e" stroke="#9b6164" strokeWidth="2"/>
    <path d="M-14 -13q19 0 18 22t-3 28m4 -24 12 -7" fill="none" stroke="#9e6060" strokeWidth="3"/><path d="M-18 -23q4 -21 -9 -32l-9 5q11 12 8 28" fill="#7b9da9" stroke="#527a88" strokeWidth="2"/></g>;
}
function Calf({p}:{p:number}){
  const lift=phase(p,.3,1), y=158-34*lift;
  return <g><path d="M91 183h308" stroke="#ac9c8b" strokeWidth="3"/>
    <path d={`M197 36q-28 14 -19 48Q193 111 198 ${y}Q190 ${y+22} 215 ${y+21}Q270 181 307 182q16 -2 4 -10Q266 160 230 ${y+1}Q216 111 221 42Z`} fill="#f0d6bc" stroke="#a17d68" strokeWidth="2"/>
    <path d={`M207 47q-24 -12 -25 19q-2 ${37-11*p} 18 ${53-15*p}q26 -34 7 ${-72+15*p}Z`} fill="#cf8876" stroke="#a56559" strokeWidth="2"/><path d={`M201 ${119-15*p}q-1 14 5 ${y-117+15*p}`} stroke="#b69763" fill="none" strokeWidth="5"/>
    <path d={`M205 ${y-2}q13 -7 25 12l-10 5 -20 -4Z`} fill="#f2e2b7" stroke="#9c825e" strokeWidth="2"/>
    <Note x={132} y={60}>Calf muscle</Note><Note x={122} y={125}>Achilles tendon</Note><Note x={341} y={123}>Heel rises</Note><Note x={247} y={207}>Toes stay on the ground</Note></g>;
}
function Sensory({p}:{p:number}){
  const q=phase(p,.3,1);
  return <g><path d="M40 86q54 -6 110 2v58H40Z" fill="#edc4b2" stroke="#ae897e"/><path d="M40 84q54 -6 110 2" fill="none" stroke="#d59583" strokeWidth="6"/>
    <path d={`M71 ${25+33*phase(p,0,.32)}q16 -10 34 0l-4 16q-3 13 -18 11q-11 -2 -12 -11Z`} fill="#efc9ab" stroke="#ae897e" strokeWidth="2"/>
    <path d="M92 90q-18 5 -4 17q10 7 16 -1q6 -8 -7 -11q-12 -1 -9 6m2 9q-1 14 20 18q35 7 98 -1q75 -12 151 0" fill="none" stroke="#b68e37" strokeWidth="3"/>
    {many(9,i=><rect key={i} x={126+i*25} y={123+4*Math.cos(i*.69)} width="17" height="8" rx="4" fill="#e7c779" stroke="#af985d"/>)}
    <path d="M352 56q33 -10 67 12v97q-32 18 -67 0Z" fill="#dbc5d3" stroke="#9f8598" strokeWidth="2"/><path d="M365 78q15 -7 22 3t19 -1v56q-12 9 -19 -2t-21 4Z" fill="#b496af"/>
    <circle cx={98+270*q} cy={111+17*Math.min(1,7*q)-5*Math.sin(q*Math.PI)} r={6} fill="#e8a327" opacity={phase(p,.15,.32)}/>
    <Note x={96} y={171}>Touch receptor</Note><Note x={236} y={151}>Sensory fibre</Note><Note x={387} y={191}>Spinal cord</Note></g>;
}
function Mass({p}:{p:number}){
  const slice=phase(p,.29,.87), angle=slice*.15*2*Math.PI;
  return <g><path d="M92 132h84l8 13v24H83v-25Z" fill="#93afaf" stroke="#55767c" strokeWidth="2"/><rect x="112" y="144" width="43" height="17" rx="3" fill="#e5efe2"/><text x="134" y="157" textAnchor="middle" fontSize="12" fill="#305159">40 kg</text>
    <path d="M118 51q15 -8 30 0l12 40 -7 2 -10 -28 4 32 -7 37h-9l1 -37 -2 0 -4 37h-9l4 -38 1 -30 -12 27 -7 -4Z" fill="#b3c8c2" stroke="#718d86" strokeWidth="2"/><circle cx="134" cy="34" r="13" fill="#d9b79d" stroke="#9c806d"/>
    <circle cx="318" cy="111" r="61" fill="#e2e7dc" stroke="#96a394" strokeWidth="2"/><path d={`M318 111v-61A61 61 0 0 1 ${318+61*Math.sin(angle)} ${111-61*Math.cos(angle)}Z`} fill="#c98970" stroke="#a67162"/>
    <Note x={319} y={119}>40 kg total</Note><Note x={350} y={37}>15% estimated share</Note><Note x={318} y={199}>{p<.75?'Part of total body mass':'15% of 40 kg = 6 kg'}</Note></g>;
}
export default function Animal({number,p}:SceneProps){
  switch(number){
    case '3.3':return <g><Arm x={218} y={160} scale={1.05} angle={15-74*phase(p,.4,.94)} mode="nerve" signal={phase(p,0,.45)}/><Note x={124} y={52}>Motor nerve</Note><Note x={317} y={89}>Muscle fibres</Note><Note x={316} y={194}>Tendon pulls bone</Note></g>;
    case '3.3.1':return <Skin p={p} scrape={false}/>;
    case '3.3.2':return <g><Arm x={210} y={153} angle={-50+61*phase(p,0,.85)} mode="ligament"/><path d="M159 141l44 7" stroke="#448380"/><Note x={116} y={142}>Ligament</Note><Note x={304} y={194}>Bone-to-bone restraint</Note></g>;
    case 'Activity 3.2':return <Skin p={p} scrape/>;
    case 'Activity 3.3':return <Calf p={p}/>;
    case '3.3.3':return <g><Arm x={114} y={144} angle={27-85*phase(p,.08,.54)} scale={.9}/><Heart p={p}/><Note x={139} y={198}>Voluntary arm movement</Note><Note x={346} y={198}>Involuntary heartbeat</Note></g>;
    case '3.3.4':return <Sensory p={p}/>;
    case '3.4':return <g><Arm x={205} y={151} angle={25-78*phase(p,.36,1)} mode="bone"/><g opacity={phase(p,0,.5)}><Arm x={205} y={151} angle={25-78*phase(p,.36,1)}/></g><Note x={148} y={69}>Upper arm</Note><Note x={125} y={153}>Elbow joint</Note><Note x={324} y={194}>Forearm rotates</Note></g>;
    case 'Activity 3.4':return <Mass p={p}/>;
    case '3.4.1':return <g><Arm x={220} y={155} angle={19-91*Math.sin(p*Math.PI)}/><Note x={134} y={86}>Triceps</Note><Note x={299} y={77}>Biceps</Note><Note x={235} y={208}>{p<.5?'Flexion · biceps shortens':'Extension · triceps shortens'}</Note></g>;
    default:throw new Error(`Unknown animal tissue scene: ${number}`);
  }
}
