import type { ReactNode } from 'react';

export type SceneProps = {number: string; p: number; flat: boolean};
export const phase = (p: number, start = 0, end = 1) => Math.min(1, Math.max(0, (p - start) / (end - start)));
export const many = (n: number, fn: (i: number) => ReactNode) => Array.from({length:n}, (_,i) => fn(i));
export function Note({x,y,children}:{x:number;y:number;children:ReactNode}) {
  return <text x={x} y={y} textAnchor="middle" fill="#253d46" stroke="#fcfaf4" strokeWidth="3" paintOrder="stroke" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600">{children}</text>;
}
export function Onion({x,y,length,cut=false}:{x:number;y:number;length:number;cut?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-6 -36q9 -18 10 -33l5 11 -6 24q4 11 20 25c18 23 6 39 -22 40s-43 -17 -27 -38q18 -16 20 -29Z" fill="#e3ab66" stroke="#855c42" strokeWidth="2"/>
    {[-1,1].map(s=><path key={s} d={`M${s*4} -30Q${s*2} -13 ${s*13} 1T${s*5} 28`} fill="none" stroke="#aa734c" strokeWidth="2"/>)}
    {many(6,i=><path key={i} d={`M${(i-2.5)*6} 29 q${(i-2.5)*4} 15 ${(i-2.5)*5} ${23+8*Math.cos(i)}`} fill="none" stroke="#af8c55" strokeWidth="2"/>)}
    <path d={`M-4 29q2 23 0 ${length-29}q5 ${cut?0:10} 8 0 Q6 55 4 29Z`} fill="#ffe5a7" stroke="#937346" strokeWidth="1.5"/>
    {!cut&&<path d={`M-3 ${length-4}h7`} stroke="#b04e54" strokeWidth="5"/>}
  </g>;
}
export function Arm({x,y,angle,mode='muscle',scale=1,signal=0}:{x:number;y:number;angle:number;mode?:'muscle'|'ligament'|'bone'|'nerve';scale?:number;signal?:number}) {
  const a=angle*Math.PI/180, tx=42*Math.cos(a),ty=42*Math.sin(a), swell=Math.max(0,-Math.sin(a))*8;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round">
    <path d="M-8 -102q-10 -12 1 -18q15 -6 19 7l-6 13 -1 74q12 14 5 23q-9 12 -23 0q-6 -7 3 -19Z" fill="#f4e2ba" stroke="#89724f" strokeWidth="2"/>
    <g transform={`rotate(${angle})`} fill="#f4e2ba" stroke="#89724f" strokeWidth="2">
      <path d="M-8 -7q9 -10 21 1l85 3q12 -7 17 2q1 9 -11 10L17 2Q3 15 -8 6Z"/>
      <path d="M10 11q8 -7 17 -2l68 6q13 -4 16 4q1 8 -14 6l-71 -13q-10 5 -16 -1Z"/>
    </g>
    {mode==='ligament'?<path d={`M-9 -17 Q-18 8 ${21*Math.cos(a)} ${21*Math.sin(a)+11}l3 -7Q-3 1 0 -16Z`} fill="#408f91" stroke="#24656a" strokeWidth="2"/>:mode!=='bone'&&<>
      <path d={`M6 -98Q${42+swell} -76 ${15+swell} -31Q9 -15 ${tx} ${ty}Q7 -9 7 -29Q-2 -53 6 -98Z`} fill="#d37666" stroke="#9a5146" strokeWidth="2"/>
      <path d={`M${15+swell} -31 Q9 -15 ${tx} ${ty}`} fill="none" stroke="#ead39b" strokeWidth="4"/>
      <path d={`M-6 -101Q${-37+swell} -65 -15 ${-29+swell}L${-9*Math.cos(a)} ${-9*Math.sin(a)}Q-12 -17 -9 ${-34+swell}Q-1 -73 -6 -101Z`} fill="#db9c82" stroke="#a66754" strokeWidth="1.5"/>
      {many(3,i=><path key={i} d={`M${7+i*3} -83Q${20+i*4+swell} -59 ${10+i*2} -36`} stroke="#f6c1ad" fill="none"/>)}
      {mode==='nerve'&&<><path d="M-36 -117q44 7 43 54l12 12m-12 -12 4 17" stroke="#b89627" strokeWidth="3" fill="none"/><circle cx={-36+52*signal} cy={-116+65*signal*signal} r="5" fill="#ffca28"/></>}
    </>}
  </g>;
}
