import { Fetus, L, Line, Sperm, many, rose, sea, span } from './LifeEarthReproArt';

const uterus='M-57 -32C-31 -44 31 -44 57 -32C52 -5 39 18 17 35Q9 42 12 70H-12Q-9 42 -17 35C-39 18 -52 -5 -57 -32Z';
const cavity='M-45 -27Q0 -38 45 -27Q23 -6 8 22L0 56L-8 22Q-23 -6 -45 -27Z';
export function Uterus({lining=7}:{lining?:number}){
  return <g>{[-1,1].map(side=><g key={side} transform={`scale(${side} 1)`}>
    <path d="M48 -32C69 -35 80 -74 113 -52Q130 -42 123 -21" fill="none" stroke="#b97680" strokeWidth="8"/><Line d="M48 -32C69 -35 80 -74 113 -52Q130 -42 123 -21" c="#f9c8b6" w={3}/>
    {many(5,i=><Line key={i} d={`M124 -27q${i-5} 10 ${i*3-11} ${i+10}`} c={rose} w={2.5}/>)}
    <ellipse cx="109" cy="-14" rx="16" ry="10" fill="#eabc9e" stroke="#ab7967" transform="rotate(-23 109 -14)"/>
    {many(4,i=><circle key={i} cx={100+i*5} cy={-13-i%2*4} r={2+i%2} fill="#fbedcb" stroke="#c79678"/>)}</g>)}
    <path d={uterus} fill="var(--repro-petal)" stroke="#aa6875" strokeWidth="2"/><path d={cavity} fill="#fff1da" stroke="#ce8483" strokeWidth={lining} strokeLinejoin="round"/>
  </g>;
}
// Centreline samples keep the moving cell within the curved oviduct.
const route=[[109,-14],[119,-22],[125,-33],[122,-43],[114,-51],[104,-57],[94,-58],[84,-55],[73,-48],[62,-38],[49,-32],[38,-27],[28,-17],[20,-8]];
function point(t:number){
  const k=span(t)*(route.length-1),i=Math.min(route.length-2,Math.floor(k)),s=k-i;
  return route[i].map((n,j)=>n+(route[i+1][j]-n)*s);
}
export function Female({number,p}:{number:string;p:number}){
  const cycle=number==='11.5.6',development=number==='11.5',shed=span(p,.35);
  const [x,y]=point(development?.37+.63*span(p,0,.7):p),grow=development?span(p,.7):0;
  return <g><g transform="translate(240 115)"><Uterus lining={cycle?10+2*span(p,0,.35)-9*shed:7}/>
    {!cycle?<><g transform={`translate(${x} ${y})`}><circle r={5+6*grow} fill="#f9e2b4" stroke="#9a6e49" strokeWidth="1.5"/>
      {development&&many(8,i=><circle key={i} cx={Math.cos(i*2.4)*3} cy={Math.sin(i*2.4)*3} r="1.8" fill="#ac7f88" opacity={span(p,i*.06,i*.06+.12)}/>)}</g>
      {development&&<g opacity={grow}><Fetus x={x} y={y} s={.24*grow}/></g>}</>:
      many(8,i=>{const t=span((shed-.055*i)/.6);return <path key={i} d={`M${(i%2?1:-1)*(23-i*2)*(1-t)} ${2+11*(i%3)+t*72}q4 -2 5 3l-3 2Z`} fill="#b97571" opacity={Math.sin(t*Math.PI)}/>;})}</g>
    {cycle?<><L x={240} y={25}>Uterine lining without pregnancy</L><L x={240} y={207}>{p<.35?'Thick, supported lining':'Support falls; part of the lining is shed'}</L></>:
      <><Line d="M351 104l35 18h32"/><L x={424} y={118}>Ovary</L><Line d="M332 56l25 -22h27"/><L x={397} y={29}>Oviduct</L><Line d="M213 118l-58 24h-43"/><L x={90} y={138}>Uterus</L><L x={240} y={207}>{development?(p<.69?'Division during passage through the tube':'Implantation in the uterine lining'):'Egg released into the oviduct'}</L></>}
  </g>;
}
export function Male({p}:{p:number}){
  const knots=[[189,145],[197,133],[200,112],[213,110],[226,120],[228,137],[220,157],[227,161],[232,150],[229,129],[222,108],[226,84],[239,59],[256,44],[273,40],[288,47],[304,65],[313,82]];
  const u=p*(knots.length-1),i=Math.min(Math.floor(u),knots.length-2);
  const [x,y]=knots[i].map((v,j)=>v+(knots[i+1][j]-v)*(u-i));
  return <g><path d="M144 117q-20 57 24 69q40 15 65 -20q16 -31 -1 -57" fill="#f3d9c3" stroke="#bc9585" strokeWidth="2"/>
    <ellipse cx="191" cy="145" rx="32" ry="35" fill="var(--repro-cell)" stroke="#a77372" strokeWidth="2"/>
    {many(5,i=><Line key={i} d={`M${171+i*2} ${127+i*8}q9 -9 14 0t12 -1t12 0`} c="#bd8c82" w={2}/>)}
    <path d="M215 160q27 -19 12 -45q-9 -17 -28 -7l4 8q18 -3 18 18Z" fill="#c69380" stroke="#966d61"/>
    {many(7,i=><Line key={i} d={`M${221+4*Math.sin(i/2)} ${116+i*5}l6 3`} c="#a47668"/>)}
    <path d="M219 158q15 13 13 -12q-1 -17 -10 -38C222 69 263 21 288 47Q311 60 313 82" fill="none" stroke="#a47869" strokeWidth="8"/><Line d="M219 158q15 13 13 -12q-1 -17 -10 -38C222 69 263 21 288 47Q311 60 313 82" c="#fae2c6" w={4}/>
    <Sperm x={x} y={y} p={p} scale={.38}/><Line d="M82 146h77"/><L x={72} y={140}>Testis</L>
    <Line d="M232 137l58 19h38"/><L x={369} y={158}>Epididymis</L><Line d="M276 43l41 -15h27"/><L x={383} y={26}>Sperm duct</L></g>;
}
export function Placenta({p}:{p:number}){
  const t=span(p,.17,.7),f=span(p,.62);
  return <g><path d="M27 54q53 -19 97 -3t74 0v107q-38 -13 -76 0t-95 0Z" fill="#e6b7aa" stroke="#c88d85"/>
    <path d="M32 83q34 -22 66 -8q31 18 75 -7v59q-38 -9 -70 3q-48 19 -71 1Z" fill="#f5d5c4"/>
    <path d="M194 48q22 2 30 12v94q-14 13 -30 9Z" fill="var(--repro-petal)" stroke="#b3777b"/>
    {[69,104,140].map((y,i)=><g key={y}><path d={`M202 ${y-4}q-29 1 -41 -9q-14 -8 -17 2q-1 5 11 11q-22 -8 -29 -2q-6 8 12 13q27 6 64 -1Z`} fill="#e6a9a2" stroke="#b67879"/>
      <Line d={`M213 ${y+3}q-41 11 -68 -1q35 4 68 -5`} c={i===1?sea:'#638b98'} w={2.6}/></g>)}
    <ellipse cx="350" cy="108" rx="69" ry="73" fill="#eadfd6" stroke="#bf9791" strokeWidth="3"/><Fetus x={350} y={108} s={1.18}/>
    <path d="M217 99C270 48 275 182 336 120" stroke="#b58b87" fill="none" strokeWidth="12"/><Line d="M217 99C270 48 275 182 336 120" c="#ecd1b7" w={8}/><Line d="M217 99C270 48 275 182 336 120" c={sea} w={2.5}/>
    {many(5,i=><circle key={i} cx={45+i*13+46*span(p,0,.3)+52*t} cy={94+i%2*7+9*t} r="3.2" fill="#b58527"/>)}
    <Line d="M149 105q37 7 68 -6C270 48 275 182 336 120" progress={f} c="#cc962f" w={3}/>
    <L x={85} y={37}>Maternal blood</L><L x={211} y={29}>Placenta</L><L x={324} y={196}>Umbilical cord → fetal blood</L><L x={104} y={185}>Oxygen + nutrients</L></g>;
}
