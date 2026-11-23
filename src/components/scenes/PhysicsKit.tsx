import type { ReactNode } from 'react';

export type PhysicsProps = { number: string; p: number; flat: boolean };
export const ink = '#263c48', teal = '#007d78', rust = '#b94d2c', gold = '#e7b356', sky = '#a8d9e1', wood = '#d9ae7d';
export const tau = 2 * Math.PI;
export const seq = (n: number) => Array.from({length:n}, (_,i)=>i);
export const label = (x:number,y:number,value:ReactNode,anchor:'start'|'middle'|'end'='middle',color=ink,size=13) =>
  <text x={x} y={y} textAnchor={anchor} fill={color} stroke="none" fontSize={size} fontWeight="550">{value}</text>;
export const note = (value:string) => label(240,207,value,'middle',ink,Math.min(13,770/value.length));
export const line = (x:number,y:number,X:number,Y:number,color=ink,w=2,dash?:string) =>
  <line x1={x} y1={y} x2={X} y2={Y} stroke={color} strokeWidth={w} strokeDasharray={dash}/>;
export function arrow(x:number,y:number,X:number,Y:number,color=teal) {
  const angle=Math.atan2(Y-y,X-x)*180/Math.PI;
  return <g>{line(x,y,X,Y,color,2.5)}<path transform={`translate(${X} ${Y}) rotate(${angle})`} d="M0 0l-9 -4v8z" fill={color}/></g>;
}
export const path = (d:string,fill='none',stroke=ink,w=2) => <path d={d} fill={fill} stroke={stroke} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round"/>;
export const dot = (x:number,y:number,r:number,fill:string,stroke=ink) => <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="1.6"/>;
export const rect = (x:number,y:number,w:number,h:number,fill:string,rx=2) => <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={ink} strokeWidth="1.6"/>;
export const at = (x:number,y:number,children:ReactNode,scale=1) => <g transform={`translate(${x} ${y}) scale(${scale})`}>{children}</g>;
export function floor(y=156,flat=false) {
  return <g>{!flat&&path(`M22 ${y}l18 -9h418l-18 9z`,'#e6ded1','none')}{line(22,y,455,y,'#837762',2)}</g>;
}
export function cart(x:number,y:number,flat:boolean,c=teal,scale=1){
  return at(x,y,<>{!flat&&path('M-26 -25l8 -6h47v18l-6 5z','#84b1b0')}{rect(-26,-25,51,16,c,3)}{[-16,16].map(a=><g key={a}>{dot(a,-6,6,ink)}{dot(a,-6,2,'#dbe3df')}</g>)}</>,scale);
}
export function ball(x:number,y:number,r:number,flat:boolean,c=gold){
  return <g>{dot(x,y,r,c)}{!flat&&<ellipse cx={x-r*.3} cy={y-r*.38} rx={r*.32} ry={r*.19} fill="#fff" opacity=".65"/>}</g>;
}
export function spring(x:number,y:number,length:number,amplitude=5) {
  return path(`M${x} ${y}l5 0`+seq(14).map((i)=>`l${(length-10)/14} ${i===0?amplitude:i===13?-amplitude:i%2?-2*amplitude:2*amplitude}`).join('')+'l5 0','none',ink,2);
}
export function gauge(x:number,y:number,value:number,scale=1){
  return at(x,y,<>{path('M-17 0h17m80 0h15q8 0 5 -7')}{rect(0,-12,80,24,'#e9f2ee',6)}{spring(4,0,21+value*4,3)}{seq(9).map(i=><g key={i}>{line(27+5*i,-10,27+5*i,-5,ink,1)}</g>)}{line(27+value*5,-8,27+value*5,7,rust,3)}</>,scale);
}
