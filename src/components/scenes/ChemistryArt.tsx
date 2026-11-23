import type { ReactNode } from 'react';

export type SceneProps = { number: string; p: number; flat: boolean };
export const times = (n: number, f: (i: number) => ReactNode) => Array.from({length:n}, (_,i) => f(i));
export const mix = (a:number,b:number,t:number) => a+(b-a)*t;
export const clamp = (v:number) => Math.min(1,Math.max(0,v));
export const ink='#284253', water='#afe5ed', blue='#247baf', red='#c54d49', gold='#e9b752', green='#388a73';
export function Label({x=240,y=200,children,size=14,color=ink}:{x?:number;y?:number;children:ReactNode;size?:number;color?:string}) {
  return <text x={x} y={y} fontSize={size} fontWeight="600" fill={color} stroke="none" textAnchor="middle">{children}</text>;
}
export function Ball({x,y,r,color,label,flat}:{x:number;y:number;r:number;color:string;label?:string;flat:boolean}) {
  return <g><circle cx={x} cy={y} r={r} fill={color} stroke={ink} strokeWidth={r>6?1.4:0.6}/>
    {!flat&&<><path d={`M${x-r*.88} ${y+r*.35}a${r} ${r} 0 0 0 ${1.83*r} ${-r*.6}q${-.5*r} ${r*1.36} ${-1.83*r} ${r*.6}`} fill="#132632" opacity=".22"/><ellipse cx={x-r*.31} cy={y-r*.45} rx={r*.27} ry={r*.12} fill="white" opacity=".59"/></>}
    {label&&<Label x={x} y={y+r*.31} size={Math.max(8,r*.88)} color="#132c39">{label}</Label>}</g>;
}
// Children use coordinates relative to the centre of the beaker's base.
export function Beaker({x,y=168,w=108,h=110,level=.65,color=water,flat,children}:{x:number;y?:number;w?:number;h?:number;level?:number;color?:string;flat:boolean;children?:ReactNode}) {
  const l=-w/2, r=w/2, top=-h*level, d=flat?0:5;
  return <g transform={`translate(${x} ${y})`}>
    {!flat&&<ellipse cy="5" rx={w*.55} ry="6" fill="#687981" opacity=".15"/>}
    <path d={`M${l} ${-h}V-5Q${l} 0 ${l+5} 0H${r-5}Q${r} 0 ${r} -5V${-h}Z`} fill="#e9f7fb" fillOpacity=".6"/>
    <path d={`M${l+2} ${top}q${w*.48} ${2*d} ${w-4} 0V-5Q${r-2} -1 ${r-6} -1H${l+6}Q${l+2} -1 ${l+2} -5Z`} fill={color}/>
    {!flat&&<ellipse cy={top} rx={r-2} ry={d} fill={color} stroke="#699aa3" strokeWidth=".8"/>}
    {children}
    <path d={`M${l-6} ${-h-3}l6 6V-5Q${l} 1 ${l+6} 1H${r-6}Q${r} 1 ${r} -5V${-h}h4`} stroke={ink} strokeWidth="2.3" fill="none"/>
    {times(4,i=><path key={i} d={`M${r-3} ${-h*.18*(i+1)}h-8`} stroke="#526e78"/>)}
    {!flat&&<path d={`M${l+6} ${-h+10}v${h*.69}`} stroke="#fff" strokeWidth="3" opacity=".8"/>}
  </g>;
}
