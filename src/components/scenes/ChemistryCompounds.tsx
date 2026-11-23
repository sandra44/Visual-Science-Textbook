import { Ball, Beaker, Label, blue, clamp, gold, green, ink, mix, times, water, type SceneProps } from './ChemistryArt';

const hColor='#c3e4ec',oColor='#eca29b',naColor='#c9b7df',clColor='#b0d9a9';
function WaterMolecule({x,y,scale=1,p=1,flat}:{x:number;y:number;scale?:number;p?:number;flat:boolean}){
  const dx=53-27*p,dy=26-6*p;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d={`M${-dx} ${dy}L0 0l${dx} ${dy}`} stroke={ink} strokeWidth="4" opacity={p}/><Ball x={0} y={0} r={19} color={oColor} label="O" flat={flat}/>{[-1,1].map(s=><Ball key={s} x={s*dx} y={dy} r={13} color={hColor} label="H" flat={flat}/>)}</g>;
}
function Balance({number,p,flat}:SceneProps){
  const salt=number==='A9.1',closed=number==='A9.3';
  return <g><rect x="108" y="150" width="194" height="9" rx="4" fill="#879ba6" stroke={ink}/><path d="M122 159h165l16 30H108Z" fill="#d2dee0" stroke={ink}/><rect x="161" y="164" width="85" height="20" rx="3" fill="#dceacb" stroke={ink}/><Label x={204} y={179} size={14}>{(100-(closed||salt?0:1.4*p)).toFixed(1)} g</Label>
    {salt?<Beaker x={204} y={149} w={115} h={107} flat={flat}>{times(30,i=><Ball key={i} x={mix((i%6-2.5)*6,((i*31)%97)-48,p)} y={mix(-4-Math.floor(i/6)*5,-6-((i*19)%55),p)} r={2.5} color={i%2?gold:green} flat={flat}/>)}</Beaker>:<><path d="M188 39h32v39l40 61q4 10-9 10h-95q-11 0-6-10l38-61Z" fill="#edf8fa" stroke={ink} strokeWidth="2"/><path d="M173 105q31 4 62 0l23 35q3 7-8 7h-92q-11 0-6-7Z" fill={closed?'#accbd4':water}/>
      {closed?<><rect x="187" y="31" width="34" height="12" rx="2" fill="#a78562" stroke={ink}/>{times(38,i=><circle key={i} cx={173+(i*17)%62} cy={mix(108+(i*19)%30,144-(i%3)*2,p)} r="3" fill="#fff" opacity={p}/>)}</>:times(10,i=>{const t=clamp(p*1.7-i*.077);return <circle key={i} cx={201+Math.sin(i+t*7)*6+clamp(t-.67)*80} cy={134-t*126} r={2.6+t*2} stroke={blue} opacity={t>0&&t<1?.8:0}/>;})}</>}
    <Label x={374} y={81}>{salt?'Salt disperses':closed?'White solid forms':'CO₂ escapes'}</Label><Label x={374} y={104} size={12}>{closed?'Sealed flask':salt?'Nothing leaves':'Open flask'}</Label><Label y={212}>{salt||closed?'Example reading · total mass stays constant':'Example reading · lost mass is in the escaped gas'}</Label></g>;
}
function Shared({p,flat}:{p:number;flat:boolean}){
  const x=164+p*48,xx=316-p*48;
  return <g>{[x,xx].map((cx,i)=><g key={i}><circle cx={cx} cy="95" r="36" fill="#9fc9de" fillOpacity=".16" stroke="#729aad"/><Ball x={cx} y={95} r={12} color={hColor} label="H" flat={flat}/></g>)}
    <circle cx={mix(x+25,240,p)} cy="91" r="4" fill={blue}/><circle cx={mix(xx-25,240,p)} cy="101" r="4" fill={green}/><Label>H₂ · each hydrogen contributes one electron</Label></g>;
}
function Transfer({p,flat}:{p:number;flat:boolean}){
  const t=clamp(p*1.5),end=t===1;
  return <g><Ball x={149} y={99} r={28} color={naColor} label={end?'Na⁺':'Na'} flat={flat}/><Ball x={330} y={99} r={28} color={clColor} label={end?'Cl⁻':'Cl'} flat={flat}/>
    {times(7,i=>{const a=i*Math.PI/4+Math.PI/4*5;return <circle key={i} cx={330+42*Math.cos(a)} cy={99+42*Math.sin(a)} r="4" fill={green}/>;})}<circle cx={mix(188,288,t)} cy={99-15*Math.sin(t*Math.PI)} r="4.5" fill={blue}/><Label x={149} y={168}>{end?'Sodium ion':'Sodium'}</Label><Label x={330} y={168}>{end?'Chloride ion':'Chlorine'}</Label><Label>One outer electron transfers from Na to Cl</Label></g>;
}
function Conductivity({number,p,flat}:SceneProps){
  const solution=number==='A9.4';
  return <g>{[0,1].map(i=>{const x=126+i*228,mobile=solution?i===0:i===1;
    return <g key={i}><Beaker x={x} w={126} h={91} flat={flat} color={solution?water:i?'#edd6b2':'#f5e7d3'}>{times(12,j=>{const sx=(j%6-2.5)*16,sy=-14-28*Math.floor(j/6),charge=(j+Math.floor(j/6))%2;
      if(solution&&i)return <g key={j} transform={`translate(${sx+3*Math.sin(p*7+j)} ${sy+3*Math.cos(p*6+j)})`}><path d="M-4 0l2-3h4l2 3-2 3h-4Z" fill="#a88b68" stroke="#705f4c"/></g>;
      const dx=mobile?(charge?-1:1)*p*8+3*Math.sin(j*2+p*5):0,dy=mobile?5*Math.sin(j+p*7):0;
      return <Ball key={j} x={sx+dx} y={sy+dy} r={mobile?6.5:8} color={charge?naColor:clColor} label={charge?'+':'−'} flat={flat}/>;})}</Beaker>
      <path d={`M${x-42} 129V49h32m20 0h32v80`} stroke={ink} strokeWidth="2"/><circle cx={x} cy="49" r="12" fill={mobile?'#ffdd65':'#d3d9db'} stroke={ink}/><path d={`M${x-7} 52l3-7 4 7 4-7 3 7`} stroke="#796d42"/><path d={`M${x-42} 103v30m84-30v30`} stroke="#69777f" strokeWidth="5"/>
      <path d={`M${x+42} 66v12`} stroke="#fcfaf5" strokeWidth="4"/><path d={`M${x+34} 68h16m-12 6h8`} stroke={ink} strokeWidth="2"/>
      <Label x={x} y={189}>{solution?(i?'Sugar solution':'Salt solution'):i?'Molten salt':'Solid salt'}</Label><Label x={x} y={207} size={12}>{mobile?'Mobile ions · conducts':solution?'Neutral molecules · lamp off':'Fixed ions · lamp off'}</Label></g>;
  })}</g>;
}
export default function Compounds(props:SceneProps){
  const {number,p,flat}=props;
  switch(number){
    case 'A9.1':case 'A9.2':case 'A9.3':return <Balance {...props}/>;
    case '9.1':{const atoms=[[94,74,120,109],[120,74,168,109],[346,74,312,109],[372,74,360,109],[218,125,144,90],[253,125,336,90]];
      return <g><rect x="46" y="45" width="388" height="112" rx="20" stroke="#9fb6bf" strokeDasharray="4 4"/>{[[0,1],[2,3],[4,5],[0,4],[1,4],[2,5],[3,5]].map(([a,b],i)=><path key={i} d={`M${mix(atoms[a][0],atoms[a][2],p)} ${mix(atoms[a][1],atoms[a][3],p)}L${mix(atoms[b][0],atoms[b][2],p)} ${mix(atoms[b][1],atoms[b][3],p)}`} stroke={ink} opacity={i<3?clamp(1-4*p):clamp(4*p-3)} strokeWidth="3"/>)}{atoms.map(([x,y,tx,ty],i)=><Ball key={i} x={mix(x,tx,p)} y={mix(y,ty,p)} r={i<4?11:16} label={i<4?'H':'O'} color={i<4?hColor:oColor} flat={flat}/>)}<Label>2 H₂ + O₂ → 2 H₂O · four H atoms and two O atoms throughout</Label></g>;}
    case '9.2':return <g>{[1,1+p].map((n,i)=><g key={i}><Beaker x={125+i*225} flat={flat} level={n*.32}>{times(3+Math.round((n-1)*3),j=><WaterMolecule key={j} x={-28+(j%3)*28} y={-20-Math.floor(j/3)*25} scale={.33} flat={flat}/>)}</Beaker><Label x={125+i*225} y={190}>{Number(n.toFixed(2))} g H : {Number((8*n).toFixed(2))} g O</Label></g>)}<Label y={212} size={13}>Water has the same H : O mass ratio in either sample</Label></g>;
    case '9.3':return <g>{times(3,i=>{const x=105+135*i;return <g key={i}><Ball x={x} y={90} r={22} label="A" color={gold} flat={flat}/>{[-1,1].map(j=><Ball key={j} x={x+j*(52-24*p)} y={110} r={15} label="B" color={clColor} flat={flat}/>)}</g>;})}<Label>Dalton’s model · each AB₂ group has one A atom and two B atoms</Label></g>;
    case '9.4':return p<.5?<g><Label y={31}>Covalent bonding · sharing</Label><Shared p={2*p} flat={flat}/></g>:<g><Label y={31}>Ionic bonding · transfer</Label><Transfer p={(p-.5)*2} flat={flat}/></g>;
    case '9.4.1':return <Shared p={p} flat={flat}/>;
    case '9.4.2':return <Transfer p={p} flat={flat}/>;
    case '9.5':case '9.5.1':case '9.7':return <g><WaterMolecule x={165} y={90} scale={1.45} p={p} flat={flat}/><Label x={349} y={103} size={32}>{number==='9.7'?'18 u':'H₂O'}</Label><Label x={350} y={131} size={12}>{number==='9.7'?'2 × 1 u + 16 u':'2 hydrogen · 1 oxygen'}</Label><Label>{number==='9.7'?'Molecular mass is the sum of the three atomic masses':number==='9.5.1'?'Write ₂ beside H; omit the 1 beside O':'H and O identify elements; ₂ counts hydrogen atoms'}</Label></g>;
    case '9.5.2':return <g><Ball x={240} y={94} r={29} label="Mg²⁺" color={naColor} flat={flat}/>{[-1,1].map(i=><Ball key={i} x={240+i*(140-75*p)} y={94} r={26} label="Cl⁻" color={clColor} flat={flat}/>)}<Label y={163} size={23}>MgCl₂</Label><Label>Charge balance · (+2) + (−1) + (−1) = 0</Label></g>;
    case '9.6':case 'A9.4':return <Conductivity {...props}/>;
    case '9.8':return <g>{times(12,i=>{const plus=(i%4+Math.floor(i/4))%2===0,chosen=i===5||i===6;return <g key={i} opacity={chosen?1:1-.7*p}><Ball x={109+i%4*31} y={65+Math.floor(i/4)*31} r={15} color={plus?naColor:clColor} label={plus?'Na⁺':'Cl⁻'} flat={flat}/></g>;})}<rect x="122" y="78" width="66" height="36" rx="15" stroke={ink} strokeWidth="2" opacity={p}/><Label x={338} y={85}>23 u + 35.5 u</Label><Label x={338} y={118} size={24}>58.5 u</Label><Label>NaCl · one formula unit counts one ion of each kind</Label></g>;
    default:throw new Error(`Unknown compound scene: ${number}`);
  }
}
