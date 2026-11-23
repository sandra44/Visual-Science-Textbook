import { useState } from 'react';

const outline = 'M-38-18 Q-30-26-8-25 Q12-29 32-20 Q42-15 38 0 L34 19 Q32 24 20 24 L-24 24 Q-37 23-39 12Z';

export function PotatoExperiment({p, flat}:{p:number; flat:boolean}) {
  const [angle,setAngle] = useState(12);
  const [baseline,setBaseline] = useState(true);
  const soak = Math.max(0, Math.min(1,(p-.16)/.74));
  const drop = Math.min(1,p/.16);
  const depth = flat ? 0 : 8;
  return <div className="lesson-scene my-2 rounded-xl p-2" style={{perspective:800}}>
    <svg role="img" aria-label="Two potato pieces soaking in plain water and 20% salt solution" viewBox="0 0 460 207"
      className="mx-auto w-full max-h-[40vh]" style={{transform:flat?'none':`rotateY(${angle}deg)`}}>
      <defs>
        <linearGradient id="potato-flesh" x2=".9" y2="1"><stop stopColor="#fff2b5"/><stop offset=".6" stopColor="#e7c675"/><stop offset="1" stopColor="#c79752"/></linearGradient>
        <linearGradient id="beaker-water" x2="0" y2="1"><stop stopColor="#d7f2f5"/><stop offset="1" stopColor="#a1d7df"/></linearGradient>
      </defs>
      {[1,-1].map((side,i)=>{
        const x=i?340:120, scale=1+side*.19*soak,y=59+74*drop;
        return <g key={side} transform={`translate(${x} 0)`}>
          <text textAnchor="middle" y="16" fontWeight="600" fontSize="13">{i?'B · 20% salt solution':'A · Plain water'}</text>
          <path d="M-82 60l6 101q0 7 10 8h131q10-1 10-8l6-101" stroke="#548693" strokeWidth="2" fill="#eef9fa"/>
          <path d="M-79 91q38-3 78 0t80 0l-5 69q0 6-9 6H-65q-8 0-9-7Z" fill="url(#beaker-water)"/>
          {depth>0 && <ellipse cy="91" rx="78" ry={depth} fill="#d3edf1" stroke="#9ac9d0"/>}
          <path d="M-82 60l-6-5h169" fill="none" stroke="#548693" strokeWidth="2"/>
          {[0,1,2,3].map(n=><path key={n} d={`M-74 ${99+n*14}h9`} stroke="#658e96"/>)}
          <g transform={`translate(0 ${y}) scale(${scale})`}>
            {depth>0 && <path d={outline} transform="translate(4 -5)" fill="#e3bf79" stroke="#9c7942"/>}
            <path d={outline} fill="url(#potato-flesh)" stroke="#9e7138" strokeWidth="1.8"/>
            <path d="M-38 4q0 21 14 20h44q13 1 15-9l-7 2q-31 6-66-13Z" fill="#ae804a"/>
            {Array.from({length:18},(_,j)=><ellipse key={j} cx={-28+(j*19)%56} cy={-17+(j*9)%31} rx={j%3===0?1.8:1} ry=".8" fill="#b79559"/>)}
          </g>
          {baseline && soak>0 && <path transform={`translate(0 ${y})`} d={outline} fill="none" stroke="#755c49" strokeWidth="1.4" strokeDasharray="3 3"/>}
          {drop===1 && [-1,1].map(dir=>{
            const start=dir*(i?37:67),end=dir*(i?67:37);
            return <g key={dir}><path d={`M${start} 119h${end-start}m${dir*side*6} -4L${end} 119l${dir*side*6} 4`} fill="none" stroke="#036986" strokeWidth="2"/>
              <circle cx={start+(end-start)*((soak*4)%1)} cy="119" r="2.6" fill="#036986"/></g>;
          })}
          <text textAnchor="middle" y="188" fontSize="12" fontWeight="600">{soak===0?'Starting size':i?'Net water out · mass falls':'Net water in · mass rises'}</text>
        </g>;
      })}
    </svg>
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
      <span>{drop<1?'Placing equal-sized pieces':`Soaking · about ${Math.round(soak*60)} min (time-lapse)`}</span>
      <label><input type="checkbox" checked={baseline} onChange={e=>setBaseline(e.target.checked)}/> Show starting outline</label>
      {!flat && <label>Rotate view <input type="range" min="-32" max="32" value={angle} onChange={e=>setAngle(+e.target.value)}/></label>}
    </div>
  </div>;
}
