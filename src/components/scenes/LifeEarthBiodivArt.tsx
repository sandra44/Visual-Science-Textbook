import type { ReactNode } from 'react';

export const ink = '#253f3c', green = '#4d8661', gold = '#dda84e';
export const part = (p: number, a = 0, b = 1) => Math.max(0, Math.min(1, (p - a) / (b - a)));
export const repeat = (n: number, draw: (i: number) => ReactNode) =>
  Array.from({ length: n }, (_, i) => <g key={i}>{draw(i)}</g>);
export function place(x: number, y: number, art: ReactNode, scale = 1, angle = 0) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>{art}</g>;
}
export function shape(d: string, fill: string, stroke = 'none', width = 1.5) {
  return <path {...{d, fill, stroke}} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round"/>;
}
export const line = (d: string, color = ink, w = 1.5) => shape(d, 'none', color, w);
export function label(x: number, y: number, text: string, size = 12, italic = false) {
  return <text x={x} y={y} textAnchor="middle" fill={ink} stroke="#fffaf0" strokeWidth="3.4" paintOrder="stroke"
    fontFamily={italic ? 'Georgia, serif' : 'system-ui, sans-serif'} fontSize={size} fontStyle={italic ? 'italic' : undefined}
    fontWeight="600">{text}</text>;
}
export function leaf(net = true, trace = 1) {
  const blade = net ? 'M0 0Q-39 -26 0 -78Q32 -42 0 0Z' : 'M0 0Q-13 -43 3 -99Q11 -45 0 0Z';
  return <>{shape(blade, net ? '#83aa64' : '#95b561', '#446f4b')}
    {line(`M0 5Q-2 -38 ${net ? 0 : 3} ${net ? -76 : -96}`, '#456b41', 2)}
    <g stroke="#375e3c" fill="none" strokeDasharray={`${trace} 1`}>
      {repeat(net ? 5 : 4, i => net ?
        <path pathLength="1" d={`M0 ${-8-i*10}q-8 -4 ${-12+Math.abs(i-2)} -13m${12-Math.abs(i-2)} 13q8 -6 11 -15m-4 8 2 -7`}/> :
        <path pathLength="1" d={`M${(i-1.5)*2} -3Q${(i-1.5)*6} -45 3 -92`}/>)}
    </g></>;
}
export function fern() {
  return <>{line('M0 0Q-7 -45 8 -99', '#597644', 3)}
    {repeat(11, i => {
      const y = -9-i*7.9, x = -3+i*i*.08, w = 27-i*1.85;
      return <>{[-1,1].map(s => <g key={s} transform={`translate(${x} ${y}) scale(${s} 1)`}>
        {shape(`M0 0Q6 -13 ${w} -18Q${w*.8} -7 0 0Z`, green, '#335e49', 1)}
        {line(`M0 0l${w*.82} -15`, '#a7bd81', .9)}</g>)}</>;
    })}</>;
}
export function sunflower() {
  return <>{line('M0 0Q2 -42 -1 -86', green, 4)}
    {place(0,-23,leaf(),.46,62)}{place(0,-43,leaf(),.37,-62)}
    {place(-1,-84,<>{repeat(13,i => <ellipse cy="-12" rx="4" ry="9" fill="#eab44d" stroke="#c98932" transform={`rotate(${i*360/13})`}/>)}
      <circle r="10" fill="#704736"/>{repeat(8,i=><circle cx={6*Math.cos(i*.78)} cy={6*Math.sin(i*.78)} r="1.3" fill="#bf945a"/>)}</>)}</>;
}
export function mushroom() {
  return <>{shape('M-6 0Q0 -17 -4 -33L6 -34Q4 -14 11 0Z','#f0dbba','#816855')}
    {shape('M-29 -32Q-9 -65 11 -52Q24 -46 30 -34Q8 -22 -29 -32Z','#bd7851','#76503d')}
    {shape('M-28 -32Q0 -39 28 -34Q6 -25 -28 -32Z','#ead2ae','#90664b')}
    {repeat(8,i=>line(`M0 -34l${(i-3.5)*7} ${2-Math.abs(i-3.5)*.6}`, '#89694f',1))}</>;
}
export function beetle(light = false) {
  return <g stroke="#483e38" strokeWidth="1.7">{line('M-5 -5l-9 -5m7 10 -10 1m11 5 -8 6M5 -5l9 -5M7 0l10 1M5 5l8 6M-2 -11l-4 -5m9 5 4 -5')}
    <ellipse cy="-8" rx="5" ry="5" fill="#4b4038"/><ellipse cy="2" rx="8" ry="10" fill={light?'#d6ae76':'#705344'}/>
    {line('M0 -6v16','#433b32',1)}</g>;
}
export function bird(kind: 'finch'|'warbler'|'hornbill'|'pied'|'heron' = 'finch', tilt = 0) {
  const horn = kind==='hornbill'||kind==='pied', heron = kind==='heron';
  return <g>{line(heron?'M-3 1l-4 28 -8 2m16 -30 2 26 7 2':'M-5 1l-2 12 -7 1m14 -13 1 11 7 1','#634c3b',2.1)}
    {shape('M-9 -16L-37 -19 -20 -5Q-6 11 12 1Q24 -3 20 -16Q12 -25 -9 -16Z',
      horn?'#303e40':heron?'#b2c6c4':kind==='warbler'?'#93a162':'#ba926a',ink)}
    {shape('M10 -13Q-2 -24 -21 -14Q-15 -2 -2 -4Z',horn?'#536266':'#8a795c',ink,1)}
    {horn&&line('M-22 -17l-5 6','#faf5df',4)}
    {heron&&line('M13 -10Q29 -9 20 -27T26 -44','#b6c9c6',8)}
    {place(heron?26:17,heron?-44:-19,<g transform={`rotate(${tilt})`}>
      <circle r={horn?11:9} fill={horn?'#e5cca3':heron?'#dae5dd':'#ba9c77'} stroke={ink}/>
      {shape(horn?'M6 -5Q22 -12 39 1Q25 0 7 5Z':`M6 -3L${kind==='finch'?19:heron?39:28} 0 6 ${kind==='finch'?6:2}Z`,gold,'#745d3e',1.2)}
      {horn&&shape(kind==='hornbill'?'M5 -6Q9 -17 23 -11L29 -5Z':'M6 -6Q12 -13 18 -9L23 -5Z','#e9b842','#795c34',1)}
      <circle cx="3" cy="-3" r="1.7" fill={ink}/></g>)}</g>;
}
export function tree(x:number,y:number,s:number, distant=false) {
  return place(x,y,<>{shape('M-6 1l3 -40 -15 -17 17 11 12 -17 -8 27 4 36Z',distant?'#768e75':'#796048')}
    {shape('M-4 -37Q-29 -32 -28 -50Q-40 -65 -20 -71Q-18 -90 -1 -85Q17 -95 22 -77Q43 -71 31 -56Q35 -39 13 -43Z',distant?'#99b49b':'#53866d')}
    {!distant&&shape('M-27 -61Q-34 -71 -19 -72Q-18 -89 -1 -84Q9 -91 17 -82Q0 -79 -2 -67Q-17 -70 -27 -61Z','#79a076')}</>,s);
}
export function ground(flat:boolean) {
  return <>{!flat&&shape('M0 135Q73 87 163 125T329 109Q411 86 480 113V190H0Z','#b3c8af')}
    {shape('M0 155Q95 135 190 153T374 145Q429 140 480 148V220H0Z','#bcc798')}
    {!flat&&shape('M0 181Q102 145 229 169T480 159V220H0Z','#a9b98b')}</>;
}
export function freshwater(flat:boolean) {
  return <><rect width="480" height="220" fill="#dbefdf"/>
    {repeat(flat?11:27,i=><g opacity=".55"><ellipse cx={10+i*79%464} cy={16+i*37%194} rx={2+i%4} ry={1+i%2} fill="#91bca7" transform={`rotate(-10 ${10+i*79%464} ${16+i*37%194})`}/></g>)}
    {repeat(4,i=>place(11+i*13,222,line(`M0 0q14 -19 0 -38t2 -42`, '#a9cfb8',5),.7+i%2*.25))}</>;
}
export function amoeba(extension:number) {
  return <>{shape(`M-49 -8Q-65 -32 -39 -40Q-25 -55 -8 -40Q8 -34 27 -42
      Q${51+extension*26} ${-52+extension*28} ${45+extension*22} ${-31+extension*27}
      Q24 -23 20 -3Q26 13 ${46+extension*19} ${16-extension*17}
      Q${59+extension*16} ${20-extension*19} ${45+extension*13} 29Q22 42 4 36Q-14 50 -31 34Q-63 36 -55 15Z`, '#a9cfc0','#447c72',2.6)}
    <ellipse cx="-20" cy="-6" rx="12" ry="10" fill="#897ba6" stroke="#655976"/><circle cx="-23" cy="-8" r="3" fill="#c7b8cf"/>
    {repeat(10,i=><circle cx={-43+i*13%49} cy={-25+i*17%48} r={1.5+i%3} fill="#80b19e"/>)}</>;
}
export function bacterium() {
  return <><rect x="-51" y="-23" width="102" height="46" rx="23" fill="#9fc49c" stroke="#426e5f" strokeWidth="3"/>
    <rect x="-47" y="-19" width="94" height="38" rx="19" fill="#d2dfae" stroke="#75a387"/>
    {line('M-28 1q10 -18 21 -2t18 0t17 -3q-9 15 -21 1t-20 1t-15 3Z','#8b667f',2.5)}
    {repeat(11,i=><circle cx={-32+i*13%68} cy={i%2?12:-12} r="1.4" fill="#779484"/>)}</>;
}
