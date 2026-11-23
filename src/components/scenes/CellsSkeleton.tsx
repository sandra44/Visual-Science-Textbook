import {Arm, many, Note, phase, type SceneProps} from './CellsArt';

const bone='#f1dfb8', edge='#927951';
function Skull({x,y,s=1,turn=0,suture=false,p=0}:{x:number;y:number;s?:number;turn?:number;suture?:boolean;p?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 -1q-8 -47 37 -51q45 -1 47 36q2 19 -9 29l-3 15 -12 3 -6 15h-26l-6 -16 -13 -4 -2 -16Z" fill={bone} stroke={edge} strokeWidth="2"/>
    <g transform={`translate(${turn*10} 0) scale(${1-.23*Math.abs(turn)} 1)`} fill="#756b5c"><ellipse cx="-18" cy="5" rx="10" ry="8"/><ellipse cx="17" cy="5" rx="10" ry="8"/><path d="m0 10 -5 12h10Z"/><path d="M-16 30q14 5 31 0m-22 0v6m7 -6v6m7 -6v6" fill="none" stroke="#a58f68"/></g>
    {suture&&<path d="m-39 -18 5 1 1 -4 4 3 2 -6 6 4 3 -6 6 3 4 -4 5 4 5 -3 3 4 6 -3 4 6 5 -3 4 7 6 -2 3 5" stroke="#8c674d" fill="none" strokeWidth={1+1.5*p}/>}</g>;
}
function Shoulder({x,y,s=1,p}:{x:number;y:number;s?:number;p:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill={bone} stroke={edge} strokeWidth="2">
    <path d="M-64 -18q10 -15 29 -7l28 8q-15 14 -2 27l-34 48q-12 -21 -11 -46Z"/>
    <path d="M-6 -17q-14 15 -1 30" fill="none" stroke="#75aaa5" strokeWidth="5"/>
    <g transform={`rotate(${-20-86*p}) scale(1 ${1-.2*Math.sin(Math.PI*p)})`}><path d="M-8 -11q6 -9 15 -4q15 6 8 20l-7 12 -1 65q9 9 1 15q-7 4 -14 -3q-4 -6 2 -13l-1 -65 -7 -10q-5 -10 4 -17Z"/></g></g>;
}
function Pivot({x,y,p,s=1}:{x:number;y:number;p:number;s?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-29 38q23 -12 53 0l1 20 -52 1Z" fill={bone} stroke={edge} strokeWidth="2"/><path d="M-5 42V-2q0 -9 6 -9q7 1 7 9v44" fill="#d4ad71" stroke={edge} strokeWidth="2"/>
    <g transform={`translate(0 22) rotate(${-16+36*p})`}><path d="M-43 -4q15 -17 43 -13q25 -3 41 11l-3 12q-33 15 -76 0Zm15 0q22 10 52 1q-21 -13 -52 -1Z" fillRule="evenodd" fill="#ead1a0" stroke={edge} strokeWidth="2"/></g>
    <Skull x={0} y={-48} s={.77} turn={2*p-1}/></g>;
}
function Ribs({p}:{p:number}){
  return <g><path d="M230 93q-26 10 -32 40q-6 20 17 13l19 -13Z M247 93q26 10 30 39q6 21 -14 16l-19 -15Z" fill="#d39694" opacity={phase(p,.4,.85)}/><path d="M239 122q9 -10 15 0q7 13 -11 24q-21 -18 -4 -24Z" fill="#aa6869" opacity={phase(p,.45,.9)}/>
    {many(13,i=><rect key={i} x={233+1.3*Math.sin(i)} y={71+8*i} width="14" height="8" rx="3" fill={bone} stroke={edge}/>)}<path d="M240 72v107" stroke="#b78d32" strokeWidth="2.5" opacity={.25+.75*p}/>
    {many(8,i=><g key={i}>{[-1,1].map(s=><path key={s} d={`M${240+s*5} ${89+i*6}q${s*(62-3*i)} ${-14+1.4*i} ${s*(59-2*i)} 7q${-2*s} 16 ${-s*(52-i*2)} 27`} fill="none" stroke={edge} strokeWidth="4.5"/>)}</g>)}
    <path d="M240 100v53" stroke={bone} strokeWidth="7"/><Skull x={240} y={51} s={.65}/><path d="M218 46q-7 -22 16 -24q18 -7 26 12q4 11 -10 12l-13 -4Z" fill="#ca9bb2" opacity={.4+.5*(1-p)}/></g>;
}
export default function Skeleton({number,p}:SceneProps) {
  switch(number){
    case '3.5':return <g><Arm x={71} y={132} angle={18-75*p} scale={.6} mode="bone"/><Pivot x={232} y={111} p={p} s={.73}/><Shoulder x={380} y={89} s={.77} p={p}/>
      <Note x={85} y={194}>Elbow · hinge</Note><Note x={232} y={194}>Neck · pivot</Note><Note x={389} y={194}>Ball and socket</Note></g>;
    case '3.5.1':return <g><Shoulder x={218} y={72} p={p} s={1.2}/><Note x={109} y={55}>Shoulder blade</Note><Note x={270} y={38}>Rounded head</Note><path d="m249 42 -23 22M161 100l39 -21" fill="none" stroke={edge}/><Note x={140} y={116}>Socket</Note><Note x={253} y={205}>Upper arm sweeps around the socket</Note></g>;
    case '3.5.3':return <g><Pivot x={232} y={121} p={p} s={1.09}/><path d="M269 143l41 -12h19m-90 38 81 9h20" fill="none" stroke={edge}/><Note x={365} y={131}>Atlas (ring)</Note><Note x={375} y={182}>Axis (pivot)</Note><Note x={122} y={77}>Head turns</Note></g>;
    case '3.5.4':return <g><Skull x={122} y={113} s={1.45} suture p={p}/><path d="M166 70l94 -25m-94 47 94 43" stroke="#a79882" strokeDasharray="3 4" fill="none"/>
      <g transform={`translate(341 96) scale(${1+.12*p})`}><ellipse rx="72" ry="50" fill={bone} stroke={edge} strokeWidth="2"/><path d="m-71 -2 12 4 4 -8 8 11 6 -15 8 13 10 -8 8 10 4 -14 7 9 10 -4 5 13 6 -11 11 5 7 -7 11 4" fill="none" stroke="#93714f" strokeWidth={2+p*2}/></g><Note x={337} y={171}>Interlocking bone edges</Note><Note x={124} y={205}>Skull suture · fixed joint</Note></g>;
    case '3.6':return <g><Ribs p={p}/><path d="M182 45h37m-40 88h29m38 38 63 4" stroke={edge} fill="none"/><Note x={135} y={48}>Brain in skull</Note><Note x={121} y={136}>Ribs guard organs</Note><Note x={374} y={178}>Vertebral column</Note></g>;
    case 'Activity 3.5':return <g><path d="M223 79q-28 -5 -37 19l7 73 72 3 14 -75q-16 -21 -37 -20Z" fill="#afcaca" stroke="#67888b" strokeWidth="2"/><Skull x={232} y={52} s={.61} turn={phase(p,.3,.72)*2-1}/>
      <Arm x={187} y={151} angle={-155+81*phase(p,0,.45)} scale={.49} mode="bone"/><Shoulder x={277} y={99} s={.7} p={phase(p,.56,1)}/>
      <Note x={98} y={164}>Bend elbow</Note><Note x={317} y={47}>Turn head</Note><Note x={363} y={190}>Sweep arm</Note></g>;
    default:throw new Error(`Unknown skeleton scene: ${number}`);
  }
}
