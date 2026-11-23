import { Bee, Flower, Leaf, L, Line, amber, many, span } from './LifeEarthReproArt';

function Roots({x,p}:{x:number;p:number}) {
  return <g transform={`translate(${x} 137)`}>{many(7,i=>{
    const a=(i-3)*12,b=19+8*Math.cos(i*2);
    return <g key={i}><Line d={`M0 0Q${a*.14} 13 ${a*.54} ${b}t${a*.5} 22`} progress={p} c="#fce6ad" w={2.7}/>
      <Line d={`M${a*.54} ${b}l${a*.4-8} 6m${8-a*.4} -6 7 13`} progress={span(p,.6)} c="#ffe9b4" w={1.5}/></g>;
  })}</g>;
}
export function Cutting({p,layer}:{p:number;layer:boolean}) {
  const x=layer?100:236, shoot=span(p,.48);
  return <g><path d="M14 123q65 -6 123 -1t109 0t110 0t110 -1v66H14Z" fill="#b79671"/><path d="M14 123q65 -6 123 -1t109 0t110 -1t110 0" fill="none" stroke="#877555" strokeWidth="3"/>
    {many(37,i=><ellipse key={i} cx={22+(i*83)%435} cy={133+(i*19)%48} rx="2.7" ry="1.4" fill="#967c60"/>)}
    <Line d={`M${x} 137q-9 -39 2 -79l9 -19`} c="#65804e" w={7}/><Leaf x={x-1} y={87} flip/><Leaf x={x+3} y={57} s={.82}/>
    <Roots x={x} p={span(p,0,.78)}/><g transform={`translate(${x-3} 97) scale(${shoot})`}><Line d="M0 0q35 -19 42 -55" c="#638443" w={4}/><Leaf x={27} y={-25} s={.65}/><Leaf x={39} y={-44} s={.5} flip/></g>
    {layer?<><Line d="M280 138q-8 -48 -2 -88m-2 25c30 3 42 62 71 62q29 0 50 -73" c="#627e48" w={6}/><Leaf x={278} y={55} flip/><Leaf x={395} y={68} s={.85}/><Roots x={347} p={p}/>
      <L x={99} y={207}>Detached cutting</L><L x={353} y={207}>Layer: still attached</L></>:<><L x={105} y={88}>Stem cutting</L><Line d="M153 85l51 0"/><L x={356} y={50}>New shoot</L><Line d="m304 54 -23 13"/><L x={238} y={207}>Adventitious roots</L></>}
  </g>;
}
export function Mould({p}:{p:number}){
  const h=75*span(p,.32,.85),r=3+16*span(p,.57,.95);
  return <g><path d="M23 149q102 -24 194 -6t238 1l-6 34q-87 17 -215 -1t-206 5Z" fill="#ce9c64" stroke="#966b42" strokeWidth="2"/>
    {many(34,i=><ellipse key={i} cx={36+(i*57)%397} cy={154+(i*3)%17} rx={2+i%4} ry="2" fill="#a8794b"/>)}
    {[-1,1].map(side=><g key={side} transform={`translate(230 144) scale(${side} 1)`}><Line d="M0 0Q31 -14 57 -8T181 -10" c="#4a726d" w={3} progress={span(p,0,.75)}/>
      {many(6,i=><Line key={i} d={`M${13+i*23} -7q12 -10 24 -13m-19 12q7 12 20 16`} c="#526e67" progress={span(p,.04+i*.06,.6+i*.06)}/>)}</g>)}
    <circle cx="230" cy="144" r="5" fill="#675b4d"/>
    {[149,263,324].map((x,i)=><g key={x} opacity={span(p,.32,.53)} transform={`translate(${x} 136) scale(${1-i*.11})`}><Line d={`M0 0q-5 ${-h/2} 4 ${-h}`} c="#557468" w={3}/>
      <circle cx="4" cy={-h} r={r} fill="#85978b" stroke="#465a52"/>{many(10,j=><circle key={j} cx={4+.7*r*Math.cos(j*2.4)} cy={-h+.7*r*Math.sin(j*2.4)} r="2" fill="#485c53"/>)}</g>)}
    {many(7,i=><circle key={i} cx={265+(20+i*9)*span(p,.8)} cy={69-(8+i*4)*span(p,.8)} r="2" opacity={span(p,.8)} fill="#58675c"/>)}
    <L x={145} y={27}>Spore case</L><L x={235} y={205}>Branching hyphae on bread</L>
  </g>;
}
export function FloralSection({p,whorls}:{p:number;whorls:boolean}){
  const stage=whorls?span(p,.48):p;
  return <g><Flower x={232} y={129} s={1.32} open={whorls?.1+.9*p:1} inner={stage}/>
    {whorls?<><Line d="M91 133h62l50 -13"/><L x={78} y={128}>Sepal</L><Line d="M92 52h62l37 26"/><L x={80} y={46}>Petal</L>
      <Line d="M264 87l59 -30h47"/><L x={377} y={51}>Stamen</L><Line d="M238 106l82 22h52"/><L x={384} y={124}>Carpel</L></>:
      <><Line d="M85 62h61l60 25"/><L x={82} y={56}>Anther</L><Line d="M240 69l61 -30h48"/><L x={365} y={34}>Stigma</L><Line d="M239 136l75 13h40"/><L x={375} y={146}>Ovule</L>
      <circle cx={209+23*span(p,0,.5)} cy={86-16*span(p,0,.5)-19*Math.sin(Math.PI*span(p,0,.5))} r="3" fill="#dc9a1d"/>
      <Line d="M231 70q2 20 0 39t4 25" c="#af7229" w={2} progress={span(p,.5)}/></>}
  </g>;
}
function GrainHead({x,y}:{x:number;y:number}){
  return <g transform={`translate(${x} ${y})`}><Line d="M0 56q1 -47 -12 -95" c="#889357" w={3}/>{many(7,i=><g key={i} transform={`translate(${-i*1.5} ${16-i*8}) scale(${i%2?-1:1} 1)`}><path d="M0 1q-16 -1 -17 -18q13 2 17 18" fill="#d5bd74" stroke="#938354"/><Line d="m-17 -16 -6 -15" c="#948453"/><ellipse cx="-9" cy="-7" rx="2" ry="5" fill="#cc9e41"/></g>)}</g>;
}
function Seeds({x,y,p,n=5}:{x:number;y:number;p:number;n?:number}){
  return <g transform={`translate(${x} ${y})`}><path d="M-22 0q17 -21 46 -4q-16 21 -46 4Z" fill="var(--repro-leaf)" stroke="#658055"/>
    {many(n,i=><circle key={i} cx={-13+i*6.4} cy={-2-Math.sin(i)*1.5} r={3.5*p} fill="#f2d998" stroke="#997c45"/>)}</g>;
}
export function Transfer({number,p}:{number:string;p:number}){
  if(number==='Activity 11.6'){
    const set=span(p,.55);
    return <g>{[132,343].map((x,i)=><g key={x}><Flower x={x} y={116} s={.97} open={.05+.95*p}/>
      {!i&&<g stroke="#72929a" fill="none"><path d={`M${x-52} 38q50 -14 105 1l-5 68 -42 25h-12l-43 -25Z`} fill="#dae7e6" fillOpacity=".55"/>{many(8,j=><Line key={j} d={`M${x-44+12*j} 41l3 62`} c="#99b1af" w={1}/>)}</g>}
      {i===1&&<><Bee x={x+51-39*p} y={54-16*Math.sin(p*Math.PI)} s={.75}/><g opacity={set}><Seeds x={x} y={122} p={set}/></g></>}
      <L x={x} y={24}>{i?'Pollen accessible':'Pollen excluded'}</L><L x={x} y={205}>{i?'Seeds may form':'No incoming pollen'}</L></g>)}</g>;
  }
  if(number==='11.2.3'){
    const t=span(p,.08,.95),x=111+246*t,y=85-45*Math.sin(Math.PI*t);
    return <g><Flower x={95} y={130}/><Flower x={358} y={130}/><Bee x={x} y={y} s={.95}/>
      {many(7,i=><circle key={i} cx={x-7+i*2} cy={y+9+i%3} r="1.8" fill="#d99a24"/>)}
      <L x={96} y={211}>Pollen from anther</L><L x={355} y={211}>Received by stigma</L><L x={241} y={18}>Insect carrier</L></g>;
  }
  const evidence=number==='Activity 11.7';
  return <g><GrainHead x={64} y={123}/><GrainHead x={186} y={123}/><Flower x={278} y={129} s={.68}/><Flower x={405} y={129} s={.68}/>
    <L x={120} y={26}>Wind transfer</L><L x={340} y={26}>Insect transfer</L>
    {many(32,i=>{const t=p;return <circle key={i} cx={55+(82+i%7*13)*t} cy={80+i%9*3+(i%8-3)*12*t-15*Math.sin(t*Math.PI)} r={1.8} fill={amber}/>;})}
    <Bee x={290+115*p} y={96-38*Math.sin(p*Math.PI)} s={.72}/>
    {many(5,i=><circle key={i} cx={286+115*p+i*2} cy={103-38*Math.sin(p*Math.PI)+i%2} r="1.5" fill={amber}/>)}
    {evidence?<>{many(3,i=><ellipse key={i} cx={181-i*2} cy={129-i*10} rx={4*span(p,.5)} ry={6*span(p,.5)} fill="#e2be70" stroke="#957344"/>)}<Seeds x={404} y={132} p={span(p,.5)} n={5}/><L x={240} y={204}>Illustrative seed set: compare seeds, not just pollen</L></>:<><L x={121} y={204}>Scattered grains</L><L x={348} y={204}>Flower-to-flower delivery</L></>}
  </g>;
}
