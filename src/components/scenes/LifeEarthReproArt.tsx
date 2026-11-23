import type { ReactNode } from 'react';

export type Frame = { number: string; p: number; flat: boolean };
export const span = (p: number, a = 0, b = 1) => Math.max(0, Math.min(1, (p-a)/(b-a)));
export const many = (n: number, draw: (i:number)=>ReactNode) => Array.from({length:n}, (_,i)=>draw(i));
export const ink = '#364d51', sea = '#288e91', rose = '#bd6574', amber = '#b48124';
export function L({x,y,children,anchor='middle'}:{x:number;y:number;children:ReactNode;anchor?:'start'|'middle'|'end'}) {
  return <text x={x} y={y} textAnchor={anchor} fill={ink} stroke="#fffaf0" strokeWidth="3" paintOrder="stroke" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="600">{children}</text>;
}
export function Line({d,c=ink,w=1.6,progress=1}:{d:string;c?:string;w?:number;progress?:number}) {
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={progress<1?`${progress} 2`:undefined} opacity={progress>0?1:0}/>;
}
export function Egg({x,y,r=35}:{x:number;y:number;r?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${r/35})`}>
    <circle r="35" fill="var(--repro-cell)" stroke={rose} strokeWidth="2"/><circle r="30" stroke="#d49997" fill="none"/>
    {many(14,i=><circle key={i} cx={24*Math.cos(i*2.4)} cy={24*Math.sin(i*2.4)} r={1+i%2} fill="#c48b80"/>)}
  </g>;
}
export function Sperm({x,y,p=0,scale=1}:{x:number;y:number;p?:number;scale?:number}){
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><Line d={`M-4 0q-12 ${-12*Math.cos(p*12)} -23 0t-22 2`} c={sea} w={2}/><ellipse rx="7" ry="4" fill="#6eb6b3" stroke="#236e76"/></g>;
}
export function Leaf({x,y,s=1,flip=false}:{x:number;y:number;s?:number;flip?:boolean}){
  return <g transform={`translate(${x} ${y}) scale(${flip?-s:s} ${s})`}>
    <path d="M0 0Q2 -25 37 -26Q33 -2 0 0Z" fill="var(--repro-leaf)" stroke="#497248"/><Line d="M1 -1Q19 -16 33 -23m-21 16 1 -9m7 3 7 -1" c="#59864e" w={1}/>
  </g>;
}
export function Flower({x,y,s=1,open=1,inner=0}:{x:number;y:number;s?:number;open?:number;inner?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Line d="M0 9Q-4 44 2 70" c="#557d46" w={5}/><Leaf x={-1} y={48} s={.65}/>
    {[-1,1].map(side=><g key={side} transform={`scale(${side} 1)`}>
      <path d={`M0 6Q${15+30*open} -12 ${7+42*open} ${-53+22*open}Q${4+8*open} -67 0 1Z`} fill="var(--repro-petal)" stroke={rose} opacity={1-inner*.55}/>
      <path d={`M1 11Q${14+15*open} 10 ${8+29*open} ${-43+34*open}Q9 -1 1 2Z`} fill="var(--repro-leaf)" stroke="#527c49"/>
      <Line d="M4 1Q18 -12 17 -31" c="#a78d48" w={2.8}/><ellipse cx="17" cy="-32" rx="4" ry="8" fill="#ebb747" stroke={amber} transform="rotate(14 17 -32)"/>
    </g>)}
    <ellipse cy="2" rx="10" ry="14" fill="#a6c584" stroke="#567f4e"/><Line d="M0 -5V-42" c="#7f9e5d" w={5}/><path d="M-8 -44q3 -7 8 -2q6 -6 9 0q-3 8 -10 6Z" fill="#94b678" stroke="#5f834f"/>
    {[-3,3].map(a=><ellipse key={a} cx={a} cy={2+a} rx="2.8" ry="3.8" fill="#fff1b9" stroke="#9f8a51"/>)}
  </g>;
}
export function Bee({x,y,s=1}:{x:number;y:number;s?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -4C-25 -27 -1 -28 3 -8C10 -30 24 -18 8 -6Z" fill="#dcebef" stroke="#7899a3"/>
    <ellipse rx="15" ry="8" fill="#e7ae40" stroke="#674f37"/><path d="M-7 -6q4 6 0 13m8 -14q4 7 0 14" fill="none" stroke="#554a37" strokeWidth="4"/><circle cx="14" cy="-2" r="6" fill="#66553d"/><Line d="m17 -6 4 -6M-2 5l-7 8m16 -9 4 8" c="#66553d"/>
  </g>;
}
export function Fetus({x,y,s=1}:{x:number;y:number;s?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M4 -6C-12 -8 -20 -24 -10 -35C2 -49 25 -39 27 -24Q28 -16 22 -12l2 4 -8 3C33 10 21 36 1 37C-21 38 -28 17 -17 7Q-10 -3 4 -6Z" fill="var(--repro-cell)" stroke="#ae7174" strokeWidth="2"/>
    <Line d="M15 -21q4 2 7 0M13 -4q-7 7 -1 15l13 -4M-8 14q-14 19 8 17l8 -10" c="#ac7373" w={2.2}/>
  </g>;
}
