import { Egg, Fetus, L, Leaf, Line, Sperm, many, sea, span } from './LifeEarthReproArt';

function Fish({x,y,s}:{x:number;y:number;s:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-23 -3l-17 -13q-5 15 0 31l17 -13q22 19 48 0q-13 -17 -31 -13l-12 -7 -1 11Z" fill="#a4c6ad" stroke="#587e72" strokeWidth="2"/><circle cx="15" cy="-2" r="2.8" fill="#3c5553"/><Line d="M6 -9q-7 6 -2 14m-7 -4 -9 5 2 -7" c="#658a7e"/></g>;
}
export function FishCycle({p}:{p:number}){
  const dev=span(p,.25,.75),hatch=span(p,.73),swim=span(p,.25);
  return <g><path d="M14 145q63 -10 111 0t117 0t115 0t109 0v33H14Z" fill="#d8e9e5"/>
    <g opacity={1-.85*hatch}><Egg x={218} y={109} r={42}/></g>
    <g opacity={1-span(p,.24,.35)}><Sperm x={86+94*span(p,0,.25)} y={110} p={p}/></g>
    <g opacity={1-span(p,.5,.72)}>{many(8,i=><circle key={i} cx={218+(i?16*Math.cos(i):0)*dev} cy={106+14*Math.sin(i)*dev} r={8-dev*3} fill="#c68d94" stroke="#a76f7d" opacity={i?span(p,.25+i*.024,.37+i*.024):1}/>)}</g>
    <g opacity={span(p,.48,.75)}><Fish x={213+140*hatch} y={104-10*Math.sin(swim*Math.PI)} s={.32+dev*.37+hatch*.36}/></g>
    <L x={240} y={36}>Fish development in water</L><L x={240} y={204}>{p<.25?'Egg and sperm':p<.73?'Embryo develops inside the egg':'Young fish after hatching'}</L></g>;
}
function Rabbit({x,y,s}:{x:number;y:number;s:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-29 4q-12 -17 0 -30q13 -14 31 -1l13 -4q-9 -22 -2 -28q8 -1 14 22q-2 -21 5 -22q7 5 0 27q13 6 11 17q-2 8 -15 9l-6 14h-12l1 -9q-10 7 -18 4l-2 6h-27q-3 -5 7 -8Z" fill="var(--repro-cell)" stroke="#957868" strokeWidth="2"/><circle cx="33" cy="-21" r="2.2" fill="#514841"/><circle cx="-35" cy="-7" r="6" fill="#f4dbc7" stroke="#a58a78"/></g>;
}
export function AnimalComparison({p}:{p:number}){
  const exit=span(p,.62),g=.25+.75*p;
  return <g><path d="M16 157q83 -19 157 -4t145 -1t145 -4v16q-70 13 -157 8t-148 -1t-142 5Z" fill="#dccba9"/>
    <g opacity={1-.65*exit}><path d="M74 133q-12 -26 4 -62q23 -49 47 -6q22 40 8 68q-28 22 -59 0Z" fill="#f2e1ba" stroke="#aa966e" strokeWidth="2"/>
      <path d="m78 102 16 6 12 -9 13 9 17 -8" stroke="#a48d6f" fill="none" opacity={exit}/></g>
    <g transform={`translate(${103+63*exit} ${110+22*exit}) scale(${g})`}><path d="M-21 -1q-4 -17 13 -15q3 -16 16 -15q12 1 13 14l10 4 -11 4q-1 22 -23 20q-14 -1 -18 -12Z" fill="#e6bb61" stroke="#a28049"/><circle cx="13" cy="-21" r="2"/><Line d="M-15 -5q8 10 17 0M-4 12v9l-5 2m16 -12 1 10 5 1" c="#987947"/></g>
    <Rabbit x={339} y={141} s={1.55}/><ellipse cx="323" cy="119" rx="24" ry="18" fill="#ead8cf" stroke="#b18c85" opacity={1-exit}/>
    <Rabbit x={322+93*exit} y={126+30*exit} s={.17+.29*p}/>
    <L x={111} y={28}>Laid egg · chick</L><L x={339} y={28}>Within parent · rabbit</L><L x={115} y={200}>Hatching</L><L x={348} y={200}>Live birth</L></g>;
}
export function Puberty({p}:{p:number}){
  // Two illustrative height curves share axes; their growth spurts begin at different times.
  const height=(t:number,mid:number)=>150-22*t-66/(1+Math.exp(-11*(t-mid)));
  return <g><L x={240} y={25}>Hormones coordinate growth at different times</L>
    <Line d="M98 53v112h303" c="#849592"/><L x={57} y={89}>Height</L><L x={368} y={185}>Age</L>
    {[.35,.66].map((m,i)=>{const c=i?'#b77269':sea;return <g key={m}><Line d={many(41,j=>`${j?'L':'M'}${101+7*j} ${height(j/40,m)}`).join(' ')} c={c} w={3} progress={p}/>
      <circle cx={101+280*p} cy={height(p,m)} r="4" fill={c}/></g>;})}
    <L x={231} y={208}>Two example growth spurts, not a timetable</L></g>;
}
function Profile({x,flip=false,coat=false}:{x:number;flip?:boolean;coat?:boolean}){
  return <g transform={`translate(${x} 145) scale(${flip?-1:1} 1)`}><path d="M-36 25q0 -28 25 -35l1 -14q-19 -14 -15 -40q2 -19 21 -20q26 -2 27 24l6 13 -6 2q1 16 -16 18v12q25 9 31 40Z" fill="#d9ae8f" stroke="#937868" strokeWidth="1.7"/>
    <path d="M-25 -47q-12 -37 16 -43q33 -8 34 25q-11 -8 -28 -2q-3 15 -15 22Z" fill="#67584e"/><circle cx="15" cy="-56" r="1.6"/>
    <path d="M-37 27q3 -31 26 -38q7 10 19 -1q23 4 32 39Z" fill={coat?'#d4e4de':'#8bada9'} stroke="#688985"/>{coat&&<Line d="m-9 -9 6 23 10 -26m-1 31h16" c="#889e99"/>}</g>;
}
export function Care({p}:{p:number}){
  const t=span(p,.42);
  return <g><L x={109} y={34}>Varied foods</L><ellipse cx="108" cy="124" rx="68" ry="28" fill="#e7e5db" stroke="#8d9c94" strokeWidth="2"/><ellipse cx="108" cy="122" rx="55" ry="19" fill="#faf3e1" stroke="#c9c5af"/>
    <Leaf x={62} y={121} s={.88}/><Leaf x={76} y={125} s={.8}/><path d="M90 123q-11 -20 5 -22q17 -4 15 13q-3 19 -20 9Z" fill="#d68b65" stroke="#b87554"/>
    {many(15,i=><ellipse key={i} cx={115+(i%5)*5+(i%3)*2} cy={109+Math.floor(i/5)*5} rx="3.7" ry="2.5" fill="#d9ba85" stroke="#bca06c"/>)}
    <L x={329} y={34}>Prenatal visit</L><Profile x={400} flip coat/><path d="M244 162q-8 -20 -2 -37q6 -19 -2 -37l30 1q0 19 15 26q24 16 19 46Z" fill="var(--repro-petal)" stroke="#ac7f79" strokeWidth="2"/>
    <ellipse cx="273" cy="136" rx="21" ry="22" fill="#eed6c4" stroke="#b58781"/><Fetus x={273} y={136} s={.26+.16*p}/>
    <Line d="M391 138q-3 49 -51 22l-36 -21" c="#5c7779" w={2.5} progress={t}/><circle cx="304" cy="139" r={4*t} fill="#608383"/>
    <L x={237} y={201}>Nutrition supports growth; care monitors health</L></g>;
}
export function Readiness({p}:{p:number}){
  return <g><Profile x={114}/><Profile x={367} flip/><L x={240} y={25}>Physical maturity ≠ readiness</L>
    <g opacity={.4+.6*span(p,0,.48)}><path d="M148 44h121q12 0 12 13v13q0 11 -12 11h-97l-24 14 7 -14h-7q-11 0 -11 -11V56q0 -12 11 -12Z" fill="#deede3" stroke="#8dab9c"/><L x={210} y={67}>What feels right?</L></g>
    <g opacity={span(p,.33)}><path d="M198 106h115l24 -12 -6 13q10 1 10 11v14q0 10 -11 10H198q-11 0 -11 -11v-14q0 -11 11 -11Z" fill="#f4e4cf" stroke="#b89f83"/><L x={264} y={129}>I’d rather wait.</L></g>
    <L x={240} y={204}>Mutual consent is freely given and can be withdrawn</L></g>;
}
export function Protection({p}:{p:number}){
  return <g><L x={240} y={22}>Different methods protect in different ways</L>
    <g transform="translate(112 90) rotate(-12)"><path d="M-20 26l1 -45q0 -14 12 -18l2 -7q4 -5 8 0l1 7q13 4 14 18l2 45Z" fill="#c2ded6" stroke="#66958b" strokeWidth="2"/><ellipse cy="26" rx="24" ry="6" fill="#abd2c6" stroke="#66958b" strokeWidth="2"/><ellipse cy="25" rx="18" ry="3" fill="#deeee4" stroke="#86b4a8"/></g>
    <g transform="translate(352 88) rotate(12)"><rect x="-28" y="-31" width="58" height="67" rx="5" fill="#ced9d8" stroke="#889b9c"/>{many(6,i=><ellipse key={i} cx={i%2*24-11} cy={Math.floor(i/2)*20-18} rx="7.5" ry="6.5" fill="#fff3de" stroke="#acafa4"/>)}</g>
    <L x={110} y={143}>Condom</L><L x={352} y={143}>Contraceptive pill</L>
    <path d="M37 152h406" stroke="#cfcec0"/><g opacity={.38+.62*span(p,0,.47)}><L x={110} y={172}>Reduces pregnancy risk</L><L x={352} y={172}>Reduces pregnancy risk</L></g>
    <g opacity={.28+.72*span(p,.35)}><L x={110} y={196}>Lowers risk of many STIs</L><L x={352} y={196}>No STI protection</L></g></g>;
}
