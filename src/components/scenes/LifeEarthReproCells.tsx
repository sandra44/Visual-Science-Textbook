import { Egg, Sperm, L, Line, many, rose, sea, span } from './LifeEarthReproArt';

export function Bud({p}:{p:number}){
  const r=2+31*span(p,0,.8),x=208+49+r*.68+53*span(p,.78),y=112-20*p;
  return <g><g transform="rotate(-15 205 112)"><ellipse cx="205" cy="112" rx="53" ry="62" fill="var(--repro-cell)" stroke="#a57566" strokeWidth="3"/>
    <ellipse cx="201" cy="126" rx="24" ry="19" fill="#fff1d7" stroke="#cfaa91"/><ellipse cx="180" cy="70" rx="8" ry="3" stroke="#ad887a" fill="none"/></g>
    <ellipse cx={x} cy={y} rx={r} ry={r*1.12} fill="var(--repro-cell)" stroke="#a57566" strokeWidth="2.5"/>
    <circle cx="209" cy="91" r="12" fill={rose}/><circle cx={209+(x-209)*span(p,.28,.76)} cy={91+(y-91)*p} r={10*span(p,.25,.65)} fill={rose}/>
    <L x={174} y={195}>Parent yeast</L><L x={348} y={54}>{p<.78?'Growing bud':'Daughter cell'}</L><Line d={`M346 60L${x+3} ${y-r-3}`} c="#a88e7d"/>
  </g>;
}
export function Fission({p}:{p:number}){
  const d=36*span(p,0,.75),waist=36*(1-span(p,.14,.78)),gap=46*span(p,.78);
  return <g transform="translate(240 105)">{[-1,1].map(side=><g key={side} transform={`scale(${side} 1) translate(${gap} 0)`}>
    <path d={`M0 ${-waist}C12 ${-waist} ${d+1} -54 ${d+26} -42C${d+58} -31 ${d+40} -18 ${d+54} -6C${d+70} 11 ${d+42} 10 ${d+42} 28C${d+43} 53 ${d+14} 48 ${d+2} 36Q12 ${waist} 0 ${waist}Z`} fill="var(--repro-cell)"/>
    <Line d={`M0 ${-waist}C12 ${-waist} ${d+1} -54 ${d+26} -42C${d+58} -31 ${d+40} -18 ${d+54} -6C${d+70} 11 ${d+42} 10 ${d+42} 28C${d+43} 53 ${d+14} 48 ${d+2} 36Q12 ${waist} 0 ${waist}`} c={rose} w={2}/>
    <circle cx={d} cy="-2" r="10" fill="#9b708e"/><circle cx={d+27} cy="15" r="6" fill="#fff2d1"/>
  </g>)}<L x={0} y={89}>{p<.22?'Single amoeba':p<.78?'Nuclear division and constriction':'Two daughter amoebae'}</L></g>;
}
export function Fusion({p,genes}:{p:number;genes:boolean}){
  const t=span(p,0,.58),join=span(p,.58),x=83+163*t;
  return <g><Egg x={299} y={110} r={60}/>
    <g opacity={1-span(p,.56,.68)}><Sperm x={x} y={110} p={p} scale={1.35}/></g>
    <ellipse cx={312-13*join} cy="110" rx="17" ry="19" fill="#e4aca9" stroke={rose}/>
    <ellipse cx={246+53*join} cy="110" rx="16" ry="18" fill="#7cb6af" opacity={span(p,.55,.68)*(1-span(p,.84))}/>
    {[-1,1].map((v,i)=><g key={v} opacity={i?1:span(p,.54,.67)} transform={`translate(${i?312-10*join:246+49*join} 110)`}><Line d="m-3 -8 1 16m6 -9 2 7" w={3} c={i?rose:sea}/></g>)}
    <L x={123} y={64}>{genes?'One chromosome set':'Sperm'}</L><L x={306} y={34}>{genes?'One set from the egg':'Egg cell'}</L><L x={240} y={201}>{genes?'Fusion restores the paired set':'Both nuclei contribute to the zygote'}</L></g>;
}
function Chrom({x,y,c,len,single=false}:{x:number;y:number;c:string;len:number;single?:boolean}){
  return <g transform={`translate(${x} ${y})`}><Line d={`m-4 ${-len}q8 ${len} 0 ${2*len}`} c={c} w={4}/>{!single&&<Line d={`m4 ${-len}q-8 ${len} 0 ${2*len}`} c={c} w={4}/>}</g>;
}
export function Meiosis({p,beads}:{p:number;beads:boolean}){
  const a=span(p,.22,.59),b=span(p,.62),orient=span(p,0,.23);
  return <g><L x={240} y={23}>{beads?'Bead model · two homologous pairs':'Meiosis · two chromosome pairs shown'}</L>
    <ellipse cx="240" cy="107" rx="91" ry="57" opacity={1-a} fill="var(--repro-cell)" stroke={rose} strokeWidth="2"/>
    {[-1,1].map(side=>{const x=240+side*(22+84*a);return <g key={side}>
      <ellipse cx={x} cy="107" rx="47" ry="54" opacity={a*(1-b)} fill="var(--repro-cell)" stroke={rose} strokeWidth="2"/>
      {[-1,1].map(copy=><g key={copy}><ellipse cx={x+copy*28*b} cy={107+copy*36*b} rx="34" ry="27" opacity={b} fill="var(--repro-cell)" stroke={rose} strokeWidth="2"/>
        {[0,1].map(pair=>{
          const color=(pair===0)===(side===1)?sea:rose;
          const cx=x+(pair?1:-1)*11*b+copy*28*b+(pair?(-side*44*(1-orient)):0);
          const cy=107+(pair?17:-17)*(1-b)+copy*36*b;
          return beads?<g key={pair}>{many(pair?3:5,i=><circle key={i} cx={cx} cy={cy+(i-(pair?1:2))*4.5} r="3.5" fill={color} stroke="#fff3db" strokeWidth=".75"/>)}</g>:
            <g key={pair}><Chrom x={cx} y={cy} c={color} len={pair?7:11} single={b>.03}/></g>;
        })}</g>)}</g>;})}
    <L x={240} y={200}>{p<.23?'Pairs align independently':p<.61?'Homologues move to opposite poles':beads?'One bead string of each length per gamete':'Sister chromatids separate: four haploid cells'}</L></g>;
}
